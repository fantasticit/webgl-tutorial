# 开始之前

一个典型的 `three.js` 程序至少有 `渲染器（renderer）` 、 `场景（Scene）`、 `照相机（Camera）` 和在场景中创建的物体等。

## 渲染器

渲染器是和 `canvas` 元素进行绑定的。实例化一个渲染器可以有两种方式：

```javascript
// 使用页面上已有的 canvas 元素
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas')
})
```

或者也可以使用 `three.js` 生成 `canvas` 元素。

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)
```

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
// 设置 canvas 宽高分别为 400 、300
renderer.setSize(400, 300)
// 添加 renderer 对应的 canvas 到页面
document.querySelector('#app').appendChild(renderer.domElement)
```

:::

## 场景

在 `three.js` 中物体都是添加到 `scene` 上的。`scene` 相当于一个大的容器（或者舞台）。

:::demo

```javascript
const scene = new THREE.Scene()
console.log(scene)
```

:::

## 照相机

在 `WebGL` 和 `three.js` 中坐标系都是右手坐标系，看起来就像：

![左右手坐标系](http://p5.qhimg.com/t012cf9ff02e5927c02.jpg)

```javascript
const camera = new THREE.PerspectiveCamera(45, 4 / 3, 1, 1000)
camera.position.set(0, 0, 5)
scene.add(camera)
```

PS: 相机也需要添加到场景中。

## DEMO

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, 4 / 3, 1, 1000)
camera.position.set(0, 0, 5)
scene.add(camera)

const cube = new THREE.Mesh(
  new THREE.CubeGeometry(1, 2, 3),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(cube)

renderer.render(scene, camera)
```

:::
