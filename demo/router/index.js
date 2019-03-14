import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      title: '开始之前',
      component: () => import('../views/start.md')
    },

    {
      path: '/camera',
      title: '照相机',
      component: () => import('../views/camera.md')
    },

    {
      path: '/geometry',
      title: '几何形状',
      component: () => import('../views/geometry.md')
    }
  ]
})
