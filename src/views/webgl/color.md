# 使用 着色器 将颜色应用到 WebGL

## 给顶点着色

在 `WebGL` 中，物体是由一系列顶点组成的，每一个顶点都有位置和颜色信息。默认情况下，所有像素的颜色（及它所有的属性，包括位置等）都是由 线性插值 计算得来，自动形成平滑的渐变。

假设要为正方形的每个顶点使用不同的颜色，以此渲染一个渐变的色彩。

第一步，为顶点建立相应的颜色。首先是创建一个顶点颜色数组，然后将它们存到 WebGL 缓冲区中。

```
const colors = [
  1, 1, 1, 1, // 白色
  1, 0, 0, 1, // 红色
  0, 1, 0, 1, // 绿色
  0, 0, 1, 1, // 蓝色
]

const buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
```

为了应用这些颜色，需要继续修改 顶点着色器，使得着色器可以从颜色缓冲区读取出正确的颜色。

```html
<script type="x-shader/x-vertex">
  attribute vec3 aVertextPosition;
  attribute vec4 aVertexColor;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying lowp vec4 vColor;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vColor = aVertexColor;
  }
</script>
```

## 给片段着色

为了使每个像素都得到插值后的颜色，只需要在 `vColor` 变量中获取颜色值。

```html
<script type="x-shader/x-fragment">
  varying lowp vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
</script>
```

## 绘制

接下来，只要在 WebGL 中初始化颜色属性，然后在绘制部分使用这些颜色即可。

```javascript
const vertexColorAttribute = gl.getAttribLocation(shaderProgram, 'aVertexColor')
gl.enableVertexAttribArray(vertexColorAttribute)
gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0)
```

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
  attribute vec4 aVertexColor;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying lowp vec4 vColor;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
  }
`

// 片段着色器
const fsSource = `
  varying lowp vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
`

// 着色器程序
const shaderProgram = initShaderProgram(gl, vsSource, fsSource)
const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor')
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

  // 2. 颜色
  const colors = [
    1,
    1,
    1,
    1, // 白色
    1,
    0,
    0,
    1, // 红色
    0,
    1,
    0,
    1, // 绿色
    0,
    0,
    1,
    1 // 蓝色
  ]

  const color = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, color)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

  return { position: buffer, color }
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

  {
    const numComponents = 4
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor)
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
