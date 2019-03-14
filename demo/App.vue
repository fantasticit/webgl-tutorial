<template>
  <div id="app">
    <aside :class="showMenu ? 'is-show' : ''">
      <nav>
        <ul>
          <li v-for="(route, i) in routes" :key="i">
            <router-link :to="route.path">{{ route.title }}</router-link>
          </li>
        </ul>
      </nav>
      <button @click="toggleShowMenu">
        <svg
          viewBox="0 0 1024 1024"
          class
          data-icon="bars"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M912 192H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM104 228a56 56 0 1 0 112 0 56 56 0 1 0-112 0zm0 284a56 56 0 1 0 112 0 56 56 0 1 0-112 0zm0 284a56 56 0 1 0 112 0 56 56 0 1 0-112 0z"
          ></path>
        </svg>
      </button>
    </aside>

    <article class="container">
      <router-view class="markdown-body"></router-view>
    </article>
  </div>
</template>


<script>
import router from './router'

export default {
  data() {
    return {
      routes: router.options.routes,
      showMenu: false
    }
  },

  methods: {
    toggleShowMenu() {
      this.showMenu = !this.showMenu
    }
  }
}
</script>


<style lang="scss">
@import './styles/index.scss';
</style>




