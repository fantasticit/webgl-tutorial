# 网格

网格（`Mesh`）是由顶点、边、面等组成的物体。创建物体时需要指定几何形状和材质，其中几何形状决定了物体的顶点位置等信息，材质决定了物体的颜色、纹理等信息。

## 1. 创建网格

`Mesh` 的构造函数为：`new THREE.Mesh(geometry, material)`。

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera(-10, 10, 8, -8, 1, 10)
camera.position.set(0, 0, 5)
scene.add(camera)

const light = new THREE.PointLight(0xfff000, 1, 10)
light.position.set(0, 2, 6)
scene.add(light)

const cube = new THREE.Mesh(
  new THREE.CubeGeometry(4, 4, 5),
  new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: false })
)

scene.add(cube)

renderer.render(scene, camera)
```

:::

## 2. 修改属性

网格被创建后，可以对材质进行修改，也可以进行矩阵变换。

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera(-10, 10, 8, -8, 1, 10)
camera.position.set(0, 0, 5)
scene.add(camera)

const light = new THREE.PointLight(0xfff000, 1, 10)
light.position.set(0, 2, 6)
scene.add(light)

const cube = new THREE.Mesh(
  new THREE.CubeGeometry(4, 4, 5),
  new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: false })
)

scene.add(cube)

setTimeout(() => {
  cube.material = new THREE.MeshLambertMaterial({
    color: 0xffff00,
    wireframe: false
  })
  renderer.render(scene, camera)
}, 3000)

renderer.render(scene, camera)
```

:::

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera(-10, 10, 8, -8, 1, 10)
camera.position.set(0, 0, 5)
scene.add(camera)

const light = new THREE.PointLight(0xfff000, 1, 10)
light.position.set(0, 2, 4)
scene.add(light)

const cube = new THREE.Mesh(
  new THREE.CubeGeometry(4, 4, 5),
  new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: false })
)

scene.add(cube)

const animate = () => {
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()
```

:::
