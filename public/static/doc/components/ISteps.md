# 步骤条

基于IDM和Antd Vue 开发的步骤条，主要作用是引导用户按照流程完成任务的导航条，其意义在于当任务复杂或者存在先后关系时，将其分解成一系列步骤，从而简化任务。

## 组件类名（className）

ISteps

## 组件类ID（classId）

idm.componet.advanced.isteps

## 组件开发语言（comLangue）

vue

## 组件类型（comType）

common

## 所在代码包版本

advanced@1.0.0

## 组件属性

此章节主要介绍该组件的每个属性的含义以及如何使用说明

### 唯一标识【ctrlId】

只读属性，不可修改，作为每个组件实例的一个唯一标识

- 标识：`ctrlId`
- 默认值：`@[packageid]`

### 基本属性

<font color="#CCCCCC">此章节主要用于存放设置组件所需要的一些基本信息的属性，以达到组件具备使用的基础条件</font>

#### 步骤类型【type】

步骤的类型，目前有两种方式：

1. 默认方式：
![Description](./idm_modules/advanced/1.0.0/static/doc/resource/images/advancedsteptyptypedefault.jpg)

![Description](./idm_modules/advanced/1.0.0/static/doc/resource/images/advancedsteptyptypedefault1.jpg)

2. 导航方式：
![Description](./idm_modules/advanced/1.0.0/static/doc/resource/images/advancedsteptyptypenav.jpg)

- 标识：`type`
- 默认值：`默认方式`

#### 步骤方向【direction】

设置步骤的放心，目前支持水平和垂直，效果如下：

![Description](./idm_modules/advanced/1.0.0/static/doc/resource/images/advancedsteptyptypedirection.jpg)


- 标识：`direction`
- 默认值：`水平`

#### 标签位置【labelPlacement】

指定标签放置位置，默认`水平`放图标右侧，可选`竖直(vertical)`放图标下方	


- 标识：`labelPlacement`
- 默认值：`水平`

#### 大小【size】

用于设置步骤组件的大小，目前有2种大小可设置：`默认`、`迷你`

- 标识：`size`
- 默认值：`默认`

#### 默认步骤【defaultCurrentStep】

设置默认显示在哪个步骤中，最小0，最大99999

- 标识：`defaultCurrentStep`
- 默认值：`0`

#### 起始序号【initial】

设置起始序号，最小0，最大99999

- 标识：`initial`
- 默认值：`0`

#### 点状步骤【progressDot】

设置是否点状步骤条，如下图：

点状型：
![Description](./idm_modules/advanced/1.0.0/static/doc/resource/images/advancedsteptyptypedefault.jpg)

数字型：
![Description](./idm_modules/advanced/1.0.0/static/doc/resource/images/advancedsteptyptypedefault1.jpg)

- 标识：`progressDot`
- 默认值：false

#### 步骤状态【status】

指定当前步骤的状态，可选 wait process finish error

- 标识：`status`
- 默认值：`process`

### 步骤集合配置【子表】【stepList】

<font color="#CCCCCC">此章节主要用于存放设置组件所需要的步骤数据信息的属性</font>

#### 标题【title】

设置步骤显示的标题

- 标识：`title`
- 默认值：`标题`

#### 子标题【subTitle】

设置步骤显示的子标题

- 标识：`title`
- 默认值：空

#### 详情描述【description】

设置步骤显示的详情描述

- 标识：`description`
- 默认值：空

#### 禁用点击【disabled】

禁用则点击步骤不触发切换步骤事件

- 标识：`disabled`
- 默认值：true

### 样式设置

<font color="#CCCCCC">用于设置组件的通用属性的分组。</font>

#### 内外边距【box】

设置组件的最外围的外边距和内边距

- 标识：`box`

- 默认值：空

#### 宽高

<font color="#CCCCCC">用于对容器的宽高进行行内分组，此处建议都设置为 auto。</font>

##### 宽【width】

组件的宽度，填写 auto 则为自适应，或者使用 px、%、vw 等单位，比如 100%、100px、100vw 等等，不过此处建议设置为<font color="#FF0000">`auto`</font>

- 标识：`width`

- 默认值：`auto`

##### 高【height】

组件的高度，填写 auto 则为自适应，或者使用 px、%、vh 等单位，比如 100%、100px、100vh 等等，不过此处建议设置为<font color="#FF0000">`auto`</font>

- 标识：`height`

- 默认值：`auto`

#### 背景设置

<font color="#CCCCCC">用于对容器的背景设置分组。</font>

##### 背景色【bgColor】

设置组件的整体背景颜色

- 标识：`bgColor`

- 默认值：空

##### 背景图片【bgImgUrl】

设置组件的整体背景图片，此处可以填写图片地址，也可直接上传图片，上传成功后都是会把地址回填到文本框中，地址是会经过[IDM.url.getWebPath](https://yunit-code.github.io/zh/coreapi/api.html#getwebpath)转换的，地址可填写的前缀方式可以点击[此处](https://yunit-code.github.io/zh/coreapi/api.html#getwebpath)参考。

- 标识：`bgImgUrl`

- 默认值：空

##### 横向偏移【positionX】

设置背景图片的横向偏移值，请参考 [background-position-x](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-position-x)

- 标识：`positionX`

- 默认值：空

##### 纵向偏移【positionY】

设置背景图片的纵向偏移值，请参考 [background-position-y](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-position-y)

- 标识：`positionY`

- 默认值：空

##### 背景大小【bgSize】

设置背景图片的背景类型，目前有以下三种方式提供选择：

1. **裁剪显示：** 缩放背景图片以完全覆盖背景区，可能背景图片部分看不见。
2. **完全显示：** 缩放背景图片以完全装入背景区，可能背景区部分空白。
3. **自定义：** 自定义设定宽度和高度值

- 标识：`bgSize`

- 默认值：空

🍹 更深刻的含义请参考 [background-size](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-size)

##### 宽度【bgSizeWidth】

设置背景图片的背景宽度值

- 标识：`bgSizeWidth`

- 默认值：空

🍹 更深刻的含义请参考 [background-size](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-size)

##### 高度【bgSizeHeight】

设置背景图片的背景高度值

- 标识：`bgSizeHeight`

- 默认值：空

🍹 更深刻的含义请参考 [background-size](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-size)

##### 平铺模式【bgRepeat】

设置背景图片的背景平铺模式，目前有以下五种方式提供选择：

1. **双向重复：** 图片不够覆盖的时候 X、Y 轴都会重复显示
2. **水平重复：** 图片不够覆盖的时候 X 轴都会重复显示
3. **垂直重复：** 图片不够覆盖的时候 Y 轴都会重复显示
4. **不重复：** 图片不够覆盖的时候不重复显示
5. **继承：** 继承父容器属性

- 标识：`bgRepeat`

- 默认值：空

🍹 更深刻的含义请参考 [background-repeat](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-repeat)

##### 背景模式【bgAttachment】

设置背景图像的位置是在视口内固定，或者随着包含它的区块滚动，目前有以下三种方式提供选择：

1. **固定：** 此关键属性值表示背景相对于视口固定。即使一个元素拥有滚动机制，背景也不会随着元素的内容滚动。
2. **滚动：** 此关键属性值表示背景相对于元素本身固定， 而不是随着它的内容滚动（对元素边框是有效的）。
3. **继承：** 继承父容器属性

- 标识：`bgAttachment`

- 默认值：空

🍹 更深刻的含义请参考 [background-attachment](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-attachment)

#### 边框【border】

设置组件的最外层的边框和圆角，可点击中间加号统一设置四边或四角，也可单独一边一边设置不同的边框或圆角样式。

- 标识：`border`

- 默认值：空

#### 文字【font】

设置组件的整体文字的字体样式，可设置文字的字体、字重、样式、字体颜色、大小、行高、对齐、修饰等。

- 标识：`font`

- 默认值：空

### 高级

<font color="#CCCCCC">用于对组件高级设置的属性的分组。</font>

#### 切换步骤自定义函数【stepChangeFunction】

点击切换步骤时候会调用此方法，接收参数格式为：

```json
{
  "urlData": "url参数序列化字符串",
  "pageId": "页面ID",
  "customParam": "自定义的参数",
  "_this": "组件this对象",
  "current":"当前的步骤"
}
```

- 标识：`stepChangeFunction`

- 默认值：空

- 可设置函数数量：多个