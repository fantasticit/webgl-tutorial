# 照相机

## 1. 什么是照相机

使用 `three.js` 创建的场景是三维的，但是一般情况下屏幕是二维的，那么三维场景就要显示到二维的显示屏上。照相机就是这样一个抽象，它定义了 **三维空间** 到 **二维屏幕** 的 **投影** 方式。
针对不同的投影方式，照相机分为 **正交投影照相机** 和 **透视投影照相机**。

## 2. 正交投影 与 透视投影

透视投影照相机的作用类似人眼在真实世界中看到的『近大远小』的效果（如下图 a）;而正交投影照相机的作用类似在数学几何中的效果，对于三维空间中平行的线，投影到二维空间也一定平行（如下图 b），这样就不会因投影而改变物体比例。

![正交投影与透视投影](https://p0.ssl.qhimg.com/t0129a7691a270841fc.png)

## 3. 正交投影照相机

在 `three.js` 中正交投影照相机为 `OrthographicCamera`。

```javascript
new THREE.OrthographicCamera(left, right, top, bottom, near, far)
```

这 6 个参数分别代表正交投影照相机拍摄到的空间的 6 个面的位置，这 6 个面刚好围成一个长方体，称其为 **场景体（frustum）**。只有在场景体内部的物体才可以显示到屏幕上，场景体之外的物体会被裁剪掉。

为了保证照相机的横竖比例，需要满足: `canvas.width / canvas.height = (right - left) / (top - bottom)`。

![正交投影照相机](https://p0.ssl.qhimg.com/t01143e1ece584883fc.png)

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera(-2, 2, 1.5, -1.5, 1, 10)
camera.position.set(0, 0, 3)
scene.add(camera)

const cube = new THREE.Mesh(
  new THREE.CubeGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
)
scene.add(cube)

renderer.render(scene, camera)
```

:::

目前，使用照相机都是延着 `z` 轴负方向观察的。可以改变照相机位置，然后在通过 `lookAt` 函数指定它看着某个方向。

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera(-2, 2, 1.5, -1.5, 1, 8)
camera.position.set(2, -2, 4)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

const cube = new THREE.Mesh(
  new THREE.CubeGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
)
scene.add(cube)

renderer.render(scene, camera)

camera.position.z = 4

const animate = function() {
  requestAnimationFrame(animate)

  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  renderer.render(scene, camera)
}

animate()
```

:::

## 3. 透视投影照相机

在 `three.js` 中透视投影照相机为 `PerspectiveCamera`。

```javascript
new THREE.OrthographicCamera(fov, aspect, near, far)
```

- `fov`: 视景体竖直方向上的张角
- `aspect`: 满足 `aspect=width / height`，照相机水平长度和垂直高度比值，通常为 `canvas` 横纵比例
- `near`: 照相机到视景 最近距离
- `far`: 照相机到视景 最远距离

这 6 个参数分别代表正交投影照相机拍摄到的空间的 6 个面的位置，这 6 个面刚好围成一个长方体，称其为 **场景体（frustum）**。只有在场景体内部的物体才可以显示到屏幕上，场景体之外的物体会被裁剪掉。

为了保证照相机的横竖比例，需要满足: `canvas.width / canvas.height = (right - left) / (top - bottom)`。
![透视投影照相机](https://p3.ssl.qhimg.com/t01ed4da0ebc97fa520.jpg)

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
const camera = new THREE.PerspectiveCamera(30, 400 / 300, 0.1, 400)
camera.position.set(0, 40, 20)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

// 光照
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(16, 12, -8)

// 开启平行光的阴影投射
pointLight.castShadow = true

scene.add(pointLight)

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
