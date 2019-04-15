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
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera(-5, 5, 3.75, -3.75, 0.1, 100)
camera.position.set(5, 15, 25)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

const light = new THREE.PointLight(0xffcc00, 100)
light.position.set(-4, 3, 3)
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

## 3. 平行光

常常会被太阳光当做平行光，因为相对地球上物体的尺度而言，太阳距离地球的距离足够远。对于任意平行的平面，平行光照射的亮度都是相同的，而与平面所在位置无关。

平行光的构造函数为：`new THREE.DirectionalLight(hex, intensity)`。

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

const light = new THREE.DirectionalLight(0xffcc00, 1)
light.position.set(1, 3, 3)
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

## 4. 聚光灯

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

除了设置 `light.target.position` 外，如果要让聚光灯跟着某物体一起动，可以指定 `targer` 为该物体。

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
document.querySelector('#app').appendChild(renderer.domElement)

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
scene.add(plane)

// 绘制立方体
const cube = new THREE.Mesh(
  new THREE.CubeGeometry(1, 1, 1),
  new THREE.MeshLambertMaterial({ color: 0xff0000 })
)
scene.add(cube)

// 环境光
const ambient = new THREE.AmbientLight(0xffffff)
scene.add(ambient)

// 聚光灯
const light = new THREE.SpotLight(0xff00f0, 1, 800, Math.PI / 6, 25)
light.position.set(2, 2, 3)
light.target = cube
scene.add(light)

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

## 5. 阴影

明暗是相对的，阴影的形成是因为比周围获得的光照更少。因此，要形成阴影，光源必不可少。

在 THREE.js 中，能形成阴影的光源只有 `THREE.DirectionalLight` 和 `THREE.SpotLight`；相应地可以表现阴影效果的材质只有 `THREE.LambertMaterial` 和 `THREE.PhongMaterial`。

要启用阴影效果，需要显示地告诉渲染器：`renderer.shadowMapEnabled = true;`。对于光源及要产生阴影的物体调用 `xxx.castShadow = true` ，对接收阴影的物体调用 `xxx.receiveShadow = true`。

<p></p>

<del>
比如场景中一个平面上有一个正方体，想要让聚光灯照射在正方体上，产生的阴影投射在平面上，那么就需要对聚光灯和正方体调用 `castShadow = true`，对于平面调用`receiveShadow = true` 。
以上就是产生阴影效果的必要步骤了，不过通常还需要设置光源的阴影相关属性，才能正确显示出阴影效果。
对于聚光灯，需要设置 `shadowCameraNear`、`shadowCameraFar`、`shadowCameraFov` 三个值，类比我们在第二章学到的透视投影照相机，只有介于 `shadowCameraNear`与 `shadowCameraFar`之间的物体将产生阴影，`shadowCameraFov` 表示张角。
对于平行光，需要设置 `shadowCameraNear`、`shadowCameraFar`、`shadowCameraLeft`、`shadowCameraRight`、`shadowCameraTop` 以及 `shadowCameraBottom` 六个值，相当于正交投影照相机的六个面。同样，只有在这六个面围成的长方体内的物体才会产生阴影效果。
</del>

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

renderer.shadowMapEnable = true

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
light.position.set(2, 2, 3)
light.target = cube
light.castShadow = true

light.shadow.camera.near = 2
light.shadow.camera.far = 100
light.shadow.camera.fov = 30
light.shadow.camera.visible = true

light.shadow.mapSize.width = 1024
light.shadow.mapSize.height = 1024

scene.add(light)

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
