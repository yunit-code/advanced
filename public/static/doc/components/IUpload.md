# 上传控件

基于IDM和antd vue 开发的一个简易且容易配置的上传组件，基本的控件属性是能支持配置的，且支持内部放其他组件，配置简单且功能比较丰富，并且支持拖拽上传。

## 组件类名（className）

IUpload

## 组件类ID（classId）

idm.componet.advanced.iupload

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

#### 上传地址【action】

设置上传接收文件的后端接口地址

- 标识：`action`
- 默认值：`/ctrl/idm/api/upload`

#### 参数名称【name】

设置发到后台的文件参数名

- 标识：`name`
- 默认值：`file`

#### 文件类型【accept】

设置接受上传的文件类型, 详见 [input accept Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept)，例如：.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document

- 标识：`accept`
- 默认值：``

##### 支持拖拽【isDragger】

设置是否支持拖拽，如果启用则可直接拖拽文件到此控件区域即可上传

- 标识：`isDragger`
- 默认值：true


##### 文件夹【directory】

设置是否支持文件夹上传

- 标识：`directory`
- 默认值：false

##### 默认禁用【disabled】

设置默认状态下是否禁用，如果想要动态变化可以通过禁用自定义函数实现

- 标识：`disabled`
- 默认值：false

##### 多选文件【multiple】

设置是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件。

- 标识：`multiple`
- 默认值：false

##### 上传列表【showUploadList】

设置是否展示上传列表

- 标识：`showUploadList`
- 默认值：true

##### 预览图标【showPreviewIcon】

设置上传列表是否展示预览图标。

- 标识：`showPreviewIcon`
- 默认值：true
- 显示条件：`上传列表=true`

##### 移除图标【showRemoveIcon】

设置上传列表是否展示移除图标。

- 标识：`showRemoveIcon`
- 默认值：true
- 显示条件：`上传列表=true`

##### cookie【withCredentials】

上传请求时是否携带 cookie

- 标识：`withCredentials`
- 默认值：true

#### 列表样式【listType】

上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card

- 标识：`listType`
- 默认值：`text`

### 样式设置

<font color="#CCCCCC">用于设置组件的整体基础样式外观的组件属性的分组。</font>

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

#### 文件变动联动组件

<font color="#CCCCCC">当文件有变动会联动这里选择的组件，把当前结果的对象传递给这些组件</font>

##### 需求组件范围【linkageDemandPageModule】

当前数据变动需要联动其他组件需求值（比如用于其他组件的接口参数等）的组件范围

- 标识：`linkageDemandPageModule`

- 默认值：空

- 可设置组件数量：多个

##### 结果组件范围【linkageResultPageModule】

当前数据变动需要联动其他组件变更结果值的组件范围，主要用于把数据传递给组件本身所需要返回的值，也就是模拟输入的值，或者说当前组件所选中或填写的值。

- 标识：`linkageResultPageModule`

- 默认值：空

- 可设置组件数量：多个

#### 自定义上传函数【customUploadFunction】

如果直接使用上传接口地址无法满足要求可以通过此处自定义函数实现上传，接收参数为格式为：
```json
{
  "customParam": "自定义的参数",
  "that": "组件this对象",
  "moduleObject":"组件对象",
  "fileList":"当前文件列表",
  "file":"当前操作的文件对象"
}
```

- 标识：`customUploadFunction`

- 默认值：空

- 可设置函数数量：单个

#### 自定义参数上传函数【customDataFunction】

如果需要上传的时候额外传递其他参数可以通过此处自定义函数来返回，返回格式为object，接收参数为格式为：

```json
{
  "customParam": "自定义的参数",
  "that": "组件this对象",
  "moduleObject":"组件对象",
  "fileList":"当前文件列表",
  "file":"当前操作的文件对象"
}
```

- 标识：`customDataFunction`

- 默认值：空

- 可设置函数数量：单个

#### 自定义禁用函数【customDisabledFunction】

如果需要动态变化禁用状态可以通过此处自定义函数来返回，返回格式为boolean，接收参数为格式为：

```json
{
  "customParam": "自定义的参数",
  "that": "组件this对象",
  "moduleObject":"组件对象",
  "fileList":"当前文件列表",
  "file":"当前操作的文件对象"
}
```

- 标识：`customDisabledFunction`

- 默认值：空

- 可设置函数数量：单个

#### 自定义请求头部函数【customHeadersFunction】

设置上传的请求头部，IE10 以上有效，返回格式为object，接收参数为格式为：

```json
{
  "customParam": "自定义的参数",
  "that": "组件this对象",
  "moduleObject":"组件对象",
  "fileList":"当前文件列表",
  "file":"当前操作的文件对象"
}
```

- 标识：`customHeadersFunction`

- 默认值：空

- 可设置函数数量：单个

#### 移除自定义函数【customRemovedFunction】

如果删除附件会调用此处设置的自定义函数，接收参数为格式为：

```json
{
  "customParam": "自定义的参数",
  "that": "组件this对象",
  "moduleObject":"组件对象",
  "fileList":"当前文件列表",
  "file":"当前操作的文件对象"
}
```

- 标识：`customRemovedFunction`

- 默认值：空

- 可设置函数数量：多个

#### 点击预览自定义函数【customPreviewFunction】

点击文件链接或预览图标时会调用此处设置的自定义函数，接收参数为格式为:

```json
{
  "customParam": "自定义的参数",
  "that": "组件this对象",
  "moduleObject":"组件对象",
  "fileList":"当前文件列表",
  "file":"当前操作的文件对象"
}
```

- 标识：`customPreviewFunction`

- 默认值：空

- 可设置函数数量：多个


#### 文件预览自定义函数【customPreviewFileFunction】

当设置展示的列表为图片时候可以设置此处的自定义函数，接收参数为格式为:

```json
{
  "customParam": "自定义的参数",
  "that": "组件this对象",
  "moduleObject":"组件对象",
  "fileList":"当前文件列表",
  "file":"当前操作的文件对象"
}
```

- 标识：`customPreviewFileFunction`

- 默认值：空

- 可设置函数数量：多个


#### 下载自定义函数【customDownloadFunction】

点击下载文件时的回调，如果没有指定，则默认跳转到文件 url 对应的标签页，接收参数为格式为:

```json
{
  "customParam": "自定义的参数",
  "that": "组件this对象",
  "moduleObject":"组件对象",
  "fileList":"当前文件列表",
  "file":"当前操作的文件对象"
}
```

- 标识：`customDownloadFunction`

- 默认值：空

- 可设置函数数量：多个


#### 拖拽文件不符合格式自定义函数【customRejectFunction】

如果拖拽文件不符合限定上传的格式会调用此处设置的自定义函数，接收参数为格式为:

```json
{
  "customParam": "自定义的参数",
  "that": "组件this对象",
  "moduleObject":"组件对象",
  "fileList":"当前文件列表",
  "file":"当前操作的文件对象"
}
```

- 标识：`customRejectFunction`

- 默认值：空

- 可设置函数数量：多个

#### 上传文件之前钩子自定义函数【customBeforeUploadFunction】


上传文件之前的钩子，参数为上传的文件，若返回 false 则停止上传。支持返回一个 Promise 对象，Promise 对象 reject 时则停止上传，resolve 时开始上传（ resolve 传入 File 或 Blob 对象则上传 resolve 传入对象）。注意：IE9 不支持该方法。接收参数为格式为:

```json
{
  "customParam": "自定义的参数",
  "that": "组件this对象",
  "moduleObject":"组件对象",
  "fileList":"当前文件列表",
  "file":"当前操作的文件对象"
}
```

- 标识：`customBeforeUploadFunction`

- 默认值：空

- 可设置函数数量：单个