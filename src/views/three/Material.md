# 材质

材质是独立于物体顶点信息之外的与渲染效果相关的属性。通过设置材质可以改变物体的颜色、纹理贴图、光照模式等。

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

// 2, 创建灯光
const light = new THREE.DirectionalLight(0xffffff) // 白色平行光
light.position.set(20, 50, 50)
scene.add(light)

scene.add(new THREE.AmbientLight(0x333322)) // 全局环境光

let box = null
let circle = null
let cone = null
let cylinder = null
let sphere = null
let plane = null
let torus = null
let line = null
let curveLine = null

// 3. 创建物体
{
  const material = new THREE.MeshNormalMaterial()

  // 立方体
  box = new THREE.Mesh(
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.MeshLambertMaterial({ color: 0x00ff43 })
  )
  box.position.set(-50, 20, 0)
  scene.add(box)

  // 圆
  circle = new THREE.Mesh(new THREE.CircleGeometry(5, 32), material)
  circle.position.set(-20, 20, 0)
  scene.add(circle)

  // 圆锥
  cone = new THREE.Mesh(
    new THREE.ConeGeometry(5, 20, 32),
    new THREE.MeshPhongMaterial({ color: 0xf0f4ed })
  )
  cone.position.set(20, 20, 0)
  scene.add(cone)

  // 圆柱
  cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(5, 5, 20, 32),
    new THREE.MeshPhongMaterial({ color: 0x23f4cb })
  )
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
  torus = new THREE.Mesh(
    new THREE.TorusGeometry(10, 3, 16, 100),
    new THREE.MeshPhongMaterial({ color: 0x48cefa })
  )
  torus.position.set(35, -20, 0)
  scene.add(torus)

  const points = [
    new THREE.Vector3(-10, 0, 5),
    new THREE.Vector3(-5, 15, 5),
    new THREE.Vector3(20, 15, -5),
    new THREE.Vector3(10, 0, 5)
  ]

  // 直线
  {
    const lineGeometry = new THREE.Geometry()
    lineGeometry.setFromPoints(points)
    line = new THREE.Line(
      lineGeometry,
      new THREE.LineBasicMaterial({ color: 0x00ff00 })
    )
    line.position.set(-65, -30, 0)
    scene.add(line)
  }

  // 曲线
  {
    const curve = new THREE.CatmullRomCurve3(points)
    const points2 = curve.getPoints(50) // 获取当前曲线分成 50 段后的所有顶点
    const curveGeometry = new THREE.BufferGeometry().setFromPoints(points2)
    curveLine = new THREE.Line(
      curveGeometry,
      new THREE.LineDashedMaterial({ color: 0xff0000 })
    )
    curveLine.computeLineDistances() // 需要重新计算位置才能显示出虚线
    curveLine.position.set(-65, -30, 0)
    scene.add(curveLine)
  }
}

// 4. 渲染（动画）
let rotation = 0

function animate() {
  rotation += 0.01

  void [
    box,
    circle,
    cone,
    cylinder,
    sphere,
    plane,
    torus,
    line,
    curveLine
  ].forEach(mesh => {
    mesh.rotation.set(rotation, rotation, rotation)
  })

  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}

animate()
```

:::

## 1. 基本材质

使用基本材质的物体，渲染后物体的颜色始终为该材质的颜色，而不会由于光照产生明暗、阴影效果。其构造函数为：

`THREE.MeshBasicMaterial(opts)`

常用属性：

- `visible`: 是否可见
- `side`: 渲染正面或是反面，默认正面（`THREE.FrontSide`），可设置为 反面（`THREE.BackSide`） 或者 双面（`THREE.DoubleSide`）
- `wireframe`: 是否渲染线而非面，默认 `false`
- `color`: 十六进制颜色
- `map`: 使用纹理贴图

## 2. Lambert 材质

Lambert 材质是符合 Lambert 光照模型的材质。该材质主要特点：只考虑漫反射而不考虑镜面反射，因而对于金属、镜子需要镜面反射效果的物体就不适应。

其构造函数为：`THREE.MeshLambertMaterial(opts)`

常用属性：

- `color`: 表现材质对散射光的反射能力
- `ambient`: 表现材质对环境光的反射能力。只有当设置了 `AmbientLight` 后，该值才有效。
- `emissive`: 材质自发光的颜色

> 最近版本的 THREE.js 移除了 `ambient` 属性。因为 `color` 属性已经可以反应出物体颜色（想想为什么可以看到不同颜色的物体）。见 [ambient removed, how configure to get same rendering results?](https://stackoverflow.com/questions/34773168/three-js-r71-ambient-removed-how-configure-to-get-same-rendering-results)。

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(30, 400 / 300, 1, 10)
camera.position.set(2, 4, 3)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

const cube = new THREE.Mesh(
  new THREE.CubeGeometry(1, 1, 1, 1, 2, 3),
  new THREE.MeshLambertMaterial({
    color: 0xff0000,
    emissive: 0x00ff00
  })
)

const light = new THREE.PointLight(0xffff00, 1, 1000)
light.position.set(10, 15, 20)
scene.add(light)

scene.add(cube)

renderer.render(scene, camera)
```

:::

> PS: 无光照，故提现不出材质差异

## 3. Phong 材质

Phong 材质是符合 Phong 光照模型的材质。和 Lamber 材质不同的是，Phong 材质考虑了镜面反射的效果，因此适用于金属、镜面的表现。

其构造函数为：`THREE.MeshPhongMaterail(opts)`

常用属性：

- `specular`: 指定镜面反射系数
- `shininess`: 控制光照模型中的 n 值。值越大，高亮的光斑越小，默认值为 30

## 4. 法向材质

法向材质可以将材质的颜色设置为其法向量的方向。有时候有助于调试。

其构造函数为： `new THREE.MeshNormalMaterial()`。

## 5. 材质的纹理贴图

有时候可能需要使用图像作为材质。这时候就需要导入图像作为纹理贴图，并添加到相应的材质中。

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)
const scene = new THREE.Scene()

const loader = new THREE.TextureLoader()

loader.load('https://p2.ssl.qhimg.com/t0149eca9091f0310d4.png', texture => {
  const cube = new THREE.Mesh(
    new THREE.CubeGeometry(5, 5, 5),
    new THREE.MeshLambertMaterial({ map: texture, color: 0xff0000 })
  )

  const light = new THREE.PointLight(0xffff00, 1, 1000)
  light.position.set(10, 15, 20)
  scene.add(light)

  const camera = new THREE.OrthographicCamera(-10, 10, 7.5, -7.5, 1, 100)
  camera.position.set(25, -25, 60)
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  scene.add(cube)
  scene.add(camera)

  renderer.render(scene, camera)
})
```

:::

多纹理：

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const light = new THREE.PointLight(0xff0000, 1, 1000)
light.position.set(10, 15, 20)
scene.add(light)

const camera = new THREE.OrthographicCamera(-10, 10, 8, -8, 1, 100)
camera.position.set(25, -25, 60)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

const imgs = [
  'https://p2.ssl.qhimg.com/t0149eca9091f0310d4.png',
  'https://p1.ssl.qhimg.com/t01cf3db281ab68c017.png',
  'https://p4.ssl.qhimg.com/t01df13d2d7a7072014.png',
  'https://p0.ssl.qhimg.com/t010c418274f4f4e1e5.png',
  'https://p0.ssl.qhimg.com/t01fedab8bbddf9a2c6.png',
  'https://p4.ssl.qhimg.com/t014f9eb6d7ca02742a.png'
]

const loader = new THREE.TextureLoader()

function loadTexture(url) {
  return new Promise(resolve => {
    loader.load(url, texture => resolve(texture))
  })
}

Promise.all(imgs.map(loadTexture)).then(textures => {
  const maps = textures.map(texture => {
    return new THREE.MeshLambertMaterial({ map: texture })
  })

  const cube = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 5), maps)

  scene.add(cube)

  const step = () => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    renderer.render(scene, camera)

    requestAnimationFrame(step)
  }

  step()
})
```

:::

重复纹理：

demo 中使用的图片为：<img src="https://p0.ssl.qhimg.com/t019e99d7457920c421.png" alt="chess">

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(30, 400 / 300, 1, 100)
camera.position.set(0, 0, 30)
// camera.lookAt()
scene.add(camera)

const loader = new THREE.TextureLoader()
loader.load('https://p0.ssl.qhimg.com/t019e99d7457920c421.png', texture => {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 2, 2),
    new THREE.MeshBasicMaterial({ map: texture, color: 0xffff00 })
  )

  scene.add(plane)

  renderer.render(scene, camera)
})
```

:::
