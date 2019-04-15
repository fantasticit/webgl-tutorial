<template>
  <div>
    <h2>WebGL 入门笔记</h2>
    <nav>
      <ul>
        <li v-for="(route, i) in routes" :key="i">
          <router-link v-if="route.path" :to="route.path">{{ route.title }}</router-link>
          <h3 v-else>{{ route.title }}</h3>
        </li>
      </ul>
    </nav>
  </div>
</template>


<script>
import routes from './routes'

export default {
  data() {
    return {
      routes
    }
  }
}
</script>
