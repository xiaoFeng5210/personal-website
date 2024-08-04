---
publishDate: 2024-03-09T00:00:00Z
author: 张庆风
title: WEB中元素的旋转控制点
image: https://images.unsplash.com/photo-1637144113536-9c6e917be447?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80
tags:
    - web
    - canvas
---


**控制点是吸附在图形上的一些小矩形和圆形点击区域，在控制点上拖拽鼠标，能够实时对被选中进行属性的更新**。
比如使用旋转控制点可以更新图形的旋转角度，使用缩放控制点调整图形的宽高。
这两个都是通用的控制点，此外还有给特定图形使用的专有控制点，像是矩形的圆角控制点，可拖动调整圆角大小。这些比较特别。后面会专门出一篇文章讲这个。
## 需求描述
选中图形，会出现旋转控制点和缩放控制点，然后操作控制点，调整图形属性。
![](https://cdn.nlark.com/yuque/0/2024/gif/10364805/1718342616877-65265d5d-81ec-4dca-abbe-5001a83b6d30.gif#averageHue=%23f6f4f4&clientId=u83730025-1194-4&from=paste&id=u8228c5a9&originHeight=322&originWidth=513&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u4c5d8e89-c42e-4560-a144-eb67f27cc99&title=)
控制点的类型和位置如下：
![](https://cdn.nlark.com/yuque/0/2024/webp/10364805/1718342616894-d88b0b01-0c5b-49fd-b752-19bd38c0b51a.webp#averageHue=%23eeecea&clientId=u83730025-1194-4&from=paste&id=u767003ec&originHeight=631&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ub2de8b2d-eeb3-4573-8e3c-256dffcbad9&title=)
缩放控制点有 8 个。
首先是 **西北（nw）、东北（ne）、东南（se）、西南（sw）缩放控制点**。它们在选中图形包围盒的四个顶点上，拖拽可同时调整图形的宽高。
接着是 **东（e）、南（s）、西（w）、北（n）缩放控制点**，拖拽它们只更新图形的宽或高。
它们是不可见的，但 hover 上去光标会变成缩放的光标。这几个控制点的点击区域很大。
![](https://cdn.nlark.com/yuque/0/2024/webp/10364805/1718342616928-0bf356a4-296f-4555-ac7d-288c552581d3.webp#averageHue=%23c7cdb2&clientId=u83730025-1194-4&from=paste&id=u1fb321e7&originHeight=640&originWidth=948&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u2f46bf62-0404-4a31-812f-1e445598f5d&title=)
**旋转控制点有 4 个，对应四个角落，分别为：nwRotation、neRotation、seRotation、swRotation**。
同样它们是透明的，但 hover 上去光标会变成旋转光标。
![](https://cdn.nlark.com/yuque/0/2024/webp/10364805/1718342617023-90cf9de1-84f9-4bd9-9a01-8e41c7fa128f.webp#averageHue=%23c9ccb2&clientId=u83730025-1194-4&from=paste&id=u4f4b30f7&originHeight=662&originWidth=918&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u87621a07-0ca2-4675-aa84-5a7748f7b6a&title=)
旋转控制点有另外一种风格，就是只在图形的某个方向（通常是正上方）有一个可见旋转控制点。下面是 Canva 编辑器的效果：
![](https://cdn.nlark.com/yuque/0/2024/webp/10364805/1718342616998-0e96ea85-a9f1-4a6b-8166-c18e15bbcf3d.webp#averageHue=%23ededed&clientId=u83730025-1194-4&from=paste&id=u25f6facd&originHeight=654&originWidth=792&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=uf697f7e7-eba5-47d9-9a82-ca5b896f253&title=)
我更喜欢第一种风格，画面会更清爽一些。
## 实现思路
整体实现思路很简单：

1. 根据图形的包围盒，计算这些控制点的位置，设置好宽高；
2. 渲染，设置为不可见的控制点跳过渲染；
3. hover 或点击时，编辑器会做 **图形拾取**，会和渲染顺序相反的顺序遍历控制点，调用控制点图形的 hitTest 方法找到第一个被点中的图形，返回对应控制点的类型和光标。然后编辑器更新光标，并根据控制点类型进入对应逻辑。如果你是用 html/svg 的方案，图形拾取可以不用自己做。
## 代码设计
我们需要实现控制点管理类 ControlHandleManager 和控制点类 ControlHandle。
ControlHandle 类记录以下信息：

1. graph：图形对象，记录控制点的左上角位置、宽高、颜色、是否可见，并带了一个点击区域方法；
2. cx / cy：控制点的中点位置；
3. getCursor()：获取光标方法，hover 时返回一个需要设置的光标值。

这里直接用图形编辑器绘制图形用到的图形类。
通常你使用的渲染图形库是会有
创建 ControlHandle 对象。
我们需要创建的控制点对象为：
```
// 右下角（ns）的控制点  
const se = new ControlHandle({
  graph: new Rect({
    objectName: 'se', // 控制点类型标识，放其他地方也行
    cx: 0, // x 和 y 会根据选中图形的包围盒更新
    cy: 0,
    width: 6,
    height: 6,
    fill: 'white',
    stroke: 'blue',
    strokeWidth: 1,
  }),
  getCursor: (type, rotation) => {
    // ...
    return 'se-rezise'
  } ,
});
```
这个对象会保存到控制点管理类的 transformHandles 属性中。
transformHandles 是一个映射表，类型标识字符串映射到控制点对象。
```
class ControlHandleManager {
  visible = false;
  transformHandles;

  constructor() {
    // 映射表 type -> 控制点
    this.transformHandles = {
      se: new ControlHandle(/* ... */),
      n: new ControlHandle(/* ... */),
      nwRoation: new ControlHandle(/* ... */),
      // ...
    }
  }
}
```
## 渲染
当我们选中图形时，调用渲染方法。
此时会调用 ControlHandleManager 的 draw 渲染方法，渲染控制点。

1. 根据包围盒计算控制点的中点位置。这个包围盒有 x、y、width、height、rotation 属性。我们需要计算这个包围盒的四个顶点的位置，包围盒外扩一定距离后的四个顶点的位置，四条线段的中点的位置。
```
class ControlHandleManager {
  // ...
  
  /** 渲染控制点 */
  draw(rect: IRectWithRotation) {
  
  // calculate handle position
  const handlePoints = (() => {
    const cornerPoints = rectToPoints(rect);
    const cornerRotation = rectToPoints(offsetRect(rect, size / 2 / zoom));
    const midPoints = rectToMidPoints(rect);

    return {
      ...cornerPoints,
      ...midPoints,
      nwRotation: { ...cornerRotation.nw },
      neRotation: { ...cornerRotation.ne },
      seRotation: { ...cornerRotation.se },
      swRotation: { ...cornerRotation.sw },
    };
  })();
 }
}
```

1. 遍历控制点对象，赋值上对应的中点坐标：cx、cy。调整 n/s/w/e 的宽高，它们的宽高是跟随
```
// 整个顺序是有意义的，是渲染顺序
const types = [
  'n',
  'e',
  's',
  'w',
  'nwRotation',
  'neRotation',
  'seRotation',
  'swRotation',
  'nw',
  'ne',
  'se',
  'sw',
] as const;

// 更新 cx 和 cy
for (const type of types) {
  const point = handlePoints[type];
  const handle = this.transformHandles.get(type);
  handle.cx = point.x;
  handle.cy = point.y;
}

// n/s/w/e 比较特殊，n/s 的宽和包围盒宽度相等，w/e 高等于包围盒高。
const neswHandleWidth = 9;
const n = this.transformHandles.get('n')!;
const s = this.transformHandles.get('s')!;
const w = this.transformHandles.get('w')!;
const e = this.transformHandles.get('e')!;
n.graph.width = s.graph.width = rect.width * zoom;
n.graph.height = s.graph.height = neswHandleWidth;
w.graph.height = e.graph.height = rect.height * zoom;
w.graph.width = e.graph.width = neswHandleWidth;
```

1. 接着就是遍历 transformHandles，基于 cx 和 cy 更新图形的 x/y，然后绘制。
```
this.transformHandles.forEach((handle) => {
  // 场景坐标转视口坐标
  const { x, y } = this.editor.sceneCoordsToViewport(handle.cx, handle.cy);
  const graph = handle.graph;
  graph.x = x - graph.width / 2;
  graph.y = y - graph.height / 2;
  graph.rotation = rect.rotation;

  // 不可见的图形不渲染（本地调试的时候可以让它可见）
  if (!graph.getVisible()) {
    return;
  }

  graph.draw();
});
```
渲染逻辑到此结束。
## 控制点拾取
在选择工具下，选中图形，控制点出现。
接着 hover 到控制点上，更新光标。并且在按下鼠标时，能够拿到对应的控制点类型，进行对应的旋转或缩放操作。
这里我们需要判断光标的位置是否在控制点上，即控制点拾取。

控制点拾取逻辑为：
以渲染顺序相反的方向遍历控制点，调用 hitTest 方法检测光标是否在控制点的点击区域上。
如果在，返回 type 和 cursor；否则返回 null。
```
class ControlHandleManager {
  // ...

  /** 获取在光标位置的控制点的信息 */
  getHandleInfoByPoint(hitPoint: IPoint) {
    const hitPointVW = this.editor.sceneCoordsToViewport(
      hitPoint.x,
      hitPoint.y,
    );
    
    for (let i = types.length - 1; i >= 0; i--) {
      const type = types[i];
      const handle = this.transformHandles.get(type);
 
      // 是否点中当前控制点
      const isHit = handle.graph.hitTest(
        hitPointVW.x,
        hitPointVW.y,
        handleHitToleration,
      );

      if (isHit) {
        return {
          handleName: type, // 控制点类型
          cursor: handle.getCursor(type, rotation), // 光标
        };
      }
    }
  }  
}
```
反向很重要，应为可能会有控制点发生重叠，此时应该是在更上方的控制点，也就是后渲染的控制点优先被选中。
## 光标
getCursor 返回的光标值是动态的，会因为包围盒的角度不同而变化，这里会有一个简单的转换。
```
const getResizeCursor = (type: string, rotation: number): ICursor => {
  let dDegree = 0;
  switch (type) {
    case 'se':
    case 'nw':
      dDegree = -45;
      break;
    case 'ne':
    case 'sw':
      dDegree = 45;
      break;
    case 'n':
    case 's':
      dDegree = 0;
      break;
    case 'e':
    case 'w':
      dDegree = 90;
      break;
    default:
      console.warn('unknown type', type);
  }

  const degree = rad2Deg(rotation) + dDegree;
  // 这个 degree 精度是很高的，
  // 设置光标时会做一个舍入，匹配一个合法的接近光标值，比如 ne-resize
  return { type: 'resize', degree };
}
```
旋转光标同理。
此外，浏览器支持的 resize 光标值是有限的。
![](https://cdn.nlark.com/yuque/0/2024/webp/10364805/1718342617272-ef7bd03c-f94e-4b4d-bb43-f8c0ea557099.webp#averageHue=%23fcfcfa&clientId=u83730025-1194-4&from=paste&id=u504d658a&originHeight=650&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ua2ab9977-b066-4d58-b4c3-f03ae933e97&title=)
为了更好的效果是实现 resize0 ～ resize179 代表不同角度的一共 180 个自定义 resize 光标。
或者做一个 “四舍五入”，转为浏览器支持的那几种 resize 角度，但这样光标效果不是很好，看起来光标并没有和控制点垂直，算是一种妥协。
![](https://cdn.nlark.com/yuque/0/2024/webp/10364805/1718342617323-db39f11e-2393-4336-8e17-6ccc6cc0f820.webp#averageHue=%23d3c2b1&clientId=u83730025-1194-4&from=paste&id=u861c7446&originHeight=668&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u54555f47-3ed6-4c8d-9b53-8de6134862b&title=)
旋转光标更是不存在了，我们要设计 rotation0 ~ rotation179 共 360 个自定义光标。当然我们可以让精度降一下，比如只实现偶数值的旋转角度的光标，比如 rotation0、rotation2、rotation4，也要 180 个。
关于自定义光标的实现方案，本文不深入讲解，会单独写一篇文章讨论。
## 坐标系
有个容易忽略的问题，就是控制点是绘制在哪个坐标系中的？
是场景坐标系，还是视口坐标系。
如果在场景坐标系中，图形会随画布的缩放或移动 “放大缩小”，比如一根 2px 的线条，在 zoom 为 50% 的画布下，显示的效果是 1px。
控制点的宽高是不应该跟随  zoom 而变化的。
如果你绘制在视口坐标系，宽高不需要考虑，只要转换一下 x，y。如果在场景坐标中，x、y 不用转换，但是宽高要除以 zoom。

## 元素和它的包围盒（bBox）
元素指的是一些图形，比如矩形、椭圆。
为了方便描述，后面都会用矩形作为例子。
元素有一个包围盒（Bounding Box），是能包裹元素的最小矩形。当然大一点也行，但必须能包裹元素。
```
const bBox = {
  x: 100,
  y: 100,
  width: 30,
  height: 40
}
```
x 和 y 代表包围盒的位置，width 和 height 代表盒子的尺寸。
另外元素一个 rotation 属性，表示元素以其中心位置（即包围盒的正中心）的旋转弧度。
bBox 是考虑旋转的（最外层的矩形）：
![](https://cdn.nlark.com/yuque/0/2024/webp/10364805/1718342711538-0aba6111-0d14-4862-902b-66a4d977c167.webp#averageHue=%23f1f1f1&clientId=u83730025-1194-4&from=paste&id=u89f7de51&originHeight=339&originWidth=588&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ufd3cfd47-eb07-4220-8c40-3b2bce59e93&title=)
bBox
还有一种不考虑旋转，我暂且称其为 bBoxWithoutRotation。它会忽视 rotation 的存在，得到一个旋转前的 bBox。我们使用它配合渲染层（ctx.rotate(angle)），绘制一个进行了旋转的盒子。
![](https://cdn.nlark.com/yuque/0/2024/webp/10364805/1718342711569-86eb9d79-cb63-40b4-b986-6fe38e2cce61.webp#averageHue=%23f1f1f1&clientId=u83730025-1194-4&from=paste&id=u1241a329&originHeight=326&originWidth=580&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ucc6c727a-20f2-4344-9af8-57165855c9f&title=)
bBoxWithoutRotation
## 选中元素
选中的元素需要分两种情况讨论，一种是选中单个元素，一种是选中多个元素。
**对于单个元素**，要绘制 bBoxWithoutRotation。原因是只有一个元素，也就一个旋转角度，旋转起来更能表现这个元素的情况。见下图：
![](https://cdn.nlark.com/yuque/0/2024/webp/10364805/1718342711544-a767a48f-de1e-4192-a099-5b721673b2ee.webp#averageHue=%23f1f1f1&clientId=u83730025-1194-4&from=paste&id=ua21376c2&originHeight=429&originWidth=650&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=uef0a4407-ddee-4a20-b618-683828c1a45&title=)
**对于多个元素**，情况则不同了，因为不同的元素有不同的旋转角度，所以要计算所有元素的 bBox，然后取出其中最小的 x、y 和最大的 x、y，组成包围所有元素的选中框：
![](https://cdn.nlark.com/yuque/0/2024/webp/10364805/1718342711560-c7865fdb-9836-462b-8721-e7a2e96b0c3c.webp#averageHue=%23f0f0f0&clientId=u83730025-1194-4&from=paste&id=uc14d7595&originHeight=445&originWidth=736&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ube874d1c-b536-4794-8c3c-a94d140c3bf&title=)
## 旋转元素
旋转元素同样分两种情况讨论：旋转单个元素，以及旋转多个元素。
先讲解 **旋转单个元素**。我们看看效果：
![](https://cdn.nlark.com/yuque/0/2024/gif/10364805/1718342711542-a12748ba-01a5-44a2-aa98-3c485f24359d.gif#averageHue=%23eeeeee&clientId=u83730025-1194-4&from=paste&id=u152824f4&originHeight=382&originWidth=586&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u1c45dd73-4bae-4405-b7f3-721e772926e&title=)
旋转单个元素
首先，从图形的中点连接光标位置，得到一个向量。我们的旋转角度就是这个向量和向上向量（即 [0, -1]）的夹角。
![](https://cdn.nlark.com/yuque/0/2024/webp/10364805/1718342711880-3687ee2f-9bc3-4d33-8e1a-480f64d9c290.webp#averageHue=%237b6e82&clientId=u83730025-1194-4&from=paste&id=u5e6afada&originHeight=238&originWidth=416&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u06ba4823-6e6f-4767-9d6e-f77718ab219&title=)
求向量角度
这里我们可以用 **点积公式** 来计算这个夹角。
> cos = (向量 a * 向量 b) / (向量 a 的模 * 向量 b 的模)

Math.acos()把余弦值转换为弧度。

旋转多个元素则复杂一些。
我们需要改变每个元素的旋转角度 rotation，以及 x、y 值。
这里我们需要知道一个很重要的信息：**元素上所有的点的旋转结果坐标，都是根据大包围盒中心旋转 rotation 得到的**。
首先是 rotation，旋转中心是这个大 bBox 的中心。
我们从元素的中点画一个向上的向量，这个向量是跟随着多元素旋转角度改变的。
所以，和单元素直接赋值不同，多元素旋转情况下，拖拽中产生的旋转角度需要作为增量，加在每个旋转前的元素起始角度上，即：
```
element.rotation = prevElementRotation + dRotation;
```
然后是计算每个元素 **新的 x 和 y 值**。
也很简单，对旋转前的中点 cx 和 cy，使用旋转算法，计算出新的 cx 和 cy ，然后减去宽高/2即可。
### 完整代码
```typescript
function calAngle(cx, cy, x, y) {
    const radian = getCosBy2pt(x, y, cx, cy);
    let angle = Math.acos(radian) * 180 / Math.PI;

    if (x < cx) angle = -angle;
    return angle;

    // 计算 点1指点2形成 的向量 
    function getCosBy2pt(x, y, cx, cy) {
        let a = [x - cx, y - cy];
        let b = [0, -1];
        return calCos(a, b);
    }
    function calCos(a, b) {
        // 点积
        let dotProduct = a[0] * b[0] + a[1] * b[1];
        let d = Math.sqrt(a[0] * a[0] + a[1] * a[1]) * Math.sqrt(b[0] * b[0] + b[1] * b[1]);
        return dotProduct/d;
    }
}
```
## 需要实现的算法
在这个过程中你需要实现的算法有：

1. 求向量夹角，需要用点积公式；
2. 旋转算法，需要考虑旋转中心；
3. 计算 bBox，其实就是将 bBox 转换为 4 个边角的坐标，然后取最小的 x、y 和最大的 x、y 重新组合成一个 box；

然后其他就是繁琐的交互逻辑了。
