<template>
  <div id="app">
    <aside :class="showMenu ? 'is-show' : ''">
      <h2>
        <router-link to="/">WebGL 入门笔记</router-link>
      </h2>
      <nav>
        <ul>
          <li v-for="(route, i) in routes" :key="i">
            <router-link v-if="route.path" :to="route.path">{{ route.title }}</router-link>
            <h3 v-else>{{ route.title }}</h3>
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
      <Top/>
    </article>
  </div>
</template>


<script>
import routes from './views/routes'
import Top from './components/Top.vue'

export default {
  components: {
    Top
  },

  data() {
    return {
      routes: routes,
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

aside {
  font-size: 14px;
  // overflow: hidden;

  h2 {
    text-align: center;
    font-size: 1.2em;
    margin-top: 20px;
  }

  h3 {
    font-size: 1.1em;
    padding-left: 20px;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>




