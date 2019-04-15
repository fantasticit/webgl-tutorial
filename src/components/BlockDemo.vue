<template>
  <div :class="['block-demo', isFullscreen ? 'block-demo--fixed' : '']" ref="block">
    <div class="editor" ref="editor">
      <div class="bock-demo__ctrl">
        <button @click="fullscreen">{{ isFullscreen ? '还原' : '全屏' }}</button>
        <!-- <button>复制</button> -->
        <button @click="syncCode">运行</button>
      </div>
      <div class="bock-demo__code">
        <textarea ref="textarea"></textarea>
      </div>
    </div>
    <div class="preview" ref="preview">
      <div class="demo" ref="demo"></div>
    </div>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import Split from 'split.js'
import { unescape } from 'scapegoat'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/lib/codemirror.css'
import { throttle } from '../utils'

export default {
  props: {
    tip: String,
    source: String
  },

  data() {
    return {
      editor: null,
      visible: true,

      isJSON: false,
      isFullscreen: false
    }
  },

  mounted() {
    let tip = this.tip.split(',')

    try {
      tip = JSON.parse(JSON.stringify(tip))
    } catch (e) {}

    this.isFullscreen = tip.indexOf('fullscreen') > -1

    this.initEditor()

    try {
      this.$nextTick(() => {
        this.syncCode()
      })
    } catch (e) {
      throw e
    }

    this.initSplit()
  },

  methods: {
    toggle() {
      this.visible = !this.visible
    },

    unescape(html) {
      return unescape(html)
    },

    initSplit() {
      Split([this.$refs['editor'], this.$refs['preview']], {
        sizes: [50, 50]
      })
    },

    initEditor() {
      this.editor = CodeMirror.fromTextArea(this.$refs['textarea'], {
        mode: 'application/javascript',
        extraKeys: {
          'Ctrl-Space': 'autocomplete'
        },
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        lineNumbers: true,
        lineWrapping: false
      })

      this.editor.getDoc().setValue(this.unescape(this.source))
    },

    syncCode() {
      const oDemo = this.$refs['demo']

      try {
        oDemo.innerHTML = `<iframe frameborder="0"></iframe>`

        const iframe = oDemo.querySelector('iframe')
        iframe.contentWindow.document.write(
          `<div id="app" style="width: 100%; height: 100%; overflow: hidden">
        <\/div>
        <!-- gl-matrix.js -->
        <script src="https://s3.ssl.qhres.com/static/f86dcad79f02c645.js"><\/script>
        <!-- three.js -->
        <script src="https://cdn.bootcss.com/three.js/r83/three.min.js"><\/script>
        <!-- objLoader.js -->
        <script src="https://s5.ssl.qhres.com/static/88b520aaa76d723b.js"><\/script>
        <!-- MTLLoader.js -->
        <script src="https://s0.ssl.qhres.com/static/c5f4a58a44d0982f.js"><\/script>
        <!-- OBJMTLLoader.js -->
        
        <script>${this.editor.getValue()}<\/script>`
        )
      } catch (e) {
        throw e
      }
    },

    fullscreen() {
      this.isFullscreen = !this.isFullscreen
    }
  }
}
</script>

<style lang="scss" scoped>
.block-demo {
  position: relative;
  margin-top: 1.2em;
  box-sizing: border-box;

  height: 400px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  border: 1px solid #efefef;
  background: #fff;
}

.block-demo--fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  margin-top: 0 !important;
}

.block-demo + .block-demo {
  margin-top: 30px;
}

.block-demo > .editor,
.block-demo > .preview {
  box-sizing: border-box;
  width: 50%;
  height: 100%;
}

.block-demo > .preview {
  box-sizing: border-box;
  max-height: 100%;
  padding: 1rem;
  overflow: hidden;
}

.editor {
  background: #f8fafe;
}

.bock-demo__ctrl {
  height: 45px;
  padding: 0 15px;
  border-bottom: 1px solid #ddd;
  text-align: right;

  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.bock-demo__ctrl button + button {
  margin-left: 10px;
}

.bock-demo__code {
  height: calc(100% - 46px);
}

.block-demo .demo {
  height: 100%;
}
</style>
