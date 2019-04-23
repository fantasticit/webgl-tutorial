# 场景交互

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

const { innerWidth: width, innerHeight: height } = window

const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
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
  mouse.x = (evt.clientX / width) * 2 - 1
  mouse.y = -(evt.clientY / height) * 2 + 1

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

:::demo

```javascript
const { innerWidth: width, innerHeight: height } = window

const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
renderer.shadowMapEnabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.querySelector('#app').appendChild(renderer.domElement)

const scene = new THREE.Scene()

var h = window.innerHeight,
  w = window.innerWidth
var aspectRatio = w / h,
  fieldOfView = 25,
  nearPlane = 0.1,
  farPlane = 1000
var camera = new THREE.PerspectiveCamera(
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane
)

camera.position.set(-5, 6, 8)
// camera.position.set(0,0,8); // front
// camera.position.set(-10,.2,0); //left
// camera.position.set(0,10,0); //top
// camera.position.y=4;

camera.lookAt(new THREE.Vector3(0, 0, 0))

//Ambient light
var light = new THREE.AmbientLight(0xffffff, 0.5)

var shadowLight = new THREE.DirectionalLight(0xffffff, 0.5)
shadowLight.position.set(200, 200, 200)
shadowLight.castShadow = true

var backLight = new THREE.DirectionalLight(0xffffff, 0.2)
backLight.position.set(-100, 200, 50)
backLight.castShadow = true
scene.add(backLight)
scene.add(light)
scene.add(shadowLight)

// grassland left
var geometry_left = new THREE.BoxGeometry(2, 0.2, 2)
var material_grass = new THREE.MeshLambertMaterial({ color: 0xabd66a })
var ground_left = new THREE.Mesh(geometry_left, material_grass)
ground_left.position.set(-1, 0.1, 0)
scene.add(ground_left)
customizeShadow(ground_left, 0.25) // mess, opacity

//river
var geometry_river = new THREE.BoxGeometry(1, 0.1, 2)
var material_river = new THREE.MeshLambertMaterial({ color: 0x70b7e3 })
var river = new THREE.Mesh(geometry_river, material_river)
river.position.set(0.5, 0.1, 0)
scene.add(river)
customizeShadow(river, 0.08) // mess, opacity
//river bed
var geometry_bed = new THREE.BoxGeometry(1, 0.05, 2)
var bed = new THREE.Mesh(geometry_bed, material_grass)
bed.position.set(0.5, 0.025, 0)
scene.add(bed)

//grassland right
var geometry_right = new THREE.BoxGeometry(1, 0.2, 2)
var ground_right = new THREE.Mesh(geometry_right, material_grass)
ground_right.position.set(1.5, 0.1, 0)
scene.add(ground_right)
customizeShadow(ground_right, 0.25) // mess, opacity

var tree = function(x, z) {
  this.x = x
  this.z = z

  //trunk
  var material_trunk = new THREE.MeshLambertMaterial({ color: 0x9a6169 })
  var geometry_trunk = new THREE.BoxGeometry(0.15, 0.15, 0.15)
  var trunk = new THREE.Mesh(geometry_trunk, material_trunk)
  trunk.position.set(this.x, 0.275, this.z)
  trunk.castShadow = true
  trunk.receiveShadow = true
  scene.add(trunk)

  //leaves
  var geometry_leaves = new THREE.BoxGeometry(0.25, 0.4, 0.25)
  var material_leaves = new THREE.MeshLambertMaterial({ color: 0x65bb61 })
  var leaves = new THREE.Mesh(geometry_leaves, material_leaves)
  leaves.position.set(this.x, 0.2 + 0.15 + 0.4 / 2, this.z)
  leaves.castShadow = true
  customizeShadow(leaves, 0.25) // mess, opacity
  scene.add(leaves)
}

//left
tree(-1.75, -0.85)
tree(-1.75, -0.15)
tree(-1.5, -0.5)
tree(-1.5, 0.4)
tree(-1.25, -0.85)
tree(-1.25, 0.75)
tree(-0.75, -0.85)
tree(-0.75, -0.25)
tree(-0.25, -0.85)
//right
tree(1.25, -0.85)
tree(1.25, 0.75)

tree(1.5, -0.5)
tree(1.75, -0.85)
tree(1.75, 0.35)

function customizeShadow(t, a) {
  //opacity, target mesh
  var material_shadow = new THREE.ShadowMaterial({ opacity: a })
  var mesh_shadow = new THREE.Mesh(t.geometry, material_shadow)
  mesh_shadow.position.set(t.position.x, t.position.y, t.position.z)
  mesh_shadow.receiveShadow = true
  scene.add(mesh_shadow)
}

var material_wood = new THREE.MeshLambertMaterial({ color: 0xa98f78 })

//bridge - wood block
for (var i = 0; i < 6; i++) {
  var geometry_block = new THREE.BoxGeometry(0.15, 0.02, 0.4)
  var block = new THREE.Mesh(geometry_block, material_wood)
  block.position.set(0 + 0.2 * i, 0.21, 0.2)
  block.castShadow = true
  block.receiveShadow = true
  scene.add(block)
}
//bridge - rail
var geometry_rail_v = new THREE.BoxGeometry(0.04, 0.3, 0.04)
var rail_1 = new THREE.Mesh(geometry_rail_v, material_wood)
rail_1.position.set(-0.1, 0.35, 0.4)
rail_1.castShadow = true
customizeShadow(rail_1, 0.2)
scene.add(rail_1)

var rail_2 = new THREE.Mesh(geometry_rail_v, material_wood)
rail_2.position.set(1.1, 0.35, 0.4)
rail_2.castShadow = true
customizeShadow(rail_2, 0.2)
scene.add(rail_2)

var rail_3 = new THREE.Mesh(geometry_rail_v, material_wood)
rail_3.position.set(-0.1, 0.35, 0)
rail_3.castShadow = true
customizeShadow(rail_3, 0.2)
scene.add(rail_3)

var rail_4 = new THREE.Mesh(geometry_rail_v, material_wood)
rail_4.position.set(1.1, 0.35, 0)
rail_4.castShadow = true
customizeShadow(rail_4, 0.2)
scene.add(rail_4)

var geometry_rail_h = new THREE.BoxGeometry(1.2, 0.04, 0.04)
var rail_h1 = new THREE.Mesh(geometry_rail_h, material_wood)
rail_h1.position.set(0.5, 0.42, 0.4)
rail_h1.castShadow = true
customizeShadow(rail_h1, 0.2)
scene.add(rail_h1)

var rail_h2 = new THREE.Mesh(geometry_rail_h, material_wood)
rail_h2.position.set(0.5, 0.42, 0)
rail_h2.castShadow = true
customizeShadow(rail_h2, 0.2)
scene.add(rail_h2)

var Drop = function() {
  this.geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1)
  this.drop = new THREE.Mesh(this.geometry, material_river)
  this.drop.position.set(
    Math.random(0.1, 0.9),
    0.1,
    1 + (Math.random() - 0.5) * 0.1
  )
  scene.add(this.drop)
  this.speed = 0
  this.lifespan = Math.random() * 50 + 50

  this.update = function() {
    this.speed += 0.0007
    this.lifespan--
    this.drop.position.x += (0.5 - this.drop.position.x) / 70
    this.drop.position.y -= this.speed
  }
}
var drops = []

var count = 0
var render = function() {
  requestAnimationFrame(render)
  if (count % 3 == 0) {
    for (var i = 0; i < 5; i++) {
      drops.push(new Drop())
    }
  }
  count++
  for (var i = 0; i < drops.length; i++) {
    drops[i].update()
    if (drops[i].lifespan < 0) {
      scene.remove(scene.getObjectById(drops[i].drop.id))
      drops.splice(i, 1)
    }
  }
  renderer.render(scene, camera)
}
render()
```

:::
