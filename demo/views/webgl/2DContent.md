# 使用 WebGL 创建 2D 内容

一旦 WebGL 上下文创建成功，便可以在这个上下文中绘制内容了。

## 1. 渲染场景

首先要明确的是，在 WebGL 上下文中绘制内容时，无论绘制什么，都是把它绘制在一个三维空间里。所以，仍然需要创建 **着色器** ，然后通过 **着色器** 来渲染 **场景** 及 **内容**。

## 2. 着色器

**着色器** 是使用 `OpenGL ES Shading Language(GLSL)` 编写的程序。着色器的功能就是记录像素点的位置和颜色。
绘制 `WebGL` 时有两种着色器-- `顶点着色器` 和 `片段着色器` 。`顶点着色器` 和 `片段着色器` 的几何称之为 `着色器程序`。

### 2.1 顶点着色器

在渲染一个形状时，顶点着色器会在形状的每个顶点运行。顶点着色器负责将输入的顶点转换到 `WebGL` 使用的缩放空间（ClipSpace）坐标系，其中每个轴的坐标范围从 -1.0 到 1.0 ,并且不考虑纵横比，实际尺寸或任何其他因素。

顶点着色器对顶点坐标进行转换时，会在每个顶点的基础上进行调整计算，然后将其保存到由 `GLSL` 提供的特殊变量 `gl_Position` 中来返回变换后的顶点。此外，顶点着色器也可以用于哪个决定包含 textl 面部纹理的坐标可以用于顶点；也可以用于通过法线来确定应用到顶点的光照因子等；然后将这些信息存储在 `变量（varyings）` 或 `属性（attributes）` 中，以便与 片段着色器 共享。

举个例子，下面的顶点着色器接收一个 `aVertexPosition` 属性的顶点位置值，然后这个值与两个 4x4`（uProjectionMatrix` 和 `uModelMatrix`） 的矩阵相乘赋值给 `gl_Position`。

```glsl
attribute vec4 aVertexPosition;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;

void main() {
  gl_Position = uProjectionMatrix * uModelMatrix * aVertexPosition;
}
```

### 2.2 片段着色器

片段着色器 在 顶点着色器处理完图形的顶点后，会被要绘制的**每个图形的每个像素点调用一次**。它的职责就是确定每个像素的颜色，通过指定应用到像素的纹理元素（也就是 图形纹理中的像素），获取纹理元素的颜色，然后将适当的光照应用于颜色，之后将颜色存储到 `GLSL` 提供的特殊变量 `gl_FragColor` 中，返回给 `WebGL`。该颜色最终会绘制到屏幕上图形对应像素的对应位置。

```glsl
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
```

### 2.3 初始化着色器

定义完 顶点着色器 和 片段着色器 之后，需要它们传递给 `WebGL`。这个过程可以分为两部：

1. 上传着色器源码，编译着色器
2. 连接两着色器到着色器程序

```javascript
// 加载 着色器
function loadShader(gl, type, source) {
  // 0. 创建指定类型的着色器
  const shader = gl.createShader(type)

  // 1. 上传源码
  gl.shaderSource(shader, source)

  // 2. 编译着色器
  gl.compileShader(shader)

  // 检测编译状态
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('编译失败！', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

// 链接着色器程序
function initShaderProgram(gl, vsSouce, fsSource) {
  // 0. 创建两类型着色器
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl._FRAGMENT_SHADER, fsSource)

  // 1. 附加着色器程序
  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  // 检测链接状态
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('初始化着色器程序失败', gl.getProgramInfoLog(shaderProgram))
    return null
  }

  return shaderProgram
}
```

在创建着色器程序之后，需要查找 `WebGL` 返回分配的输入位置。

举个例子：

```glsl
attribute vec4 aVertexPosition;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

void main() {
  gl_Position = uProjectionMatrix * uModelMatrix * aVertexPosition;
}
```

在该顶点着色器中，有一个属性 `aVertexPosition` 和 两个 `uniforms` 。属性从缓冲区接收值。顶点着色器每次迭代都从分配给该属性的缓冲区接收下一个值。`uniforms` 类似于 JavaScript 的全局变量，它们在每次迭代中保持相同的值。在 JavaScript 中我们可以这样获取到 `glsl` 中 `attribute` 和 `uniforms`（只有找到它，才能为它绑定值）。

```javascript
const programInfo = {
  program: shaderProgram,
  attributeLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
    ModelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
  }
}
```

## 3. 绘制正方形

:::demo

```javascript
const app = document.querySelector('#app')
const canvas = document.createElement('canvas')
canvas.width = 400
canvas.height = 300

app.appendChild(canvas)

const gl = canvas.getContext('webgl')

// 顶点着色器
const vsSource = `
  attribute vec4 aVertexPosition;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }
`

// 片段着色器
const fsSource = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`

// 着色器程序
const shaderProgram = initShaderProgram(gl, vsSource, fsSource)
const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
    modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
  }
}

// 创建缓冲区
const buffers = initBuffers(gl)
//  绘制场景
drawScene(gl, programInfo, buffers)

// 加载 着色器
function loadShader(gl, type, source) {
  // 0. 创建指定类型的着色器
  const shader = gl.createShader(type)

  // 1. 上传源码
  gl.shaderSource(shader, source)

  // 2. 编译着色器
  gl.compileShader(shader)

  // 检测编译状态
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('编译失败！', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

// 链接着色器程序
function initShaderProgram(gl, vsSouce, fsSource) {
  // 0. 创建两类型着色器
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

  // 1. 附加着色器程序
  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  // 检测链接状态
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('初始化着色器程序失败', gl.getProgramInfoLog(shaderProgram))
    return null
  }

  return shaderProgram
}

function initBuffers(gl) {
  // 0. 创建 buffer 存储正方形顶点
  const buffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  // 1. 将顶点传入 WebGL
  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  return { position: buffer }
}

// 绘制场景
function drawScene(gl, programInfo, buffers, z = 8.0) {
  gl.clearColor(0.0, 0.0, 0.0, 1)
  gl.clearDepth(1) // 清空
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // 利用 gl-matrix 创建一个 透视投影相机
  const feildOfView = (45 * Math.PI) / 180
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const zNear = 0.1
  const zFar = 100.0
  const projectionMatrix = mat4.create()
  mat4.perspective(projectionMatrix, feildOfView, aspect, zNear, zFar)

  const modelViewMatrix = mat4.create()
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -z])

  {
    const numComponents = 2
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
  }

  // 告知 WebGL 使用 着色器 绘制
  gl.useProgram(programInfo.program)

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  )
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  )

  {
    const offset = 0
    const vertexCount = 4
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)
  }
}
```

:::
