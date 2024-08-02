<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
    <!--
      组件内部容器
      增加class="drag_container" 必选
      idm-ctrl-id：组件的id，这个必须不能为空
      idm-container-index  组件的内部容器索引，不重复唯一且不变，必选
    -->
    <component :is="propData.isDragger?'a-upload-dragger':'a-upload'"
    :fileList="fileList"
    :accept="propData.accept"
    :disabled="customDisabledFunction()"
    :action="propData.action?IDM.url.getWebPath(propData.action):''"
    :name="propData.name"
    :headers="headersObject"
    :directory="propData.directory"
    :multiple="propData.multiple"
    :showUploadList="propData.showUploadList?{showPreviewIcon:propData.showPreviewIcon,showRemoveIcon:propData.showRemoveIcon}:false"
    :withCredentials="propData.withCredentials"
    :listType="propData.listType"
    :customRequest="propData.customUploadFunction&&propData.customUploadFunction.length>0?customUploadHandle:false"
    :beforeUpload="beforeUpload"
    :previewFile="previewFile"
    :data="customDataFunction"
    @change="handleChange"
    @preview="handlePreview"
    @download="handleDownload"
    @reject="handleReject"
  >
    <div class="drag_container" idm-ctrl-inner :idm-ctrl-id="moduleObject.id" idm-container-index="1">
          
    </div>
  </component>
  </div>
</template>

<script>
export default {
  name: 'IUpload',
  data(){
    return {
      moduleObject:{},
      fileList:[],
      propData:this.$root.propData.compositeAttr||{
        isDragger:true,
        action:"/ctrl/idm/api/upload",
        name:"file",
        accept:"",
        directory:false,
        multiple:true,
        showUploadList:true,
        showPreviewIcon:true,
        showRemoveIcon:true,
        withCredentials:true,
        listType:"text",
        customUploadFunction:[{}],
        disabled:false
      },
      headersObject:{}
    }
  },
  props: {
  },
  created() {
    this.moduleObject = this.$root.moduleObject;
    // console.log(this.moduleObject)
    this.initAttrToModule();
  },
  mounted() {
    //赋值给window提供跨页面调用
    this.$nextTick(function(params) {
      window[this.moduleObject.packageid] = this;
    });
  },
  destroyed() {},
  methods:{
    customDisabledFunction(){
      if(this.propData.customDisabledFunction&&this.propData.customDisabledFunction.length>0){
        let result = this.commonEventFunHandle("customDisabledFunction",{});
        return result===true
      }
      return this.propData.disabled;
    },
    async previewFile(file){
      let result = this.commonEventFunHandle("customPreviewFileFunction",{file:file});
      if(!result){
        await this.blobToBase64(file).then(res=>{
          result = res;
        })
      }
      return result;
    },
    blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          resolve(e.target.result);
        };
        // readAsDataURL
        fileReader.readAsDataURL(blob);
        fileReader.onerror = () => {
          reject(new Error('blobToBase64 error'));
        };
      });
    },
    customDataFunction(object){
      let result = this.commonEventFunHandle("customDataFunction",{file:object});
      return IDM.type(result)=="object"?result:{}
    },
    beforeUpload(file, fileList){
      if(this.propData.customBeforeUploadFunction&&this.propData.customBeforeUploadFunction.length>0){
        let result = this.commonEventFunHandle("customBeforeUploadFunction",{file, currentFileList:fileList});
        if(result!==false){
          return result;
        }
        return false;
      }
      return true;
    },
    handleReject(object){
      this.commonEventFunHandle("customRejectFunction",{file:object});
    },
    handleDownload(object){
      this.commonEventFunHandle("customDownloadFunction",{file:object});
    },
    handlePreview(object){
      this.commonEventFunHandle("customPreviewFunction",{file:object});
    },
    customUploadHandle(object){
      this.commonEventFunHandle("customUploadFunction",{file:object});
    },
    handleChange(object){
      this.fileList = object.fileList;
      if(object&&object.file&&object.file.response&&object.file.response.code!="200"){
        object.file.status="error";
        this.fileList.forEach(element => {
          if(element.uid==object.file.uid){
            element.status="error";
          }
        });
      }
      if(object.file&&object.file.status=="removed"){
        //调用移除的方法
        this.commonEventFunHandle("customRemovedFunction",{file:object});
      }

      if(this.propData.linkageDemandPageModule&&this.propData.linkageDemandPageModule.length>0){
        let moduleIdArray = [];
        this.propData.linkageDemandPageModule.forEach(item=>{moduleIdArray.push(item.moduleId)});
        this.sendBroadcastMessage({
          type:"linkageDemand",
          message:{
            fileList:this.fileList,
            object
          },
          rangeModule:moduleIdArray,
          // messageKey:this.propData.formFiledKey||this.propData.ctrlId
        })
      }
      if(this.propData.linkageResultPageModule&&this.propData.linkageResultPageModule.length>0){
        let moduleIdArray = [];
        this.propData.linkageResultPageModule.forEach(item=>{moduleIdArray.push(item.moduleId)});
        this.sendBroadcastMessage({
          type:"linkageResult",
          message:{
            fileList:this.fileList,
            object
          },
          rangeModule:moduleIdArray,
          // messageKey:this.propData.formFiledKey||this.propData.ctrlId
        })
      }
    },
    /**
     * 通用自定义函数
     * customFunction：可传单个函数对象或者数组或者属性名称
     * otherObject：其他参数对象
     */
    commonEventFunHandle(customFunction, otherObject) {
      let that = this;
      var customHandle = [];
      if(IDM.type(customFunction)=="string"){
        customHandle = that.propData[customFunction];
      }else if(IDM.type(customFunction)=="object"){
        customHandle = [customFunction];
      }else if(IDM.type(customFunction)=="array"){
        customHandle = customFunction;
      }else{
        return;
      }
      let result;
      customHandle &&
        customHandle.forEach(item => {
          result = window[item.name] &&
            window[item.name].call(this, {
              customParam: item.param,
              that: this,
              moduleObject:that.moduleObject,
              fileList:that.fileList,
              ...otherObject
            });
        });
      return result;
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData){
      this.propData = propData.compositeAttr||{};
      this.initAttrToModule();
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject(){
      var styleObject = {};
      if(this.propData.bgSize&&this.propData.bgSize=="custom"){
        styleObject["background-size"]=(this.propData.bgSizeWidth?this.propData.bgSizeWidth.inputVal+this.propData.bgSizeWidth.selectVal:"auto")+" "+(this.propData.bgSizeHeight?this.propData.bgSizeHeight.inputVal+this.propData.bgSizeHeight.selectVal:"auto")
      }else if(this.propData.bgSize){
        styleObject["background-size"]=this.propData.bgSize;
      }
      if(this.propData.positionX&&this.propData.positionX.inputVal){
        styleObject["background-position-x"]=this.propData.positionX.inputVal+this.propData.positionX.selectVal;
      }
      if(this.propData.positionY&&this.propData.positionY.inputVal){
        styleObject["background-position-y"]=this.propData.positionY.inputVal+this.propData.positionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if(!element&&element!==false&&element!=0){
            continue;
          }
          switch (key) {
            case "width":
            case "height":
              styleObject[key]=element;
              break;
            case "bgColor":
              if(element&&element.hex8){
                styleObject["background-color"]=element.hex8;
              }
              break;
            case "box":
              if(element.marginTopVal){
                styleObject["margin-top"]=`${element.marginTopVal}`;
              }
              if(element.marginRightVal){
                styleObject["margin-right"]=`${element.marginRightVal}`;
              }
              if(element.marginBottomVal){
                styleObject["margin-bottom"]=`${element.marginBottomVal}`;
              }
              if(element.marginLeftVal){
                styleObject["margin-left"]=`${element.marginLeftVal}`;
              }
              if(element.paddingTopVal){
                styleObject["padding-top"]=`${element.paddingTopVal}`;
              }
              if(element.paddingRightVal){
                styleObject["padding-right"]=`${element.paddingRightVal}`;
              }
              if(element.paddingBottomVal){
                styleObject["padding-bottom"]=`${element.paddingBottomVal}`;
              }
              if(element.paddingLeftVal){
                styleObject["padding-left"]=`${element.paddingLeftVal}`;
              }
              break;
            case "bgImgUrl":
              styleObject["background-image"]=`url(${window.IDM.url.getWebPath(element)})`;
              break;
            case "positionX":
              //背景横向偏移
              
              break;
            case "positionY":
              //背景纵向偏移
              
              break;
            case "bgRepeat":
              //平铺模式
                styleObject["background-repeat"]=element;
              break;
            case "bgAttachment":
              //背景模式
                styleObject["background-attachment"]=element;
              break;
            case "border":
              if(element.border.top.width>0){
                styleObject["border-top-width"]=element.border.top.width+element.border.top.widthUnit;
                styleObject["border-top-style"]=element.border.top.style;
                if(element.border.top.colors.hex8){
                  styleObject["border-top-color"]=element.border.top.colors.hex8;
                }
              }
              if(element.border.right.width>0){
                styleObject["border-right-width"]=element.border.right.width+element.border.right.widthUnit;
                styleObject["border-right-style"]=element.border.right.style;
                if(element.border.right.colors.hex8){
                  styleObject["border-right-color"]=element.border.right.colors.hex8;
                }
              }
              if(element.border.bottom.width>0){
                styleObject["border-bottom-width"]=element.border.bottom.width+element.border.bottom.widthUnit;
                styleObject["border-bottom-style"]=element.border.bottom.style;
                if(element.border.bottom.colors.hex8){
                  styleObject["border-bottom-color"]=element.border.bottom.colors.hex8;
                }
              }
              if(element.border.left.width>0){
                styleObject["border-left-width"]=element.border.left.width+element.border.left.widthUnit;
                styleObject["border-left-style"]=element.border.left.style;
                if(element.border.left.colors.hex8){
                  styleObject["border-left-color"]=element.border.left.colors.hex8;
                }
              }
              
              styleObject["border-top-left-radius"]=element.radius.leftTop.radius+element.radius.leftTop.radiusUnit;
              styleObject["border-top-right-radius"]=element.radius.rightTop.radius+element.radius.rightTop.radiusUnit;
              styleObject["border-bottom-left-radius"]=element.radius.leftBottom.radius+element.radius.leftBottom.radiusUnit;
              styleObject["border-bottom-right-radius"]=element.radius.rightBottom.radius+element.radius.rightBottom.radiusUnit;
              break;
            case "font":
              styleObject["font-family"]=element.fontFamily;
              if(element.fontColors.hex8){
                styleObject["color"]=element.fontColors.hex8;
              }
              styleObject["font-weight"]=element.fontWeight&&element.fontWeight.split(" ")[0];
              styleObject["font-style"]=element.fontStyle;
              styleObject["font-size"]=element.fontSize+element.fontSizeUnit;
              styleObject["line-height"]=element.fontLineHeight+(element.fontLineHeightUnit=="-"?"":element.fontLineHeightUnit);
              styleObject["text-align"]=element.fontTextAlign;
              styleObject["text-decoration"]=element.fontDecoration;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id,styleObject);
    },
    initAttrToModule(){
      this.convertAttrToStyleObject();
      if(this.propData.customHeadersFunction&&this.propData.customHeadersFunction.length>0){
        let result = this.commonEventFunHandle("customHeadersFunction",{});
        if(IDM.type(result)=="object"){
          this.headersObject = result;
        }
      }
      
    },
    /**
     * 组件通信：接收消息的方法
     * @param {
     *  type:"发送消息的时候定义的类型，这里可以自己用来要具体做什么，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
     * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）"
     *  message:{发送的时候传输的消息对象数据}
     *  messageKey:"消息数据的key值，代表数据类型是什么，常用于表单交互上，比如通过这个key判断是什么数据"
     *  isAcross:如果为true则代表发送来源是其他页面的组件，默认为false
     * } object 
     */
    receiveBroadcastMessage(object){
      console.log("组件收到消息",object)
    },
    /**
     * 组件通信：发送消息的方法
     * @param {
     *  type:"自己定义的，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
     * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）",
     *  message:{实际的消息对象},
     *  rangeModule:"为空发送给全部，根据配置的属性中设定的值（值的内容是组件的packageid数组），不取子表的，比如直接 this.$root.propData.compositeAttr["attrKey"]（注意attrKey是属性中定义的bindKey）,这里的格式为：['1','2']"",
     *  className:"指定的组件类型，比如只给待办组件发送，然后再去过滤上面的值"
     *  globalSend:如果为true则全站发送消息，注意全站rangeModule是无效的，只有className才有效，默认为false
     * } object 
     */
    sendBroadcastMessage(object){
        window.IDM.broadcast&&window.IDM.broadcast.send(object);
    },
    /**
     * 通用的url参数对象
     * 所有地址的url参数转换
     */
    commonParam(){
      let urlObject = IDM.url.queryObject();
      var params = {
        pageId:
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : "",
        urlData: JSON.stringify(urlObject),
      };
      return params;
    }
  }
}
</script>
<style lang="scss">

</style>