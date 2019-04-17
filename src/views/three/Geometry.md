# 几何形状

创建物体时，需要传入 2 个参数，一个是几何形状（Geometry），另一个是材质（Material）。

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.querySelector('#app').appendChild(renderer.domElement)

// 0. 初始化场景
const scene = new THREE.Scene()

// 1. 初始化相机
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  200
)
camera.position.set(0, 0, 150)
scene.add(camera)

let box = null
let circle = null
let cone = null
let cylinder = null
let sphere = null
let plane = null
let torus = null

// 2. 创建物体
{
  const material = new THREE.MeshNormalMaterial()

  // 立方体
  box = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), material)
  box.position.set(-50, 20, 0)
  scene.add(box)

  // 圆
  circle = new THREE.Mesh(new THREE.CircleGeometry(5, 32), material)
  circle.position.set(-20, 20, 0)
  scene.add(circle)

  // 圆锥
  cone = new THREE.Mesh(new THREE.ConeGeometry(5, 20, 32), material)
  cone.position.set(20, 20, 0)
  scene.add(cone)

  // 圆柱
  cylinder = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 20, 32), material)
  cylinder.position.set(50, 20, 0)
  scene.add(cylinder)

  // 球
  sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), material)
  sphere.position.set(-35, -20, 0)
  scene.add(sphere)

  // 平面
  plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
  plane.position.set(0, -20, 0)
  scene.add(plane)

  // 圆环
  torus = new THREE.Mesh(new THREE.TorusGeometry(10, 3, 16, 100), material)
  torus.position.set(35, -20, 0)
  scene.add(torus)
}

// 3. 渲染（动画）
let rotation = 0

function animate() {
  rotation += 0.01

  void [box, circle, cone, cylinder, sphere, plane, torus].forEach(mesh => {
    mesh.rotation.set(rotation, rotation, rotation)
  })

  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}

animate()
```

:::

## 基本几何形状

### 立方体

立方体的构造函数是：`THREE.CubeGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)`。

width 是 x 方向上的长度；height 是 y 方向上的长度；depth 是 z 方向上的长度；后三个参数分别是在三个方向上的分段数，如 widthSegments 为 3 的话，代表 x 方向上水平分为三份。一般情况下不需要分段的话，可以不设置后三个参数，后三个参数的缺省值为 1

- width: x 轴方向上长度
- height: y 轴方向上长度
- depth: z 轴方向上长度
- widthSegments、heightSegments、depthSegments: 分别对应 3 个轴方向上的分段数

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)
const scene = new THREE.Scene()

const cube = new THREE.Mesh(
  new THREE.CubeGeometry(1, 1, 1, 1, 2, 3),
  new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
)
const box = new THREE.BoxHelper(cube)

const camera = new THREE.PerspectiveCamera(30, 400 / 300, 1, 10)
camera.position.set(2, -4, 3)
camera.lookAt(new THREE.Vector3(0, 0, 0))

scene.add(box)
scene.add(camera)

renderer.render(scene, camera)
```

:::

### 平面

平面的构造函数为：`THREE.PlaneGeometry(width, height, widthSegemnts, heightSegements)`。创建的平面是在 x 轴和 y 轴所在平面。

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 2, 2),
  new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
)
const box = new THREE.BoxHelper(plane)

const camera = new THREE.PerspectiveCamera(30, 4 / 3, 1, 10)
camera.position.set(0, 0, 3)
scene.add(box)
scene.add(camera)

renderer.render(scene, camera)
```

:::

### 球体

球体的构造函数为：`THREE.SphereGeometry(radius, segemntsWidth, segmentsHeight, phiStart, phiLength, thetaStart, thetaLength)`。

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(
    2,
    8,
    6,
    Math.PI * 0,
    Math.PI * 2,
    0,
    (Math.PI * 2) / 1
  ),
  new THREE.MeshBasicMaterial({ color: 0x00fff0, wireframe: true })
)

sphere.rotation.x = 0

const camera = new THREE.PerspectiveCamera(60, 4 / 3, 1, 10)
camera.position.set(0, 0, 4)
camera.lookAt(new THREE.Vector3(0, 0, 0))

scene.add(sphere)
scene.add(camera)

renderer.render(scene, camera)
```

:::

### 圆形

圆形的构造函数为：`THREE.CircleGeometry(radius, segemnts, thetaStart, thetaLength)`。

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()
const circle = new THREE.Mesh(
  new THREE.CircleGeometry(1, 10, Math.PI * 0.2, Math.PI * 1.2),
  new THREE.MeshBasicMaterial({ color: 0x00ff0f })
)

const camera = new THREE.OrthographicCamera(-2, 2, 1.5, -1.5, 1, 10)
camera.position.set(0, 0, 4)

scene.add(circle)
scene.add(camera)

renderer.render(scene, camera)
```

:::

### 圆柱体

圆柱体的构造函数为：`THREE.CylinderGeometry(radiuTop, radiusBottom, height, radiusSegments, heightSegements, openEnded)`。

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 2, 18, 3, true),
  new THREE.MeshBasicMaterial({ color: 0x0f00f0, wireframe: true })
)

const camera = new THREE.PerspectiveCamera(60, 4 / 3, 1, 10)
camera.position.set(2, 0, 4)
camera.lookAt(new THREE.Vector3(0, 0, 0))

scene.add(cylinder)
scene.add(camera)

renderer.render(scene, camera)
```

:::

### 正四面体、正八面体、正十二面体

正四面体、正八面体、正十二面体构造函数类似：

```javascript
THREE.TetrahedronGeometry(radius, details)
THREE.OctahedronGeometry(radius, details)
THREE.IcosaheadronGeometry(radius, details)
```

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const tetra = new THREE.Mesh(
  new THREE.TetrahedronGeometry(1),
  new THREE.MeshBasicMaterial({ color: 0xff0f0f, wireframe: true })
)

tetra.rotation.set(0, 2, 2)

const camera = new THREE.PerspectiveCamera(60, 4 / 3, 1, 10)
camera.position.set(0, 0, 4)
camera.lookAt(new THREE.Vector3(0, 0, 0))

scene.add(tetra)
scene.add(camera)

renderer.render(scene, camera)
```

:::

### 圆环面

圆环面的构造函数为：`THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc)`。

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(2, 1, 0, 10, Math.PI * 1.5),
  new THREE.MeshBasicMaterial({ color: 0x00ff11, wireframe: true })
)

const camera = new THREE.PerspectiveCamera(60, 4 / 3, 1, 10)
camera.position.set(0, 0, 8)
camera.lookAt(new THREE.Vector3(0, 0, 0))

scene.add(torus)
scene.add(camera)

renderer.render(scene, camera)
```

:::

### 圆环结

圆环结的构造函数为：`THREE.TorusKnotGeometry(radius, tube, radialSegments tubularSegments, p, q, hieghtScale)`。

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(4, 1, 32, 8),
  new THREE.MeshBasicMaterial({ color: 0xf0f000, wireframe: true })
)

const camera = new THREE.PerspectiveCamera(120, 4 / 3, 1, 10)
camera.position.set(0, 0, 6)

scene.add(torusKnot)
scene.add(camera)

renderer.render(scene, camera)
```

:::

### 文字

文字的构造函数为：`THREE.TextGeometry(text, params)`。

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, 4 / 3, 1, 100)
camera.position.set(0, 0, 8)
camera.lookAt(scene.position)

scene.add(camera)

const light = new THREE.PointLight(0xff0000)
light.position.set(0, 15, 0)
scene.add(light)

const skyBoxGeometry = new THREE.CubeGeometry(100, 100, 1)
const skyBoxMaterial = new THREE.MeshBasicMaterial({
  color: 0x9999ff,
  side: THREE.BackSide
})
const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial)
scene.fog = new THREE.FogExp2(0x9999ff, 0.00025)

scene.add(skyBox)

new THREE.TextureLoader().load(
  'https://p0.ssl.qhimg.com/t019e99d7457920c421.png',
  texture => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(10, 10)

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6, 10, 10),
      new THREE.MeshBasicMaterial({ map: texture })
    )

    floor.position.y = 0
    floor.rotation.x = -0.4 * Math.PI
    scene.add(floor)

    new THREE.FontLoader().load(
      'https://dpxr-graph-bed.oss-cn-beijing.aliyuncs.com/helvetiker_regular.typeface.json',
      font => {
        const textGeom = new THREE.TextGeometry('Hello, World!', {
          size: 0.3, //字号大小，一般为大写字母的高度
          height: 0.15, //文字的厚度
          curveSegments: 3, //弧线分段数，使得文字的曲线更加光滑

          font: font, //字体，默认是'helvetiker'，需对应引用的字体文件
          weight: 'normal', //值为'normal'或'bold'，表示是否加粗
          style: 'normal', //值为'normal'或'italics'，表示是否斜体

          bevelThickness: 0.01, //倒角厚度
          bevelSize: 0.02, //倒角宽度
          bevelEnabled: true //布尔值，是否使用倒角，意为在边缘处斜切
        })

        const materialFront = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const materialSide = new THREE.MeshBasicMaterial({ color: 0x000088 })
        const materialArray = [materialFront, materialSide]
        const textMesh = new THREE.Mesh(textGeom, materialArray)

        textGeom.computeBoundingBox()
        const textWidth =
          textGeom.boundingBox.max.x - textGeom.boundingBox.min.x

        textMesh.position.set(-0.5 * textWidth, 0.3, 4)
        textMesh.rotation.x = -0.2 * Math.PI
        scene.add(textMesh)

        renderer.render(scene, camera)
      }
    )
  }
)
```

:::
