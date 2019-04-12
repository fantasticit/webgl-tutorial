export default [
  {
    title: 'WebGL'
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
