---
title: CSS
description: "CSS的知识其实写多就会了，下面都是一些比较容易忘记的知识"
---

## 概念

+++primary 选择器权重
!important[Infinity]>内联[1000]>id[100]>类、伪类、属性[10]>元素、伪元素[1]>通配符、组合(后代、子代、兄弟)、伪类:not[0]
+++

+++primary 继承和非继承属性有哪些
非继承：

1. display
2. 文本属性：vertical-align、text-decoration、text-shadow、white-space、unicode-bidi
3. 盒子模型：width、height、、max/min-height、max/min-width、margin、padding、border
4. 背景属性：background及其属性
5. 定位属性：float、clear、position、top/left/right/bottom、overflow、clip、z-index
6. 生成内容属性：content、counter-reset、counter-increment
7. 轮廓样式属性：outline-style、outline-width、outline-color、outline
8. 页面样式属性：size、page-break-before、page-break-after
9. 声音样式属性：pause-before、pause-after、pause、cue-before、cue-after、cue、play-during

继承：

1. 字体系列属性：font-family、font-weight、font-size、font-style

文本系列属性：text-indent、text-align、line-height、word-spacing、letter-spacing、text-transform、color

元素可见性：visibility

列表布局属性：list-style、包括list-style-type、list-style-image等

光标属性：cursor
+++

+++primary BFC(还有IFC、FFC、GFC，自行百度)
BFC，块级格式化上下文，页面盒模型中一块独立的渲染区域，是独立布局的，盒子里面的子元素的样式不会影响到外面的元素。但在同一个BFC中的两个邻的块级盒在垂直方向（和布局方向有关系）的margin会发生折叠。
`创建方式`

1. html根元素
2. float不为none
3. position为absolute、fixed或sticky
4. overflow不为visible或clip
5. display：table（table-cell、table-caption）或inline-block或flow-root或list-item，flex（flex、inline-flex）或grid（grid、inline-gird）的子元素
6. contain值为layout或content或paint或strict
7. column-span为all

:::info no-icon
display: flow-root，contain: layout 等是无副作用的，可在不影响已有布局的情况下触发 BFC。
:::

`解决：`

1. margin塌陷
2. 清除浮动
+++

+++primary display：none、visible：hidden、opacity：0区别

1. 完全隐藏dom元素，不占空间，无法触发事件，回流
2. 隐藏dom元素但保留空间，无法触发事件，重绘
3. 隐藏dom元素且保留空间，可以触发事件，重绘
+++

+++primary link和@import区别

1. link属于HTML标签，而@import是CSS语句，所以link还可以引入网站图标等操作
2. link会在页面加载时同时加载，@import则会等到其引入的css文件加载完成之后在加载当前css文件
3. link权重高于@import
+++

+++primary 百分比机制
| 子元素                                      | 父元素                          |
| ------------------------------------------- | ------------------------------- |
| width                                       | 父级的width                     |
| height                                      | 父级的height                    |
| margin(top,right,bottom,left)               | 父级的width                     |
| padding(top,right,bottom,left)              | 父级的width                     |
| border(top,right,bottom,left)               | 父级的width                     |
| position为absolute时的left,top,right,bottom | 元素的width,height,width,height |
| position为relative时的left,top,right,bottom | 自身的width,height,width,height |
| font-size                                   | 父元素的font-size               |
| line-height                                 | 自身的font-size                 |
| transform(left,top)                         | 自身的width,height              |

+++

+++primary JS动画和CSS动画区别
JS在主线程执行动画，而CSS在compositor线程执行
+++

+++primary requestAnimationFrame的优点

1. CPU节能：使用SetTinterval 实现的动画，当页面被隐藏或最小化时，SetTinterval 仍然在后台执行动画任务，由于此时页面处于不可见或不可用状态，刷新动画是没有意义的，完全是浪费CPU资源。而RequestAnimationFrame则完全不同，当页面处理未激活的状态下，该页面的屏幕刷新任务也会被系统暂停，因此跟着系统走的RequestAnimationFrame也会停止渲染，当页面被激活时，动画就从上次停留的地方继续执行，有效节省了CPU开销。
2. 函数节流：在高频率事件( resize, scroll 等)中，为了防止在一个刷新间隔内发生多次函数执行，RequestAnimationFrame可保证每个刷新间隔内，函数只被执行一次，这样既能保证流畅性，也能更好的节省函数执行的开销，一个刷新间隔内函数执行多次时没有意义的，因为多数显示器每16.7ms刷新一次，多次绘制并不会在屏幕上体现出来。
3. 减少DOM操作：requestAnimationFrame 会把每一帧中的所有DOM操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，一般来说，这个频率为每秒60帧。

+++

+++primary 为什么有时候⽤translate来改变位置⽽不是定位？
改变transform或opacity不会触发浏览器重新布局（reflow）或重绘（repaint），只会触发复合（compositions）。⽽改变绝对定位会触发重新布局，进⽽触发重绘和复合。transform使浏览器为元素创建⼀个 GPU 图层，但改变绝对定位会使⽤到 CPU。 因此translate()更⾼效，可以缩短平滑动画的绘制时间。 ⽽translate改变位置时，元素依然会占据其原始空间，绝对定位就不会发⽣这种情况。
+++

+++primary 常见的图片格式及使用场景

1. BMP，是无损的、既支持索引色也支持直接色的点阵图。这种图片格式几乎没有对数据进行压缩，所以BMP格式的图片通常是较大的文件。
2. GIF是无损的、采用索引色的点阵图。采用LZW压缩算法进行编码。文件小，是GIF格式的优点，同时，GIF格式还具有支持动画以及透明的优点。但是GIF格式仅支持8bit的索引色，所以GIF格式适用于对色彩要求不高同时需要文件体积较小的场景。
3. JPEG是有损的、采用直接色的点阵图。JPEG的图片的优点是采用了直接色，得益于更丰富的色彩，JPEG非常适合用来存储照片，与GIF相比，JPEG不适合用来存储企业Logo、线框类的图。因为有损压缩会导致图片模糊，而直接色的选用，又会导致图片文件较GIF更大。
4. PNG-8是无损的、使用索引色的点阵图。PNG是一种比较新的图片格式，PNG-8是非常好的GIF格式替代者，在可能的情况下，应该尽可能的使用PNG-8而不是GIF，因为在相同的图片效果下，PNG-8具有更小的文件体积。除此之外，PNG-8还支持透明度的调节，而GIF并不支持。除非需要动画的支持，否则没有理由使用GIF而不是PNG-8。
5. PNG-24是无损的、使用直接色的点阵图。PNG-24的优点在于它压缩了图片的数据，使得同样效果的图片，PNG-24格式的文件大小要比BMP小得多。当然，PNG24的图片还是要比JPEG、GIF、PNG-8大得多。
6. SVG是无损的矢量图。SVG是矢量图意味着SVG图片由直线和曲线以及绘制它们的方法组成。当放大SVG图片时，看到的还是线和曲线，而不会出现像素点。SVG图片在放大时，不会失真，所以它适合用来绘制Logo、Icon等。
7. WebP是谷歌开发的一种新图片格式，WebP是同时支持有损和无损压缩的、使用直接色的点阵图。从名字就可以看出来它是为Web而生的，什么叫为Web而生呢？就是说相同质量的图片，WebP具有更小的文件体积。现在网站上充满了大量的图片，如果能够降低每一个图片的文件大小，那么将大大减少浏览器和服务器之间的数据传输量，进而降低访问延迟，提升访问体验。目前只有Chrome浏览器和Opera浏览器支持WebP格式，兼容性不太好。

在无损压缩的情况下，相同质量的WebP图片，文件大小要比PNG小26%；
在有损压缩的情况下，具有相同图片精度的WebP图片，文件大小要比JPEG小25%~34%；
WebP图片格式支持图片透明度，一个无损压缩的WebP图片，如果要支持透明度只需要22%的格外文件大小。

+++

+++primary CSS性能优化

1. 少写表达式
2. 少写高级选择器、通配选择器
3. 硬件加速
4. requestAnimationFrame动画

加载性能：

1. css压缩：将写好的css进行打包压缩，可以减小文件体积。
2. css单一样式：当需要下边距和左边距的时候，很多时候会选择使用 margin:top 0 bottom 0；但margin-bottom:bottom;margin-left:left;执行效率会更高。
3. 减少使用@import，建议使用link，因为后者在页面加载时一起加载，前者是等待页面加载完成之后再进行加载。
4.

选择器性能：

1. 关键选择器（key selector）。选择器的最后面的部分为关键选择器（即用来匹配目标元素的部分）。CSS选择符是从右到左进行匹配的。当使用后代选择器的时候，浏览器会遍历所有子元素来确定是否是指定的元素等等；
2. 如果规则拥有ID选择器作为其关键选择器，则不要为规则增加标签。过滤掉无关的规则（这样样式系统就不会浪费时间去匹配它们了）。
3. 避免使用通配规则，如*{}计算次数惊人，只对需要用到的元素进行选择。
4. 尽量少的去对标签进行选择，而是用class。
5. 尽量少的去使用后代选择器，降低选择器的权重值。后代选择器的开销是最高的，尽量将选择器的深度降到最低，最高不要超过三层，更多的使用类来关联每一个标签元素。
6. 了解哪些属性是可以通过继承而来的，然后避免对这些属性重复指定规则。

渲染性能：

1. 慎重使用高性能属性：浮动、定位。
2. 尽量减少页面重排、重绘。
3. 去除空规则：｛｝。空规则的产生原因一般来说是为了预留样式。去除这些空规则无疑能减少css文档体积。
4. 属性值为0时，不加单位。
5. 属性值为浮动小数0.**，可以省略小数点之前的0。
6. 标准化各种浏览器前缀：带浏览器前缀的在前。标准属性在后。
7. 不使用@import前缀，它会影响css的加载速度。
8. 选择器优化嵌套，尽量避免层级过深。
9. css雪碧图，同一页面相近部分的小图标，方便使用，减少页面的请求次数，但是同时图片本身会变大，使用时，优劣考虑清楚，再使用。
10. 正确使用display的属性，由于display的作用，某些样式组合会无效，徒增样式体积的同时也影响解析性能。
11. 不滥用web字体。对于中文网站来说WebFonts可能很陌生，国外却很流行。web fonts通常体积庞大，而且一些浏览器在下载web fonts时会阻塞页面渲染损伤性能。

可维护性、健壮性：

1. 将具有相同属性的样式抽离出来，整合并通过class在页面中进行使用，提高css的可维护性。
2. 样式与内容分离：将css代码定义到外部css中。
+++

+++primary z-index什么情况下会失效

- 父元素position为relative时，子元素的z-index失效。解决：父元素position改为absolute或static；
- 元素没有设置position属性为非static属性。解决：设置该元素的position属性为relative，absolute或是fixed中的一种；
- 元素在设置z-index的同时还设置了float浮动。解决：float去除，改为display：inline-block；
+++

+++primary 元素层叠顺序

![元素层叠顺序](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbc59ae1adb5454c8c7f60582df10ff9~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
+++

## 手写

+++primary 解决文本溢出问题

```css
/* 单行 */
.overflow{
  overflow: hidden;            /* 溢出隐藏 */
  text-overflow: ellipsis;     /* 溢出用省略号显示 */
  white-space: nowrap;         /* 规定段落中的文本不进行换行 */
}
/* 多行 */
.overflow-multiline{
  overflow: hidden;            /* 溢出隐藏 */
  text-overflow: ellipsis;     /* 溢出用省略号显示 */
  display:-webkit-box;         /* 作为弹性伸缩盒子模型显示。 */
  -webkit-box-orient:vertical; /* 设置伸缩盒子的子元素排列方式：从上到下垂直排列 */
  -webkit-line-clamp:3;        /* 显示的行数 */
}
```

+++

+++primary 清除浮动

1. 末尾空标签style设置clear：both
2. overflow：hidden
3. 伪元素设置

```css
::after{
  content:"";
  height:0;
  visibility:hidden;
  display:block;
  clear:both;
}
```

+++

+++primary 实现一个dialog(可拖拽)

```js
class Dialog {
  constructor(text) {
    this.lastX = 0
    this.lastY = 0
    this.x
    this.y
    this.text = text || ''
    this.isMoving = false
    this.dialog
  }
  open() {
    const model = document.createElement('div')
    model.id='model'
    model.style = `
    position:absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background-color:rgba(0,0,0,.3);
    display:flex;
    justify-content: center;
    align-items: center;`
    model.addEventListener('click',this.close.bind(this))
    document.body.appendChild(model)
    this.dialog = document.createElement('div')
    this.dialog.style = `
    padding:20px;
    background-color:white`
    this.dialog.innerText = this.text
    this.dialog.addEventListener('click',e=>{e.stopPropagation()})
    this.dialog.addEventListener('mousedown', this.handleMousedown.bind(this))
    document.addEventListener('mousemove', this.handleMousemove.bind(this))
    document.addEventListener('mouseup', this.handleMouseup.bind(this))
    model.appendChild(this.dialog)
  }
  close() {
    this.dialog.removeEventListener('mousedown',this.handleMousedown)
    document.removeEventListener('mousemove', this.handleMousemove)
    document.removeEventListener('mouseup',this.handleMouseup)
    document.body.removeChild(document.querySelector('#model')) 
  }
  handleMousedown(e) {
    this.isMoving = true
    this.x = e.clientX
    this.y = e.clientY
  }
  handleMousemove(e) {
    if (this.isMoving) {
      this.dialog.style.transform = `translate(${e.clientX - this.x + this.lastX}px,${e.clientY - this.y + this.lastY}px)`
    }
  }
  handleMouseup(e) {
    this.lastX = e.clientX - this.x + this.lastX
    this.lastY = e.clientY - this.y + this.lastY
    this.isMoving = false
  }
}
let dialog = new Dialog('Hello')
dialog.open()
```

+++
