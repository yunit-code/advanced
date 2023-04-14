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
### 样式设置
#### 内外边距【box】
#### 宽高
##### 宽【width】
##### 高【height】
#### 背景设置
##### 背景色【bgColor】
##### 背景图片【bgImgUrl】
##### 横向偏移【positionX】
##### 纵向偏移【positionY】
##### 背景大小【bgSize】
##### 宽度【bgSizeWidth】
##### 高度【bgSizeHeight】
##### 平铺模式【bgRepeat】
##### 背景模式【bgAttachment】
#### 边框【border】
#### 文字【font】
### 高级
#### 文件变动联动组件
##### 需求组件范围【linkageDemandPageModule】
##### 结果组件范围【linkageResultPageModule】
#### 自定义上传函数【customUploadFunction】
#### 自定义参数上传函数【customDataFunction】
#### 自定义禁用函数【customDisabledFunction】
#### 自定义请求头部函数【customHeadersFunction】
#### 移除自定义函数【customRemovedFunction】
#### 点击预览自定义函数【customPreviewFunction】
#### 文件预览自定义函数【customPreviewFileFunction】
#### 下载自定义函数【customDownloadFunction】
#### 拖拽文件不符合格式自定义函数【customRejectFunction】
#### 上传文件之前钩子自定义函数【customBeforeUploadFunction】