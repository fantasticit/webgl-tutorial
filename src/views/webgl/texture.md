# 加载纹理

现在使用一张单一的纹理贴到立方体的 6 个面上，但是同样的方法可以用来加载任意数量的纹理贴图。

> 注意：对纹理的加载同样需要遵循跨域访问规则；也就是说你只能从允许跨域访问的网址加载你需要的纹理。

```javascript
function initTextures() {
  cubeTexture = gl.createTexture()
  cubeImage = new Image()
  cubeImage.onload = function() {
    handleTextureLoaded(cubeImage, cubeTexture)
  }
  cubeImage.src = 'cubetexture.png'
}

function handleTextureLoaded(image, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_NEAREST
  )
  gl.generateMipmap(gl.TEXTURE_2D)
  gl.bindTexture(gl.TEXTURE_2D, null)
}
```

函数 `initTextures()` 首先调用 `gl.createTexture()` 函数来创建一个 WebGL 纹理对象 `cubeTexture` 。

为了真正地形成纹理，通过把新创建的纹理对象绑定到 `gl.TEXTURE_2D` 来让它成为当前操作纹理。然后通过调用 `texImage2D()` 把已经加载的图片图形数据写到纹理。

> 注意： 在多数情况下，纹理的宽和高都必须是 2 的幂（如：1，2，4，8，16 等等）。如果有什么特殊情况请参考下面的“非 2 的幂纹理”小节。

代码的接下来两行设置了纹理过滤器，过滤器用来控制当图片缩放时像素如何生成如何插值。在这个例子里，对图片放大使用的是线性过滤，而对图片缩小使用的是多级渐进纹理过滤。接下来通过调用 `generateMipMap()` 来生成多级渐进纹理，接着通过给 `gl.TEXTURE_2D` 绑定值 `null` 来告诉 `WebGL` 对当前纹理的操作已经结束了。

## 非 2 的幂纹理

一般来说，宽和高都是 2 的幂的纹理使用是最理想的。2 的幂纹理在渲染内存里的存储更高效，而且对它们的使用限制也更少。由美术工作人员生成的纹理最终在用来渲染前都应该使用放大或缩小的方式把它生成为 2 的幂纹理，其实事实上来说，在创作纹理之初就应该直接使用大小是 2 的幂的宽和高。纹理的每一边都应该是像 1，2，4，8，16，32，64，128，256，512，1024 或 2048 这样的值。当然也要注意尺寸的大小，因为虽说现在的大部分设置都已经可以支持 4096 像素的图片，但也不是全部；而有一些设备甚至可以支持 8192 或更高像素呢。

有的时候从你的特定情况出发，使用 2 的幂纹理会比较困难。当使用到第三方的资源时，一般来说最好的方式就是先使用 HTML5 的画布把图片修正成 2 的幂然后再放到 WebGL 中进行渲染使用，这样一来，如果图片拉伸比较明显的话纹理坐标的值可需要适当地进行修正。

但是，如果你一定要使用非 2 的幂纹理的话，WebGL 也有原生支持，不过这些支持是受限的。当然在某些情况下使用非 2 的幂纹理也是很有用的，比如这张纹理刚好与你的显示器的分辨率相匹配，或者使用画布重新生成纹理的方式并不值得时。但是要特别注意的是：这种非 2 的幂纹理不能用来生成多级渐进纹理，而且不能使用纹理重复（重复纹理寻址等）。

使用重复纹理寻址的一个例子就是使用一张砖块的纹理来平铺满一面墙壁。

多级渐进纹理和纹理坐标重复可以通过调用 texParameteri() 来禁用，当然首先你已经通过调用 bindTexture() 绑定过纹理了。这样虽然已经可以使用非 2 的幂纹理了，但是你将无法使用多级渐进纹理，纹理坐标包装，纹理坐标重复，而且无法控制设备如何处理你的纹理。

```javascript
// gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
// Prevents s-coordinate wrapping (repeating).
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
// Prevents t-coordinate wrapping (repeating).
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
```

现在，当使用以上参数时，兼容 WebGL 的设备就会自动变得可以使用任何分辨率的纹理（当然还要考虑像素上限）。如果不使用上面这些参数的话，任何非 2 的幂纹理使用都会失败然后返回一张纯黑图片。

## 映射纹理到面

现在，纹理已经加载好了，而且已经可以使用了。但是在使用之前我们还要创建好纹理坐标到立方体各个面的顶点的映射关系。下面的代码通过替换之前的设置每个面颜色的代码，当然还是在 initBuffers() 函数里。

```
cubeVerticesTextureCoordBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer)
var textureCoordinates = [
  // Front
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  // Back
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  // Top
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  // Bottom
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  // Right
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  // Left
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0
];
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(textureCoordinates),
  gl.STATIC_DRAW
)
```

首先，代码创建了一个 WebGL 缓存区，用来保存每个面的纹理坐标信息，然后把这个缓存区绑定到 WebGL 以方便我们写入数据。

数组变量 textureCoordinates 中定义好了与每个面上的每个顶点一一对应的纹理坐标。请注意，纹理坐标的取值范围只能从 0.0 到 1.0，所以不论纹理贴图的实际大小是多少，为了实现纹理映射，我们要使用的纹理坐标只能规范化到 0.0 到 1.0 的范围内。

纹理坐标信息给定了之后，把这个数组里的数据都写到 WebGL 缓存区，这样 WebGL 就能使用这个坐标数据了。

## 更新着色器

为了使用纹理来代替单一的颜色，着色器程序和着色器程序的初始化代码都需要进行修改。

先让我们看一看需要加入函数 initShaders() 里的非常简单的改变：

```javascript
textureCoordAttribute = gl.getAttribLocation(shaderProgram, 'aTextureCoord')
gl.enableVertexAttribArray(textureCoordAttribute)
gl.vertexAttribPointer(texCoordAttribute, 2, gl.FLOAT, false, 0, 0)
```

这段代码中我们使用包含纹理坐标信息的属性替换之前使用的顶点颜色属性。

### 顶点着色器

接下来我们会修改顶点着色器代码，现在不再需要获取顶点颜色数据，而是获取纹理坐标数据。

```html
<script id="shader-vs" type="x-shader/x-vertex">
  attribute vec3 aVertexPosition;
  attribute vec2 aTextureCoord;

  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;

  varying highp vec2 vTextureCoord;

  void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
  }
</script>
```

代码的关键更改在于不再获取顶点颜色数据转而获取和设置纹理坐标数据；这样就能把顶点与其对应的纹理联系在一起了。

### 片段着色器

那么片段着色器也要相应地进行更改：

```html
<script id="shader-fs" type="x-shader/x-fragment">
  varying highp vec2 vTextureCoord;

  uniform sampler2D uSampler;

  void main(void) {
    gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
  }
</script>
```

现在的代码不会再使用一个简单的颜色值填充片段颜色，片段的颜色是通过采样器使用最好的映射方式从纹理中的每一个像素计算出来的。

绘制具体纹理贴图的立方体节
接下来是对 drawScene() 函数的更改，为了使整体的代码看起来更简洁，我们去掉了让立方体位置变化的代码，现在它只会随着时间的变化进行旋转，而为了使用纹理，所要进行的代码更改确是很少的。

使用下面的代码代替映射颜色到纹理的代码：

```javascript
gl.activeTexture(gl.TEXTURE0)
gl.bindTexture(gl.TEXTURE_2D, cubeTexture)
gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uSampler'), 0)
```

WebGL 最多可同时注册 32 张纹理；`gl.TEXTURE0` 是第一张。我们把我们之前加载的纹理绑定到了第一个寄存器，然后着色器程序里的采样器 uSampler 就会完成它的功能：使用纹理。

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
        attribute vec2 aTextureCoord;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying highp vec2 vTextureCoord;

        void main() {
          vTextureCoord = aTextureCoord;
          gl_Position  = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
      `

  // 片段着色器
  const fsSource = `
        varying highp vec2 vTextureCoord;

        uniform sampler2D uSampler;

        void main() {
          gl_FragColor = texture2D(uSampler, vTextureCoord);
        }
      `

  // 0： 创建 着色器连接程序 以告诉 WebGL 如何渲染数据
  const shaderProgram = initShaderProgram(gl, vsScource, fsSource)
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      // vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord')
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        'uProjectionMatrix'
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      sampler: gl.getUniformLocation(shaderProgram, 'uSampler')
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

  var cubeVerticesIndexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer)

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

  return {
    position: buffer,
    textureCoord: textureCoordBuffer,
    // color: colorBuffer,
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
  const zNear = 0.1
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
