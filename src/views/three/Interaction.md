# 动画

点击 方块。

:::demo

```javascript
function randomColor() {
  var arrHex = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f'
    ],
    strHex = '#',
    index

  for (var i = 0; i < 6; i++) {
    index = Math.round(Math.random() * 15)
    strHex += arrHex[index]
  }

  return strHex
}

const renderer = new THREE.WebGLRenderer()
renderer.setSize(400, 300)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, 400 / 300, 0.1, 100)
camera.position.set(0, 20, 20)
camera.lookAt(new THREE.Vector3(0, 0, 0))

const ambientLight = new THREE.AmbientLight('#111111')
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffff')
directionalLight.position.set(10, 20, 10)

directionalLight.shadow.camera.near = 1 //产生阴影的最近距离
directionalLight.shadow.camera.far = 100 //产生阴影的最远距离
directionalLight.shadow.camera.left = -20 //产生阴影距离位置的最左边位置
directionalLight.shadow.camera.right = 20 //最右边
directionalLight.shadow.camera.top = 10 //最上边
directionalLight.shadow.camera.bottom = -10 //最下面

//这两个值决定生成阴影密度 默认512
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.mapSize.width = 1024

//告诉平行光需要开启阴影投射
directionalLight.castShadow = true

scene.add(directionalLight)

const group = new THREE.Group()
const geometry = new THREE.BoxGeometry(2, 2, 2)
Array.from({ length: 30 }).forEach(() => {
  const material = new THREE.MeshLambertMaterial({ color: randomColor() })
  const box = new THREE.Mesh(geometry, material)

  box.position.set(
    THREE.Math.randFloatSpread(20),
    THREE.Math.randFloatSpread(20),
    THREE.Math.randFloatSpread(20)
  )
  group.add(box)
})
scene.add(group)

renderer.render(scene, camera)

// 添加场景交互能力
function onClick(evt) {
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  // 通过鼠标点击位置计算出射线所需要的点的位置，以 canvas 中心为原点，范围 [-1, 1]
  mouse.x = (evt.clientX / 400) * 2 - 1
  mouse.y = -(evt.clientY / 300) * 2 + 1

  // 根据在屏幕的二维位置和相机的矩阵更新射线位置
  raycaster.setFromCamera(mouse, camera)

  // 获取射线与所有模型交互的数组几何
  const intersects = raycaster.intersectObjects(scene.children, true)

  intersects.forEach(child => {
    child.object.material.color.set(0xff0000)
  })

  renderer.render(scene, camera)
}

renderer.domElement.addEventListener('click', onClick)
```

:::
