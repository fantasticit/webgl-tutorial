# 外部模型

THREE.js 创建常见的几何图形是十分方便的。但是业务需求上需要开发的效果使用的模型往往都是十分复杂的，这时候再使用常见几何体进行组合就麻烦了。所以，THREE.js 是支持用户导入由 其他工具（如 3DS MAX）制作的三维模型的。

## 1. 支持格式

THREE.js 有一系列 `loader` 来加载不同格式的模型文件。如：

- `*.obj`: 使用 `OBJLoader` 导入 `.obj` 模型文件
- `*.mtl`: 使用 `MTLLoader` 和 `OBJMTLLoader` 导入 `.obj` 模型文件

此外，还有 `PLYLoader` 、`STLLoader` 等对应不同格式的加载器。

THREE.js 支持的模型格式有

- `.obj`
- `.mtl`
- `.dae`
- `.ctm`
- `.ply`
- `.stl`
- `.wrl`
- `.vtk`

## 2. 无材质模型

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera(-10, 10, 8, -8, 0.1, 10)
camera.position.set(0, 0, 5)
scene.add(camera)

const light = new THREE.DirectionalLight(0xfff000)
light.position.set(5, 2, 5)
scene.add(light)

const objLoader = new THREE.OBJLoader()

objLoader.load(
  `http://dpxr-graph-bed.oss-cn-beijing.aliyuncs.com/port.obj`,
  obj => {
    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material.side = THREE.DoubleSide
      }
    })

    obj.position.y = -2

    const animate = () => {
      obj.rotation.y += 0.01

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    scene.add(obj)

    animate()
  }
)
```

:::

## 3. 有材质模型

模型的材质有 2 种定义方式，一种是在代码导入模型后设置材质，另一种是在建模软件中导出材质信息。

### 3.1 在代码中设置材质

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera(-10, 10, 8, -8, 0.1, 10)
camera.position.set(0, 0, 5)
scene.add(camera)

const light = new THREE.DirectionalLight(0xfff000)
light.position.set(5, 2, 5)
scene.add(light)

const objLoader = new THREE.OBJLoader()

objLoader.load(
  `http://dpxr-graph-bed.oss-cn-beijing.aliyuncs.com/port.obj`,
  obj => {
    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshLambertMaterial({
          color: 0xff000,
          side: THREE.DoubleSide
        })
      }
    })

    obj.position.y = -2

    const animate = () => {
      obj.rotation.y += 0.01

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    scene.add(obj)

    animate()
  }
)
```

:::

### 3.2 在建模软件中设置材质

在建模软件中导出 `.obj` 模型文件 和 `.mtl` 材质文件后使用 `OBJLoader` 和 `MTLLoader` 加载相应文件即可。

:::demo

```javascript
const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera(-10, 10, 8, -8, 0.1, 10)
camera.position.set(0, 0, 5)
scene.add(camera)

const light = new THREE.DirectionalLight(0xfff000)
light.position.set(5, 2, 5)
scene.add(light)

const mtlLoader = new THREE.MTLLoader()
mtlLoader.load(
  `http://dpxr-graph-bed.oss-cn-beijing.aliyuncs.com/port.mtl`,
  materials => {
    materials.preload()

    const objLoader = new THREE.OBJLoader()
    objLoader.setMaterials(materials)

    objLoader.load(
      `http://dpxr-graph-bed.oss-cn-beijing.aliyuncs.com/port.obj`,
      obj => {
        if (obj.children.length) {
          obj = obj.children[0]

          const animate = () => {
            obj.rotation.y += 0.01

            renderer.render(scene, camera)
            requestAnimationFrame(animate)
          }
          obj.position.y = -2
          scene.add(obj)

          animate()
        }
      }
    )
  }
)
```

:::
