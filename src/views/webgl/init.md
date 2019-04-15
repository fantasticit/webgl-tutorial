# 初始化 WebGL

为了使用 WebGL 进行 3D 渲染，需要一个 canvas 元素，然后使用该元素初始化 WebGL 上下文。

:::demo

```javascript
const app = document.querySelector('#app')
const canvas = document.createElement('canvas')
canvas.width = 400
canvas.height = 300

app.appendChild(canvas)

const gl = canvas.getContext('webgl')

// 设置 清除背景色
gl.clearColor(1, 0, 0, 1) // 4 个参数 分别对应 hsla 颜色
// 使用 设置的清除色清除上下文
gl.clear(gl.COLOR_BUFFER_BIT)
```

:::
