# 在 3D 空间中模拟现实灯光

光源类型可以概括成如下三种：

- **环境光**: 一种可以渗透到场景的每一个角落的光。它是非方向光并且会均匀地照射物体的每一个面，无论这个面是朝向哪个方向的。
- **方向光**: 一束从一个固定的方向照射过来的光。这种光的特点可以理解为好像是从一个很遥远的地方照射过来的，然后光线中的每一个光子与其它光子都是平行运动的。举个例子来说，阳光就可以认为是方向光。
- **点光源光**: 指光线是从一个点发射出来的，是向着四面八方发射的。这种光在我们的现实生活中是最常被用到的。举个例子来说，电灯泡就是向各个方向发射光线的。

关于方向光还是有两点需要注意一下：

1. 需要在每个顶点信息中加入面的朝向法线。这个法线是一个垂直于这个顶点所在平面的向量。
2. 需要明确方向光的传播方向，可以使用一个方向向量来定义。

接下来的例子会更新顶点着色器，考虑到环境光，再考虑到方向光（方向光的作用会因为光线方向与面的夹角关系而不同），计算每一个顶点的颜色。

## 1. 建立顶点法线

首先建立一个数组来存放立方体所有顶点的法线。

```
cubeVerticesNormalBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer)

var vertexNormals = [
  // Front
   0.0,  0.0,  1.0,
   0.0,  0.0,  1.0,
   0.0,  0.0,  1.0,
   0.0,  0.0,  1.0,

  // Back
   0.0,  0.0, -1.0,
   0.0,  0.0, -1.0,
   0.0,  0.0, -1.0,
   0.0,  0.0, -1.0,

  // Top
   0.0,  1.0,  0.0,
   0.0,  1.0,  0.0,
   0.0,  1.0,  0.0,
   0.0,  1.0,  0.0,

  // Bottom
   0.0, -1.0,  0.0,
   0.0, -1.0,  0.0,
   0.0, -1.0,  0.0,
   0.0, -1.0,  0.0,

  // Right
   1.0,  0.0,  0.0,
   1.0,  0.0,  0.0,
   1.0,  0.0,  0.0,
   1.0,  0.0,  0.0,

  // Left
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0
];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW)
```

然后在 `drawScene()`中添加代码，将法线数组和着色器的 attribute 绑定起来以便着色器能够获取到法线数组的信息。

```javascript
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer)
gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0)
```

然后在着色器中建立和传递法线向量矩阵，用这个矩阵来处理当前立方体相对于光源位置法线向量的转换。

```javascript
var normalMatrix = mvMatrix.inverse()
normalMatrix = normalMatrix.transpose()
var nUniform = gl.getUniformLocation(shaderProgram, 'uNormalMatrix')
gl.uniformMatrix4fv(
  nUniform,
  false,
  new WebGLFloatArray(normalMatrix.flatten())
)
```

## 2. 更新着色器

现在着色器需要的所有数据已经全部可以获取到了（或者说全部准备好了），需要更新下着色器本身的代码。

## 2.1 顶点着色器

首先更新顶点着色器，让它给每一个基于环境光和方向光的顶点一个着色器值。让我们看下代码：

```html
<script id="shader-vs" type="x-shader/x-vertex">
  attribute highp vec3 aVertexNormal;
  attribute highp vec3 aVertexPosition;
  attribute highp vec2 aTextureCoord;

  uniform highp mat4 uNormalMatrix;
  uniform highp mat4 uMVMatrix;
  uniform highp mat4 uPMatrix;

  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;

    // Apply lighting effect

    highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);
    highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);
    highp vec3 directionalVector = vec3(0.85, 0.8, 0.75);

    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
  }
</script>
```

一旦顶点位置计算完毕，就可以获得纹理对应于顶点的坐标，从而计算出顶点的阴影。

当方向光的量计算完，我们可以通过获取环境光并且添加方向光的颜色和要提供的定向光的量来生成光照值（lighting value）。最终结果会得到一个 RGB 值，用于片段着色器调整渲染的每一个像素的颜色。

### 2.2 片段着色器

片段着色器现在需要根据顶点着色器计算出的光照值来更新：

```html
<script id="shader-fs" type="x-shader/x-fragment">
  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  uniform sampler2D uSampler;

  void main(void) {
    mediump vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));

    gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
  }
</script>
```

:::demo

```javascript
const app = document.querySelector('#app')
const canvas = document.createElement('canvas')
canvas.width = 400
canvas.height = 300

app.appendChild(canvas)

const gl = canvas.getContext('webgl')

start()

function start() {
  // 顶点着色器
  const vsScource = `
        attribute vec4 aVertexPosition;
        attribute vec3 aVertexNormal;
        attribute vec2 aTextureCoord;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uNormalMatrix;
        uniform mat4 uProjectionMatrix;

        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;

        void main() {
          vTextureCoord = aTextureCoord;
          gl_Position  = uProjectionMatrix * uModelViewMatrix * aVertexPosition;


          highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
          highp vec3 directionalLightColor = vec3(1, 1, 1);
          highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
          highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
          highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
          vLighting = ambientLight + (directionalLightColor * directional);
        }


      `

  // 片段着色器
  const fsSource = `
        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;

        uniform sampler2D uSampler;

        void main() {
          highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
          gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
        }
      `

  // 0： 创建 着色器连接程序 以告诉 WebGL 如何渲染数据
  const shaderProgram = initShaderProgram(gl, vsScource, fsSource)
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      // vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal')
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        'uProjectionMatrix'
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      sampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix')
    }
  }

  // 1. 创建 缓冲区 存储所绘制图形的顶点
  const buffers = initBuffers(gl)

  const texture = loadTextures(
    gl,
    'https://p0.ssl.qhimg.com/t01836de9c0b1068a6d.jpg'
  )

  // 2. 绘制场景
  drawScene(gl, programInfo, buffers, texture)

  let d = 6
  let r = 0

  const step = () => {
    r += 0.1
    drawScene(gl, programInfo, buffers, texture, d, r)
    requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

// 创建 着色器连接程序，将 顶点着色器 和 片段着色器 连接起来
function initShaderProgram(gl, vsScource, fsSource) {
  const vsShader = loadShader(gl, gl.VERTEX_SHADER, vsScource)
  const fsShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

  const shaderProgram = gl.createProgram()
  // 0. 附加着色器
  gl.attachShader(shaderProgram, vsShader)
  // 0. 附加着色器
  gl.attachShader(shaderProgram, fsShader)
  // 1. 连接着色器
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('创建 着色器连接程序 失败!' + gl.getProgramInfoLog(shaderProgram))
    return null
  }

  return shaderProgram
}

// 创建着色器
function loadShader(gl, type, source) {
  // 0. 创建指定类型的 着色器
  const shader = gl.createShader(type)
  // 1. 上传 着色器源码
  gl.shaderSource(shader, source)
  // 2. 编译着色器
  gl.compileShader(shader)

  // 3. 检测 着色器 是否编译成功
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('编译着色器失败！' + gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

// 创建 缓冲区
function initBuffers(gl) {
  // 0. 创建 buffer 存储正方形顶点
  const buffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  // 1. 将顶点传入 WebGL
  const positions = [
    // Front face
    -1.0,
    -1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    1.0,

    // Back face
    -1.0,
    -1.0,
    -1.0,
    -1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    -1.0,
    -1.0,

    // Top face
    -1.0,
    1.0,
    -1.0,
    -1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    -1.0,

    // Bottom face
    -1.0,
    -1.0,
    -1.0,
    1.0,
    -1.0,
    -1.0,
    1.0,
    -1.0,
    1.0,
    -1.0,
    -1.0,
    1.0,

    // Right face
    1.0,
    -1.0,
    -1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    -1.0,
    1.0,

    // Left face
    -1.0,
    -1.0,
    -1.0,
    -1.0,
    -1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    -1.0
  ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  // 三角形数组

  var cubeVerticesIndexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer)

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  var cubeVertexIndices = [
    0,
    1,
    2,
    0,
    2,
    3, // front
    4,
    5,
    6,
    4,
    6,
    7, // back
    8,
    9,
    10,
    8,
    10,
    11, // top
    12,
    13,
    14,
    12,
    14,
    15, // bottom
    16,
    17,
    18,
    16,
    18,
    19, // right
    20,
    21,
    22,
    20,
    22,
    23 // left
  ]

  // Now send the element array to GL

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(cubeVertexIndices),
    gl.STATIC_DRAW
  )

  const textureCoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer)

  const textureCoordinates = [
    // Front
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0,
    // Back
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0,
    // Top
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0,
    // Bottom
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0,
    // Right
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0,
    // Left
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0
  ]

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoordinates),
    gl.STATIC_DRAW
  )

  // 法线
  const cubeVerticesNormalBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer)

  var vertexNormals = [
    // Front
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,

    // Back
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,

    // Top
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,

    // Bottom
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,

    // Right
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,

    // Left
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0
  ]

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertexNormals),
    gl.STATIC_DRAW
  )

  return {
    position: buffer,
    textureCoord: textureCoordBuffer,
    // color: colorBuffer,
    cubeVerticesNormalBuffer,
    cubeVerticesIndexBuffer
  }
}

// 绘制场景
function drawScene(gl, programInfo, buffers, texture, z = 10.0, rotate = 0) {
  gl.clearColor(0.0, 0.0, 0.0, 1)
  gl.clearDepth(1) // 清空
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // 利用 gl-matrix 创建一个 透视投影相机
  const feildOfView = (45 * Math.PI) / 180
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const zNear = 1
  const zFar = 100.0
  const projectionMatrix = mat4.create()
  mat4.perspective(projectionMatrix, feildOfView, aspect, zNear, zFar)

  const modelViewMatrix = mat4.create()
  mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0.0, -z])

  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    rotate, // amount to rotate in radians
    [2, 0, 8]
  )

  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    rotate * 0.7, // amount to rotate in radians
    [2, 1, -8]
  )

  const normalMatrix = mat4.create()
  mat4.invert(normalMatrix, modelViewMatrix)
  mat4.transpose(normalMatrix, normalMatrix)

  {
    const numComponents = 3
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

  // Tell WebGL how to pull out the normals from
  // the normal buffer into the vertexNormal attribute.
  {
    const numComponents = 3
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.cubeVerticesNormalBuffer)
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexNormal,
      numComponents,
      type,
      normalize,
      stride,
      offset
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal)
  }

  {
    const numComponents = 2
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord)
    gl.vertexAttribPointer(
      programInfo.attribLocations.textureCoord,
      numComponents,
      type,
      normalize,
      stride,
      offset
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord)
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.cubeVerticesIndexBuffer)

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
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.normalMatrix,
    false,
    normalMatrix
  )

  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0)

  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture)

  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniformLocations.sampler, 0)

  {
    // const offset = 0;
    // const vertexCount = 4;
    // gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);

    const vertexCount = 36 // 可以尝试修改，一个面 2 个三角形，6个顶点
    const type = gl.UNSIGNED_SHORT
    const offset = 0
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
  }
}

/* 加载纹理，贴图  */
function loadTextures(gl, url) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0
  const internalFormat = gl.RGBA
  const width = 1
  const height = 1
  const border = 0
  const srcFormat = gl.RGBA
  const srcType = gl.UNSIGNED_BYTE
  const pixel = new Uint8Array([0, 0, 255, 255]) // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  )

  const image = new Image()
  image.crossOrigin = ''
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    )

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D)
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    }
  }
  image.src = url

  return texture
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0
}
```

:::
