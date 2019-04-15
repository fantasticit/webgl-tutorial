import Vue from 'vue'
import Router from 'vue-router'

import routes from '../views/routes'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: () => import('../views/home.vue')
    },

    ...routes.filter(route => route.path)
  ]
})
