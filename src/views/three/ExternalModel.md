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
  `https://dpxr-graph-bed.oss-cn-beijing.aliyuncs.com/port.obj`,
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
  `https://dpxr-graph-bed.oss-cn-beijing.aliyuncs.com/port.obj`,
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
  `https://dpxr-graph-bed.oss-cn-beijing.aliyuncs.com/port.mtl`,
  materials => {
    materials.preload()

    const objLoader = new THREE.OBJLoader()
    objLoader.setMaterials(materials)

    objLoader.load(
      `https://dpxr-graph-bed.oss-cn-beijing.aliyuncs.com/port.obj`,
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

:::demo

```javascript
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

renderer.shadowMap.enable = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// 初始化场景
const scene = new THREE.Scene()

// 初始化相机
const camera = new THREE.PerspectiveCamera(45, 400 / 300, 0.1, 200)
camera.position.set(0, 20, 20)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

// 添加光照
const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff)
directionalLight.position.set(10, 20, 30)

directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 100
directionalLight.shadow.camera.left = -20
directionalLight.shadow.camera.right = 20
directionalLight.shadow.camera.top = 15
directionalLight.shadow.camera.bottom = -15
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

directionalLight.castShadow = true
scene.add(directionalLight)

// 添加物体
{
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshLambertMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide })
  )
  plane.rotation.x = -0.6 * Math.PI
  plane.receiveShadow = true
  scene.add(plane)

  const loader = new THREE.GLTFLoader()

  loader.load(
    'https://dpxr-graph-bed.oss-cn-beijing.aliyuncs.com/undefined.gltf',
    gltf => {
      gltf.scene.scale.set(0.05, 0.05, 0.05)
      scene.add(gltf.scene)

      renderer.render(scene, camera)
    }
  )
}
```

:::
