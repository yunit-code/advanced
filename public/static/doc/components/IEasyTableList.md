# 表格列表

基于IDM和antd vue 开发的一个简易且容易配置的表格组件，基本的表格属性是能支持配置的，且支持字段列自定义配置，配置简单且功能比较丰富，对于样式没有过高要求的可以使用此组件。

## 组件类名（className）

IEasyTableList

## 组件类ID（classId）

idm.componet.advanced.ieasytablelist

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

#### 布局方式【tableLayout】

设置表格字段的布局方式，目前支持`自动`适配还是`固定`，也就是表格元素的 table-layout 属性，设为 `固定` 表示内容不会影响列的布局

- 标识：`tableLayout`
- 默认值：`自动`

#### 尺寸【size】

用于设置表格的整体大小，目前有三种大小可设置：`小`、`中`、`大`

- 标识：`size`
- 默认值：`大`

#### 显示表头【showHeader】

用于设置表格是否显示表头

- 标识：`showHeader`
- 默认值：true

#### 显示边框【showBordered】

用于设置表格是否展示外边框和列边框

- 标识：`showBordered`
- 默认值：true

#### X最大宽【scrollX】

用于设置表格指定滚动区域的宽，为0则不设置

- 标识：`scrollX`
- 默认值：空

#### Y最大高【scrollY】

用于设置表格指定滚动区域的高，为0则不设置

- 标识：`scrollY`
- 默认值：空

#### 启用选择【rowSelection】

设置列表项是否可选择，等同于设置是否显示最左侧的复选框一列

- 标识：`rowSelection`
- 默认值：false

#### 启用分页【openPagination】

设置表格是否开启自带的分页功能

- 标识：`openPagination`
- 默认值：true

#### 为空提示【noDataTip】

设置表格空数据下显示的文字

- 标识：`noDataTip`
- 默认值：`暂无数据`

#### 唯一主键【rowKey】

表格行 key 的取值，可以是返回数据的唯一主键的字段名称，不填写则默认为id

- 标识：`rowKey`
- 默认值：空

### 分页设置

<font color="#CCCCCC">此章节主要用于存放设置组件的分页功能所需要的属性分组。</font>

#### 分页位置【paginationPosition】

设置指定分页显示的位置，支持：top、bottom、both

- 标识：`paginationPosition`
- 默认值：`bottom`

#### 分页条数【pageSizeOptions】

指定每页可以显示多少条，以逗号隔开，例如：10,20,30,40

- 标识：`pageSizeOptions`
- 默认值：`10,20,30,40`

#### 默认条数【defaultPageSize】

默认的每页条数，一般指定分页条数设置的其中一个即可，最大300，最小1

- 标识：`defaultPageSize`
- 默认值：`10`

#### 单页隐藏【hideOnSinglePage】

设置只有一页时是否隐藏分页器

- 标识：`hideOnSinglePage`
- 默认值：false

#### 禁用分页【disabledPagination】

设置是否禁用分页

- 标识：`disabledPagination`
- 默认值：false

#### 快速跳转【showQuickJumper】

设置是否开启可以快速跳转至某页

- 标识：`showQuickJumper`
- 默认值：false

#### 改变分页【showSizeChanger】

设置是否开启可以改变每页的大小

- 标识：`showSizeChanger`
- 默认值：false

#### 迷你分页【smallPagination】

设置是否是小尺寸分页

- 标识：`smallPagination`
- 默认值：false

#### 简单分页【simplePagination】

设置是否显示为简单分页

- 标识：`simplePagination`
- 默认值：false

#### 总量显示格式化【showTotalFormat】

设置用于显示数据总量和当前数据顺序，示例：@[range[0]]-@[range[1]] of @[total] items

- 标识：`showTotalFormat`
- 默认值：空

### 列表数据源

<font color="#CCCCCC">此章节主要用于存放设置组件的数据源所需要的属性分组。</font>

#### 数据来源【dataSourceType】

设置列表数据获取方式，目前有以下三种：
1. **自定义接口：** 以自定义接口的方式去获取内容，能满足大部分要求。
2. **页面统一接口：** 以页面设置的接口返回的接口结果来显示到此组件上，这种特别适合多个表格组件显示一个接口返回的内容。
3. **自定义函数：** 通过写自定义函数来返回组件要显示的内容。

- 标识：`dataSourceType`
- 默认值：`自定义接口`

#### 接口地址【customInterfaceUrl】

用于获取数据源的接口地址，请按照统一标准的返回格式返回数组格式的数据，格式如下：
```json
{
    "code":"200",
    "data":{
        "rows":[
            {...},
            ...
        ],
        "total":1
    }
}
```
当然也可以不按照此格式返回，不过需要在`返回数据处理函数`用自定义函数进行格式化处理。

- 标识：`customInterfaceUrl`
- 默认值：空
- 显示条件：`数据来源=自定义接口`

#### 请求方式【requestType】

设置接口地址请求方式，目前支持`POST`与`GET`两种。

- 标识：`customInterfaceUrl`
- 默认值：`GET`
- 显示条件：`数据来源=自定义接口`

#### 请求类型【requestContentType】

用于设置接口请求携带的参数是什么类型，也就是Headers的Content-Type类型，目前有以下三种方式：
1. 默认：没有设置Content-Type的任何类型，使用默认的方式
2. JSON：设置Content-Type的类型为 application/json;charset=UTF-8 类型
3. FormData：设置Content-Type的类型为 multipart/form-data 类型

- 标识：`requestContentType`
- 默认值：`默认`

- ***📢温馨提示：***
参数类型解释请参考： [内容类型注解](https://www.runoob.com/http/http-content-type.html)

#### 请求参数自定义函数【requestParamFun】

请求接口时会调用这里设置的函数返回自定义的参数，返回格式为Object对象，例如：{param1:'',param2:''}

- 标识：`requestParamFun`

- 默认值：空

- 可设置函数数量：单个


#### 接收其他组件联动参数【子表】【linkageParamList】

<font color="#CCCCCC">此章节主要用于存放设置组件的数据源接收其他组件传递过来的消息作为参数传递给数据源接口的属性分组。</font>

##### 表单标识【msgKey】

填写设置需要联动消息的 messageKey 的值

- 标识：`msgKey`

- 默认值：空

##### 参数别名【paramKey】

设置需要提交给后端的参数名称

- 标识：`paramKey`

- 默认值：空

##### 参数处理函数【paramFun】

如果通过表单标识（messageKey）获取的参数内容不满足要求可以通过此处的参数处理函数进行格式化

- 标识：`paramFun`

- 默认值：空

- 可设置函数数量：单个

#### 返回数据处理函数【responseDataFun】

针对请求接口成功后返回的数据格式处理，返回列表需要的数据格式，格式要求如下：
```json
{
    "data":{
        "rows":[
            {...},
            ...
        ],
        "total":1
    }
}
```

- 标识：`responseDataFun`

- 默认值：空

- 可设置函数数量：单个

#### 请求错误自定义函数【requestErrorFun】

请求接口失败时候会调用此处的自定义函数，接收参数：

```json
{
  "error": "错误对象",
  ...接口请求的参数,
  ...函数自定义的参数,
  "moduleObject":"组件对象",
  "_this": "组件this对象"
}
```

- 标识：`requestErrorFun`

- 默认值：空

- 可设置函数数量：单个

#### 结果集名【dataName】

页面接口设定的结果集名称，位置为：页面设置》高级设置》页面接口

- 标识：`dataName`

- 默认值：``

- 显示条件：`数据来源=页面统一接口`

#### 显示字段【dataFiled】

根据接口返回数据格式指定结果集的字段，比如结果集名为resultData（自定义接口忽略）且它的值为{data:{filedName:[{\"text\":\"\",\"value\":\"\",\"check\":true}]}}，则这里应该填写data.filedName

- 标识：`dataFiled`

- 默认值：``

- 显示条件：`数据来源=页面统一接口`

#### 自定义函数【customFunction】

获取数据源的时候会调用此方法，返回数据格式如下：
```json
{
    "rows":[
        {...},
        ...
    ],
    "total":1
}
```

### 数据列配置【子表】【columnsList】

<font color="#CCCCCC">此章节主要用于存放设置组件的显示列的配置项的属性分组。</font>

#### 列头标题【title】

设置当前列的表头显示的文字

- 标识：`title`

- 默认值：``

#### 数据字段【dataIndex】

列数据在数据项中对应的 key，支持 a.b.c 的嵌套写法

- 标识：`dataIndex`

- 默认值：``

#### 数据KEY【key】

Vue 需要的 key。如果已经设置了唯一的 数据字段，可以忽略这个属性不填写

- 标识：`key`

- 默认值：``

#### 对齐方式【align】

设置列内容的对齐方式，有三种对齐方式：`left`、`center`、`right`

- 标识：`align`

- 默认值：`left`

#### 列固定【fixed】

设置列是否固定以及固定方式，有三种方式：`不固定`、`居左`、`居右`

- 标识：`fixed`

- 默认值：`不固定`

#### 列宽度【width】

设置列的宽度，可为数字或字符串，格式：100 或 100px 或 10%

- 标识：`width`

- 默认值：空

#### 超宽省略【ellipsis】

超过宽度将自动省略。设置为 true 时，表格布局将变成 tableLayout=\"fixed\"

- 标识：`ellipsis`

- 默认值：true

#### 标题自定义函数【titleCustomRender】

如果标题无法纯文字展示的时候可以设置自定义标题的展示内容的自定义函数，可返回html和text，接收参数格式为：
```json
{
  "urlData": "url参数序列化字符串",
  "pageId": "页面ID",
  "customParam":"函数自定义的参数",
  "_this": "组件this对象"
}
```
📢**_温馨提示_**：
设置了此方法列头标题则无效

- 标识：`titleCustomRender`

- 默认值：空

- 可设置函数数量：单个

#### 返回格式【titleCustomRenderReturnType】

设置标题自定义函数返回格式，目前支持`html`、`text`

- 标识：`titleCustomRenderReturnType`

- 默认值：`text`

#### 行自定义渲染函数【rowsCustomRender】

生成复杂显示格式的数据渲染函数，参数分别为当前行的值，当前行数据，行索引，可返回html和text，接收参数格式为：
```json
{
  text, 
  record, 
  index,
  "customParam":"函数自定义的参数"
}
```

- 标识：`rowsCustomRender`

- 默认值：空

- 可设置函数数量：单个

#### 返回格式【rowsCustomRenderReturnType】

设置标题自定义函数返回格式，目前支持`html`、`text`

- 标识：`rowsCustomRenderReturnType`

- 默认值：`text`

#### column自定义函数【columnCustomFunction】

返回对象的属性将添加表格的column配置项中，例如返回：{ filters: [], onFilter: ()=>{} }

- 标识：`columnCustomFunction`

- 默认值：空

- 可设置函数数量：单个

### 选择列配置

<font color="#CCCCCC">此章节主要用于存放设置组件的选择列的配置项的属性分组。</font>

#### 列宽度【rowSelectionColumnWidth】

自定义列表选择框宽度

- 标识：`rowSelectionColumnWidth`

- 默认值：空

#### 列标题【rowSelectionColumnTitle】

自定义列表选择框标题

- 标识：`rowSelectionColumnTitle`

- 默认值：空

#### 固定左边【rowSelectionFixed】

设置是否把选择框列固定在左边

- 标识：`rowSelectionFixed`

- 默认值：false

#### 隐藏全选【hideDefaultSelections】

设置是否去掉『全选』『反选』两个默认选项

- 标识：`hideDefaultSelections`

- 默认值：false


#### 单选/多选【rowSelectionType】

设置选择列是多选还是单选

- 标识：`rowSelectionType`

- 默认值：`多选`

#### 选择框属性自定义函数【getCheckboxProps】

返回选择框的默认属性配置的自定义函数，接收参数格式为：
```json
{
  "urlData": "url参数序列化字符串",
  "pageId": "页面ID",
  "customParam":"函数自定义的参数",
  "_this": "组件this对象",
  record
}
```
返回数据格式为Object，例如：
```json
{
    props: {
        disabled: record.name === 'Disabled User',name: record.name,
    }
}
```

- 标识：`getCheckboxProps`

- 默认值：空

- 可设置函数数量：单个

#### 选中项发生变化时的回调【rowSelectionOnChange】

设置选中项发生变化时的回调，接收参数格式为：
```json
{
  "urlData": "url参数序列化字符串",
  "pageId": "页面ID",
  "customParam":"函数自定义的参数",
  "_this": "组件this对象",
  selectedRowKeys, 
  selectedRows
}
```

- 标识：`rowSelectionOnChange`

- 默认值：空

- 可设置函数数量：多个

#### 手动选择/取消某列的自定义函数【rowSelectionOnSelect】

设置用户手动选择/取消选择某列的回调函数，接收参数格式为：
```json
{
  "urlData": "url参数序列化字符串",
  "pageId": "页面ID",
  "customParam":"函数自定义的参数",
  "_this": "组件this对象",
  record, 
  selected, 
  selectedRows, 
  nativeEvent
}
```

- 标识：`rowSelectionOnSelect`

- 默认值：空

- 可设置函数数量：多个

#### 手动选择反选的自定义函数【rowSelectionOnSelectInvert】

设置用户手动选择反选的回调函数，接收参数格式为：
```json
{
  "urlData": "url参数序列化字符串",
  "pageId": "页面ID",
  "customParam":"函数自定义的参数",
  "_this": "组件this对象",
  selectedRows
}
```

- 标识：`rowSelectionOnSelectInvert`

- 默认值：空

- 可设置函数数量：多个

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

#### 表头文字【tableTitleFont】

设置组件的表头文字的字体样式，可设置文字的字体、字重、样式、字体颜色、大小、行高、对齐、修饰等。

- 标识：`tableTitleFont`

- 默认值：空

### 高级

<font color="#CCCCCC">用于对组件高级设置的属性的分组。</font>

#### 分页/排序/筛选变化函数【tableChangeFunction】

分页、排序、筛选变化的时候会调用此方法，接收参数为格式为:
```json
{
  "urlData": "url参数序列化字符串",
  "pageId": "页面ID",
  "customParam": "自定义的参数",
  "_this": "组件this对象",
  pagination, 
  filters, 
  sorter
}
```

- 标识：`tableChangeFunction`

- 默认值：空

#### 额外的展示行函数【expandedRowRender】

如果需要展示额外的展开行，可以这里自定义函数，可返回html和text，接收参数格式为：
```json
{
  "urlData": "url参数序列化字符串",
  "pageId": "页面ID",
  "customParam": "自定义的参数",
  "_this": "组件this对象",
  record, 
  index, 
  indent, 
  expanded
}
```

- 标识：`expandedRowRender`

- 默认值：空

#### 返回格式【expandedRowRenderReturnType】

额外的展示行函数返回格式，目前支持`html`、`text`

- 标识：`expandedRowRenderReturnType`

- 默认值：`text`

#### 头部点击自定义函数【customHeaderClick】

设置头部点击的回调函数，接收参数格式为：
```json
{
  "urlData": "url参数序列化字符串",
  "pageId": "页面ID",
  "customParam": "自定义的参数",
  "_this": "组件this对象",
  column, 
  index
}
```

- 标识：`customHeaderClick`

- 默认值：空

#### 行自定义样式名函数【rowClassNameFunction】

设置表格行的样式名的自定义函数，返回表格行的类名，接收参数格式为：
```json
{
  "urlData": "url参数序列化字符串",
  "pageId": "页面ID",
  "customParam": "自定义的参数",
  "_this": "组件this对象",
  record, 
  index
}
```

- 标识：`rowClassNameFunction`

- 默认值：空


#### 行点击自定义函数【customRowClick】

设置行点击的自定义函数，接收参数格式为：
```json
{
  "urlData": "url参数序列化字符串",
  "pageId": "页面ID",
  "customParam": "自定义的参数",
  "_this": "组件this对象",
  record, 
  index
}
```

- 标识：`customRowClick`

- 默认值：空


#### 行双击自定义函数【customRowDbClick】

设置行双击的自定义函数，接收参数格式为：
```json
{
  "urlData": "url参数序列化字符串",
  "pageId": "页面ID",
  "customParam": "自定义的参数",
  "_this": "组件this对象",
  record, 
  index
}
```

- 标识：`customRowDbClick`

- 默认值：空

#### 行右键自定义函数【customRowContextMenu】

设置行右键点击的自定义函数，接收参数格式为：
```json
{
  "urlData": "url参数序列化字符串",
  "pageId": "页面ID",
  "customParam": "自定义的参数",
  "_this": "组件this对象",
  record, 
  index
}
```

- 标识：`customRowDbClick`

- 默认值：空

#### 行移入自定义函数【customRowMouseenter】

设置行移入的自定义函数，接收参数格式为：
```json
{
  "urlData": "url参数序列化字符串",
  "pageId": "页面ID",
  "customParam": "自定义的参数",
  "_this": "组件this对象",
  record, 
  index
}
```

- 标识：`customRowDbClick`

- 默认值：空

#### 行移出自定义函数【customRowMouseleave】

设置行移出的自定义函数，接收参数格式为：
```json
{
  "urlData": "url参数序列化字符串",
  "pageId": "页面ID",
  "customParam": "自定义的参数",
  "_this": "组件this对象",
  record, 
  index
}
```

- 标识：`customRowDbClick`

- 默认值：空
