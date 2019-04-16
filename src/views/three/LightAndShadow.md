# 光与影

使用 光与影 可以使场景的渲染效果更加丰富逼真。

## 1. 环境光

环境光是指场景整体的光照效果，通常用来为整个场景指定一个 **基础亮度**。环境光没有明确的光源位置，在各处形成的亮度是一致的。

设置环境光，只需要指定光的颜色。

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera(-5, 5, 3.75, -3.75, 0.1, 100)
camera.position.set(5, 15, 25)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

const light = new THREE.AmbientLight(0xffcc00)
scene.add(light)

const cube1 = new THREE.Mesh(
  new THREE.CubeGeometry(2, 2, 2),
  new THREE.MeshLambertMaterial({ color: 0x00ff00 })
)
cube1.position.x = -3
scene.add(cube1)

const cube2 = new THREE.Mesh(
  new THREE.CubeGeometry(2, 2, 2),
  new THREE.MeshLambertMaterial({ color: 0xfff000 })
)
cube2.position.x = 3
scene.add(cube2)

renderer.render(scene, camera)
```

:::

## 2. 点光源

点光源是不计光源大小。点光源照到不同物体表面的亮度是线性递减的，因此距离光源越远的物体显得越暗。

点光源构造函数为：`new THREE.PointLight(hex, intensity, distance)`。

- `hex`: 光源颜色
- `intensity`: 亮度，默认 1
- `distance`: 光源照射距离，默认 0

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)

//告诉渲染器需要阴影效果
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

// 照相机
const camera = new THREE.PerspectiveCamera(45, 400 / 300, 0.1, 400)
camera.position.set(0, 40, 20)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

// 光照
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(16, 12, -8)

// 开启平行光的阴影投射
pointLight.castShadow = true

scene.add(pointLight)

//添加灯光辅助
const debug = new THREE.PointLightHelper(pointLight)
debug.name = 'debug'
scene.add(debug)

const ambientLight = new THREE.AmbientLight(0x111111)

scene.add(ambientLight)

{
  // 底部平面
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
  )
  plane.position.y = -2
  plane.rotation.x = -0.6 * Math.PI
  plane.receiveShadow = true
  scene.add(plane)

  // 球体
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(2, 80, 80),
    new THREE.MeshPhongMaterial({ color: 0xfe02ef })
  )
  sphere.position.x = -3
  sphere.castShadow = true
  scene.add(sphere)

  const cube = new THREE.Mesh(
    new THREE.CubeGeometry(2, 2, 2),
    new THREE.MeshLambertMaterial({ color: 0x00ffff })
  )
  cube.position.x = 4
  cube.position.y = 0
  cube.castShadow = true
  scene.add(cube)
}

renderer.render(scene, camera)
```

:::

## 3. 平行光

常常会把太阳光当做平行光，因为相对地球上物体的尺度而言，太阳距离地球的距离足够远。对于任意平行的平面，平行光照射的亮度都是相同的，而与平面所在位置无关。

平行光的构造函数为：`new THREE.DirectionalLight(hex, intensity)`。

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)

//告诉渲染器需要阴影效果
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

// 照相机
const camera = new THREE.PerspectiveCamera(45, 400 / 300, 0.1, 400)
camera.position.set(0, 40, 30)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

// 光照
const directionalLight = new THREE.DirectionalLight(0xffffff)
directionalLight.position.set(16, 12, -8)

// 开启平行光的阴影投射
directionalLight.castShadow = true

// 光照阴影
directionalLight.shadow.camera.near = 10
directionalLight.shadow.camera.far = 30
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.bottom = -8

// 阴影密度
directionalLight.shadow.mapSize.width = 200
directionalLight.shadow.mapSize.height = 200

scene.add(directionalLight)

//添加灯光辅助
const debug = new THREE.CameraHelper(directionalLight.shadow.camera)
debug.name = 'debug'
scene.add(debug)

const ambientLight = new THREE.AmbientLight(0x111111)

scene.add(ambientLight)

{
  // 底部平面
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
  )
  plane.position.y = -2
  plane.rotation.x = -0.6 * Math.PI
  plane.receiveShadow = true
  scene.add(plane)

  // 球体
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(2, 80, 80),
    new THREE.MeshPhongMaterial({ color: 0xfe02ef })
  )
  sphere.position.y = 2
  sphere.castShadow = true
  directionalLight.target = sphere
  scene.add(sphere)

  const cube = new THREE.Mesh(
    new THREE.CubeGeometry(2, 2, 2),
    new THREE.MeshLambertMaterial({ color: 0x00ffff })
  )
  cube.position.x = 4
  cube.position.y = 0
  cube.castShadow = true
  scene.add(cube)
}

function animate() {
  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}

animate()
```

:::

## 4. 户外光

使用 `THREE.HemisphereLight` 可以创建更加贴近自然的户外光照效果。户外光不会产生阴影。

如果不使用 `THREE.HemisphereLight` ，要模拟户外光照，一般是创建一个 `THREE.DirectionalLight` 来模拟太阳光，然后添加 `THREE.AmbientLight` 来为场景提供基础光照。但是这样的光照是不够自然的，因为在户外，并不是所有的光源都来自上方（很多事来自大气的散射以及其他物体的反射）。`THREE.HemisphereLight` 为获得更加自然的户外光照提供了一个简单的方式。

属性介绍：

- `color`: 从天空发出的光线的颜色
- `groundColor`：从地面发出的光线的颜色
- `intensity`: 光照强度
- `position`: 光源在场景中的位置，默认 `(0, 100, 0)`
- `visible`: 默认 `true`，控制光源是否可见

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

// 开启渲染器阴影效果
renderer.shadowMap.enable = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// 初始化场景
const scene = new THREE.Scene()

// 照相机
const camera = new THREE.PerspectiveCamera(45, 400 / 300, 0.1, 200)
camera.position.set(0, 40, 20)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

// 光照
const ambientLight = new THREE.AmbientLight(0x111111)
scene.add(ambientLight)

const hemisphereLight = new THREE.HemisphereLight(0xffff, 0xff0000, 1)
scene.add(hemisphereLight)

// 添加物体
{
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
  )
  plane.receiveShadow = true
  plane.rotation.x = -0.7 * Math.PI
  scene.add(plane)

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(2, 20, 20),
    new THREE.MeshPhongMaterial({ color: 0xffffff })
  )
  sphere.castShadow = true
  sphere.position.set(-2, 16, 0)
  scene.add(sphere)

  const cube = new THREE.Mesh(
    new THREE.CubeGeometry(2, 2, 2),
    new THREE.MeshLambertMaterial({ color: 0x00ec4f })
  )
  cube.position.set(2, 0, -5)
  cube.castShadow = true
  scene.add(cube)
}

renderer.render(scene, camera)
```

:::

## 5. 聚光灯

官网上对聚光灯的定义为：`A point light that can cast shadow in one direction.`。

聚光灯是一种特殊的点光源，能够朝着一个方向投射光线。聚光灯投射处的是类似圆锥形的光线。

聚光灯构造函数为：`new THREE.SpotLight(hex, intensity, distance, angle, exponent)`。

相比 点光源 多出了：

- `angle`: 聚光灯的张角，默认 Math.PI / 3，最大是 Math.PI / 2
- `exponent`: 光强在距离 target 的衰减指数，默认值 10

在调用构造函数后，除了设置自身位置,还要设置 target 位置：

```javascript
light.position.set(x1, y1, z1)
light.targte.position.set(x2, y2, z2)
```

除了设置 `light.target.position` 外，如果要让聚光灯跟着某物体一起动，可以指定 `target` 为该物体。

```javascript
light.target = cube
```

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera(-5, 5, 3.75, -3.75, 0.1, 100)
camera.position.set(2, 3, 10)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

const light = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 2, 10)
light.position.set(2, 2, 3)

scene.add(light)

const cube = new THREE.Mesh(
  new THREE.CubeGeometry(2, 2, 2),
  new THREE.MeshLambertMaterial({ color: 0xff0000 })
)

scene.add(cube)

renderer.render(scene, camera)
```

:::

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)

//告诉渲染器需要阴影效果
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

// 照相机
const camera = new THREE.PerspectiveCamera(45, 400 / 300, 0.1, 400)
camera.position.set(0, 40, 30)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

// 光照
const spotLight = new THREE.SpotLight(0xffffff, 2)
spotLight.position.set(16, 12, -10)
spotLight.angle = Math.PI / 6
spotLight.distance = 100

// 开启平行光的阴影投射
spotLight.castShadow = true

scene.add(spotLight)

//添加灯光辅助
const debug = new THREE.CameraHelper(spotLight.shadow.camera)
debug.name = 'debug'
scene.add(debug)
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

const ambientLight = new THREE.AmbientLight(0x111111)

scene.add(ambientLight)

{
  // 底部平面
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
  )
  plane.position.y = -2
  plane.rotation.x = -0.6 * Math.PI
  plane.receiveShadow = true
  scene.add(plane)

  // 球体
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(2, 80, 80),
    new THREE.MeshPhongMaterial({ color: 0xfe02ef })
  )
  sphere.position.y = 2
  sphere.castShadow = true
  spotLight.target = sphere
  scene.add(sphere)

  const cube = new THREE.Mesh(
    new THREE.CubeGeometry(2, 2, 2),
    new THREE.MeshLambertMaterial({ color: 0x00ffff })
  )
  cube.position.x = 4
  cube.position.y = 0
  cube.castShadow = true
  scene.add(cube)
}

renderer.render(scene, camera)
```

:::

## 5. 阴影

明暗是相对的，阴影的形成是因为比周围获得的光照更少。因此，要形成阴影，光源必不可少。

在 THREE.js 中，能形成阴影的光源只有 `THREE.DirectionalLight` 和 `THREE.SpotLight`；相应地可以表现阴影效果的材质只有 `THREE.LambertMaterial` 和 `THREE.PhongMaterial`。

要启用阴影效果，需要显示地告诉渲染器：`renderer.shadowMapEnabled = true;`。对于光源及要产生阴影的物体调用 `xxx.castShadow = true` ，对接收阴影的物体调用 `xxx.receiveShadow = true`。

<p></p>

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera(-5, 5, 3.75, -3.75, 0.1, 100)
camera.position.set(10, 15, 25)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

// 绘底部平面
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8, 12, 12),
  new THREE.MeshLambertMaterial({ color: 0xcccccc })
)
plane.rotation.x = -Math.PI / 2
plane.position.y = -1
plane.receiveShadow = true
scene.add(plane)

// 绘制立方体
const cube = new THREE.Mesh(
  new THREE.CubeGeometry(1, 1, 1),
  new THREE.MeshLambertMaterial({ color: 0xff0000 })
)
cube.castShadow = true
scene.add(cube)

// 环境光
const ambient = new THREE.AmbientLight(0x666666)
scene.add(ambient)

// 聚光灯
const light = new THREE.SpotLight(0x00f0f0, 1, 800, Math.PI / 6, 25)
light.position.set(2, 6, 3)
light.target = cube
light.castShadow = true

light.shadow.camera.near = 2
light.shadow.camera.far = 100
light.shadow.camera.fov = 30
light.shadow.camera.visible = true

light.shadow.mapSize.width = 1024
light.shadow.mapSize.height = 1024

scene.add(light)

// 灯光辅助
const debug = new THREE.CameraHelper(light.shadow.camera)
scene.add(debug)

let alpha = 0

const animate = () => {
  alpha += 0.01
  if (alpha > Math.PI * 2) {
    alpha -= Math.PI * 2
  }

  cube.position.set(2 * Math.cos(alpha), 0, 2 * Math.sin(alpha))

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()
```

:::
