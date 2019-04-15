export default [
  {
    title: 'WebGL'
  },

  {
    path: '/webgl',
    title: '初始化',
    component: () => import('./webgl/init.md')
  },

  {
    path: '/webgl/2D',
    title: '2D 物体',
    component: () => import('./webgl/2D.md')
  },

  {
    path: '/webgl/color',
    title: '颜色',
    component: () => import('./webgl/color.md')
  },

  {
    path: '/webgl/animate',
    title: '动画',
    component: () => import('./webgl/animate.md')
  },

  {
    path: '/webgl/3D',
    title: '3D 物体',
    component: () => import('./webgl/3D.md')
  },

  {
    path: '/webgl/texture',
    title: '纹理',
    component: () => import('./webgl/texture.md')
  },

  {
    path: '/webgl/light',
    title: '灯光',
    component: () => import('./webgl/light.md')
  },

  {
    title: 'THREE.js'
  },

  {
    path: '/three',
    title: '开始之前',
    component: () => import('./three/start.md')
  },

  {
    path: '/three/camera',
    title: '照相机',
    component: () => import('./three/camera.md')
  },

  {
    path: '/three/geometry',
    title: '几何形状',
    component: () => import('./three/geometry.md')
  },

  {
    path: '/three/material',
    title: '材质',
    component: () => import('./three/material.md')
  },

  {
    path: '/three/mesh',
    title: '网格',
    component: () => import('./three/mesh.md')
  },

  {
    path: '/three/externalModel',
    title: '外部模型',
    component: () => import('./three/externalModel.md')
  },

  {
    path: '/three/LightAndShadow',
    title: '光与影',
    component: () => import('./three/LightAndShadow.md')
  }
]
