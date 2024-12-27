<template>
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
    v-show="propData.defaultStatus != 'hidden'"
  >
    <!--
      组件内部容器
      增加class="drag_container" 必选
      idm-ctrl-id：组件的id，这个必须不能为空
      idm-container-index  组件的内部容器索引，不重复唯一且不变，必选
    -->
    <div class="console-easy-tablelist-item">
      <a-config-provider :locale="locale">
        <a-table
          :columns="columns"
          :data-source="dataRows"
          :size="propData.size || 'middle'"
          :tableLayout="propData.tableLayout || ''"
          :showHeader="propData.showHeader === false ? false : true"
          :bordered="propData.showBordered"
          :customRow="customRow"
          :scroll="scrollOption"
          :rowSelection="rowSelection"
          :pagination="pagination"
          :locale="localeEmpty"
          :customHeaderRow="customHeaderRow"
          :rowClassName="rowClassNameHandle"
          :rowKey="propData.rowKey || ((r, i) => i.toString())"
          :loading="loading"
          @change="handleTableChange"
          :style="{
            '--cellFontSize': `${propData.font&&propData.font.fontSize || 14}${
                propData.font&&propData.font.fontSizeUnit || 'px'
            }`,
            '--bodyHeight': propData.scrollY,
          }"
        >
          <div
            v-for="(item, cindex) in rowCustomRenderList"
            :slot="item.scopedSlots.customRender"
            slot-scope="text, record, index"
            :key="cindex"
          >
            <a-input
              :size="propData.size"
              v-if="item.type == 'input'"
              style="margin: -5px 0"
              v-model="record[item.dataIndex]"
              @blur="saveDataHandle(record, item)"
            />
            <a-input-number
              :size="propData.size"
              v-else-if="item.type == 'inputNumber'"
              style="margin: -5px 0"
              v-model="record[item.dataIndex]"
              @change="saveDataHandle(record, item)"
            />
            <a-switch
              :size="propData.size"
              style="margin: -5px 0"
              v-else-if="item.type == 'switch'"
              v-model="record[item.dataIndex]"
              @change="saveDataHandle(record, item)"
            ></a-switch>
            <a-select
              :size="propData.size"
              @change="saveDataHandle(record, item)"
              :labelInValue="item.type == 'mSelect'"
              :mode="item.type == 'mSelect' ? 'multiple' : 'default'"
              v-else-if="item.type == 'select' || item.type == 'mSelect'"
              v-model="record[item.dataIndex]"
              style="margin: -5px 0; min-width: 100%"
            >
              <a-select-option
                v-for="oitem in item.dictionary"
                :key="oitem.key"
                :value="oitem.key"
              >
                {{ oitem.label }}
              </a-select-option>
            </a-select>
            <a-radio-group
              :size="propData.size"
              v-else-if="item.type == 'radio'"
              :name="item.dataIndex"
              v-model="record[item.dataIndex]"
              @change="saveDataHandle(record, item)"
            >
              <a-radio
                v-for="oitem in item.dictionary"
                :key="oitem.key"
                :value="oitem.key"
              >
                {{ oitem.label }}
              </a-radio>
            </a-radio-group>
            <template v-else>
              <div v-if="item.rowsCustomRenderReturnType == 'text'">
                {{ getRowsCustomRender(item, text, record, index) }}
              </div>
              <div
                v-else-if="item.rowsCustomRenderReturnType == 'html'"
                v-html="getRowsCustomRender(item, text, record, index)"
              ></div>
            </template>
          </div>
          <template v-for="(item, cindex) in columns">
            <!--------------自定义标题-------------->
            <!--返回text格式-->
            <div
              v-if="item.slots && item.customTitleReturnType == 'text'"
              :slot="item.slots.title"
              :key="cindex"
            >
              {{ item.customTitle }}
            </div>
            <!--返回html格式-->
            <div
              v-else-if="item.slots && item.customTitleReturnType == 'html'"
              :slot="item.slots.title"
              v-html="item.customTitle"
              :key="cindex+'h'"
            ></div>
          </template>
          <div
            v-if="
              propData.expandedRowRender &&
              propData.expandedRowRender.length > 0
            "
            :slot="`expandedRowRender${
              propData.expandedRowRender &&
              propData.expandedRowRender.length > 0
                ? ''
                : 'close'
            }`"
            slot-scope="record, index, indent, expanded"
          >
            <div
              v-if="
                propData.expandedRowRenderReturnType &&
                propData.expandedRowRenderReturnType == 'text'
              "
            >
              {{ getRowsExpandedCustomRender(record, index, indent, expanded) }}
            </div>
            <div
              v-else-if="
                propData.expandedRowRenderReturnType &&
                propData.expandedRowRenderReturnType == 'html'
              "
              v-html="
                getRowsExpandedCustomRender(record, index, indent, expanded)
              "
            ></div>
          </div>
        </a-table>
      </a-config-provider>
    </div>
  </div>
</template>

<script>
import locale from "ant-design-vue/lib/locale-provider/zh_CN";
export default {
  name: "IEasyTableList",
  data() {
    return {
      locale,
      dataRows: [],
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        defaultStatus: "default",
        openPagination: true,
        smallPagination: true,
        showSizeChanger: true,
        showTotalFormat: "@[range0]-@[range1] of @[total] items",
        scrollX: "100%",
      },
      pageSize: 10,
      current: 1,
      totalCount: 0,
      conditionObject: {},
      loading: false,
      rowCustomRenderList: [],
      selectedRowKeys: [],
      sorter: {},
    };
  },
  computed: {
    /**
     * 数据列配置
     */
    columns() {
      let that = this;
      let columnList = [];
      this.propData.columnsList &&
        this.propData.columnsList.forEach((item) => {
          let columnObj = {};
          columnObj.align = item.align || "left";
          columnObj.ellipsis = item.ellipsis || false;
          columnObj.dataIndex = item.dataIndex;
          columnObj.title = item.title;
          if (item.key) {
            columnObj.key = item.key;
          }
          if (item.fixed && (item.fixed == "left" || item.fixed == "right")) {
            columnObj.fixed = item.fixed;
          }
          if (item.width) {
            columnObj.width = item.width;
          }
          if (item.ellipsis && item.width) {
            columnObj.customCell = () => ({
              style: {
                maxWidth: item.width,
              },
            });
          }
          //标题自定义
          var titleCustomRender = item.titleCustomRender;
          titleCustomRender &&
            titleCustomRender.forEach((fitem) => {
              columnObj.customTitle =
                window[fitem.name] &&
                window[fitem.name].call(this, {
                  ...that.commonParam(),
                  customParam: fitem.param,
                  _this: this,
                });
              delete columnObj.title;
              columnObj.slots = {
                title:
                  "title_" +
                  (columnObj.key || columnObj.dataIndex || IDM.uuid()),
              };
            });
          columnObj.customTitleReturnType = item.titleCustomRenderReturnType;
          //行自定义渲染函数
          var rowsCustomRender = item.rowsCustomRender;
          rowsCustomRender &&
            rowsCustomRender.forEach((fitem) => {
              columnObj.rowsCustomRender = fitem;
              columnObj.rowsCustomRenderReturnType =
                item.rowsCustomRenderReturnType;
              columnObj.scopedSlots = {
                customRender:
                  "rows_" +
                  (columnObj.key || columnObj.dataIndex || IDM.uuid()),
              };
              that.rowCustomRenderList.push(columnObj);
            });
          if (item.type && item.type != "readonly" && item.type != "custom") {
            columnObj.scopedSlots = {
              customRender:
                "rows_" + (columnObj.key || columnObj.dataIndex || IDM.uuid()),
            };
            if (item.dictionaryFun && item.dictionaryFun.length > 0) {
              //调用自定义函数
              item.dictionary =
                window[item.dictionaryFun[0].name] &&
                window[item.dictionaryFun[0].name].call(this, {
                  customParam: item.dictionaryFun[0].param,
                  _this: that,
                });
            }
            item.scopedSlots = columnObj.scopedSlots;
            that.rowCustomRenderList.push(item);
          }

          // 列自定义添加配置
          var columnCustomFunction = item.columnCustomFunction?.[0];
          let customOptions = {};
          if (columnCustomFunction) {
            customOptions =
              window?.[columnCustomFunction?.name]?.call({
                ...(columnCustomFunction.param || {}),
              }) || {};
          }

          columnObj = Object.assign(customOptions, columnObj);
          console.log(customOptions, columnObj);
          columnList.push(columnObj);
        });
      return columnList;
    },
    /**
     * 选择器的配置
     */
    rowSelection() {
      let that = this;
      const { selectedRowKeys } = this;
      console.log(
        "🚀 ~ file: IEasyTableList.vue ~ line 227 ~ rowSelection ~ this",
        this
      );
      let rowSelectionConfig = {};
      if (!this.propData.rowSelection) {
        return null;
      }
      //自定义列表选择框宽度
      if (this.propData.rowSelectionColumnWidth) {
        rowSelectionConfig.columnWidth = this.propData.rowSelectionColumnWidth;
      }
      //自定义列表选择框标题
      if (this.propData.rowSelectionColumnTitle) {
        rowSelectionConfig.columnTitle = this.propData.rowSelectionColumnTitle;
      }
      //设置是否把选择框列固定在左边
      if (this.propData.rowSelectionFixed) {
        rowSelectionConfig.fixed = this.propData.rowSelectionFixed;
      }
      //设置是否去掉『全选』『反选』两个默认选项
      rowSelectionConfig.hideDefaultSelections =
        this.propData.hideDefaultSelections || false;
      //单选/多选
      rowSelectionConfig.type = this.propData.rowSelectionType || "checkbox";
      //选择框属性自定义函数
      var getCheckboxProps = this.propData.getCheckboxProps;
      getCheckboxProps &&
        getCheckboxProps.forEach((fitem) => {
          rowSelectionConfig.getCheckboxProps = function (record) {
            return (
              window[fitem.name] &&
              window[fitem.name].call(this, {
                ...that.commonParam(),
                customParam: fitem.param,
                _this: that,
                record,
              })
            );
          };
        });
      //选中项发生变化时的回调
      rowSelectionConfig.onChange = function (selectedRowKeys, selectedRows) {
        that.selectedRowKeys = selectedRowKeys;
        that.$forceUpdate();
        var rowSelectionOnChange = that.propData.rowSelectionOnChange;
        rowSelectionOnChange &&
          rowSelectionOnChange.forEach((fitem) => {
            window[fitem.name] &&
              window[fitem.name].call(this, {
                ...that.commonParam(),
                customParam: fitem.param,
                _this: that,
                selectedRowKeys,
                selectedRows,
              });
          });
        that.executeLinkageStart("dataListSelectionChange", selectedRows);
      };

      //手动选择/取消某列的自定义函数
      rowSelectionConfig.onSelect = function (
        record,
        selected,
        selectedRows,
        nativeEvent
      ) {
        var rowSelectionOnSelect = that.propData.rowSelectionOnSelect;
        rowSelectionOnSelect &&
          rowSelectionOnSelect.forEach((fitem) => {
            window[fitem.name] &&
              window[fitem.name].call(this, {
                ...that.commonParam(),
                customParam: fitem.param,
                _this: that,
                record,
                selected,
                selectedRows,
                nativeEvent,
              });
          });
      };

      //手动选择反选的自定义函数
      rowSelectionConfig.onSelectInvert = function (selectedRows) {
        var rowSelectionOnSelectInvert =
          that.propData.rowSelectionOnSelectInvert;
        rowSelectionOnSelectInvert &&
          rowSelectionOnSelectInvert.forEach((fitem) => {
            window[fitem.name] &&
              window[fitem.name].call(this, {
                ...that.commonParam(),
                customParam: fitem.param,
                _this: that,
                selectedRows,
              });
          });
      };
      rowSelectionConfig.selectedRowKeys = that.selectedRowKeys;

      return rowSelectionConfig;
    },
    /**
     * 分页器的配置
     */
    pagination() {
      let that = this;
      let paginationConfig = {};
      if (!this.propData.openPagination) {
        return false;
      }
      //分页位置
      paginationConfig.position = this.propData.paginationPosition || "bottom";
      //指定每页可以显示多少条，以逗号隔开
      paginationConfig.pageSizeOptions = this.propData.pageSizeOptions
        ? this.propData.pageSizeOptions.split(",")
        : ["10", "20", "30", "40"];
      //默认的每页条数，一般指定分页条数设置的其中一个即可
      paginationConfig.defaultPageSize = this.propData.defaultPageSize || 10;
      //设置只有一页时是否隐藏分页器
      paginationConfig.hideOnSinglePage =
        this.propData.hideOnSinglePage || false;
      //禁用分页
      paginationConfig.disabled = this.propData.disabledPagination || false;
      //设置是否可以快速跳转至某页
      paginationConfig.showQuickJumper = this.propData.showQuickJumper || false;
      //设置是否可以改变每页的大小
      paginationConfig.showSizeChanger = this.propData.showSizeChanger || false;
      //设置是否是小尺寸分页
      paginationConfig.size = this.propData.smallPagination || false;
      //设置是否显示为简单分页
      paginationConfig.simple = this.propData.simplePagination || false;
      if (this.propData.showTotalFormat) {
        //设置用于显示数据总量和当前数据顺序
        paginationConfig.showTotal = function (total, range) {
          return (
            IDM.express &&
            IDM.express.replace.call(this, that.propData.showTotalFormat, {
              total,
              range,
            })
          );
        };
      }
      //页码改变自定义函数
      // paginationConfig.change = function (page, pageSize) {
      //   that.initData();
      //   var pageIndexChangeFunction = that.propData.pageIndexChangeFunction;
      //   pageIndexChangeFunction &&
      //     pageIndexChangeFunction.forEach((item) => {
      //       window[item.name] &&
      //         window[item.name].call(this, {
      //           ...that.commonParam(),
      //           customParam: item.param,
      //           _this: that,
      //           page,
      //           pageSize,
      //         });
      //     });
      // };
      //每页数量改变自定义函数
      // paginationConfig.showSizeChange = function (current, size) {
      //   that.current = current;
      //   that.initData();
      //   var tableChangeFunction = that.propData.tableChangeFunction;
      //   tableChangeFunction &&
      //     tableChangeFunction.forEach((item) => {
      //       window[item.name] &&
      //         window[item.name].call(this, {
      //           ...that.commonParam(),
      //           customParam: item.param,
      //           _this: that,
      //           current,
      //           size,
      //         });
      //     });
      // };

      //分页的当前页索引
      paginationConfig.current = this.current;
      //分页的大小
      paginationConfig["pageSize(.sync)"] = this.pageSize;
      //分页的总数
      paginationConfig.total = this.totalCount;

      // console.log(
      //   "🚀 ~ file: IEasyTableList.vue ~ line 143 ~ pagination ~ paginationConfig",
      //   paginationConfig
      // );

      return paginationConfig;
    },
    /**
     * 为空文案设置
     */
    localeEmpty() {
      return { emptyText: this.propData.noDataTip || "暂无数据" };
    },
    scrollOption() {
      if (this.propData.scrollX && this.propData.scrollY) {
        return { x: this.propData.scrollX, y: this.propData.scrollY };
      }
      if (this.propData.scrollX) {
        return { x: this.propData.scrollX };
      }
      if (this.propData.scrollY) {
        return { y: this.propData.scrollY };
      }
      return {};
    },
  },
  props: {},
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.pageSize = this.propData.defaultPageSize || 10;
    // console.log(this.moduleObject)
    this.convertAttrToStyleObject();
    this.initData();
  },
  mounted() {
    //赋值给window提供跨页面调用
    this.$nextTick(function (params) {
      window[this.moduleObject.packageid] = this;
    });
  },
  updated() {},
  destroyed() {},
  methods: {
    /**
     * 保存数据
     * @param {*} record 整条数据
     * @param {*} dataItem 字段配置
     */
    saveDataHandle(record, dataItem) {
      if (!this.propData.saveFormUrl || !this.propData.saveFormKey) {
        return;
      }
      // __DATA=
      // {
      //     "maininfo":{
      //         "S-LIST_ITEM-0007":{
      //             "values":[
      //                 {
      //                     "key":"value",
      //                     "value":""
      //                 }
      //             ]
      //         },
      //         "S-LIST_ITEM-0031":{
      //             "values":[
      //                 {
      //                     "key":"value",
      //                     "value":""
      //                 },
      //                 {
      //                     "key":"text",
      //                     "value":""
      //                 }
      //             ]
      //         },
      //         "S-BASE-0001":{
      //             "values":[
      //                 {
      //                     "key":"value",
      //                     "value":"240109153910TfeEdkORe7UU28rutH4"
      //                 }
      //             ]
      //         }
      //     }
      // }
      let maininfo = {};
      maininfo[this.propData.saveFormKey] = {
        values: [
          {
            key: "value",
            value: record[this.propData.saveFormKey],
          },
        ],
      };
      let metaName = "";
      if (dataItem.dataIndex.endsWiths(".value")) {
        metaName = dataItem.dataIndex.substring(
          0,
          dataItem.dataIndex.length - 6
        );
      }
      let values = [],
        value = "";
      Object.keys(record || {}).forEach((key) => {
        if (key.startsWiths(metaName) && metaName != key) {
          let keyName = key.substring(metaName.length + 1);
          if (keyName == "value") {
            value = record[key];
          }
          values.push({
            key: keyName,
            value: record[key],
          });
        }
      });
      //修正text
      let text = "";
      if (dataItem?.dictionary?.length) {
        dataItem?.dictionary.forEach((item) => {
          if (item.key == value) {
            text = item.label;
          }
        });
      }
      text &&
        values.forEach((item) => {
          if (item.key == "text") {
            item.value = text;
          }
        });
      maininfo[metaName] = {
        values: values,
      };
      //提交后端
      IDM.http
        .post(this.propData.saveFormUrl, {
          __DATA: JSON.stringify({ maininfo }),
          saveFormKey: this.propData.saveFormKey,
        })
        .then((res) => {
          IDM.message.success("保存成功");
        })
        .catch((err) => {
          IDM.message.error("保存失败");
        });
    },
    /**
     * 获取扩展行的结果
     */
    getRowsExpandedCustomRender(record, index, indent, expanded) {
      return (
        window[this.propData.expandedRowRender[0].name] &&
        window[this.propData.expandedRowRender[0].name].call(this, {
          customParam: this.propData.expandedRowRender[0].param,
          record,
          index,
          indent,
          expanded,
        })
      );
    },
    /**
     * 获取rows自定义的数据
     */
    getRowsCustomRender(item, text, record, index) {
      return (
        window[item.rowsCustomRender.name] &&
        window[item.rowsCustomRender.name].call(this, {
          customParam: item.rowsCustomRender.param,
          text,
          record,
          index,
        })
      );
    },
    /**
     * 重新加载
     */
    reload(reloadFirstPage, conditionObject, messageKey) {
      if (reloadFirstPage) {
        //  this.pageSize =20;
        this.current = 1;
      }
      this.selectedRowKeys = [];
      if (messageKey) {
        this.conditionObject[messageKey] = conditionObject;
      }
      //请求数据源
      this.initData();
    },
    /**
     * 数据请求
     */
    initData() {
      //把已选择的清空
      this.selectedRowKeys = [];
      let that = this;
      that.loading = true;
      var params = that.commonParam();
      //接收其他组件联动参数
      if (
        this.propData.linkageParamList &&
        this.propData.linkageParamList.length > 0
      ) {
        this.propData.linkageParamList.forEach((lpitem) => {
          if (Object.keys(lpitem).length > 0) {
            if (lpitem.msgKey && this.conditionObject[lpitem.msgKey]) {
              if (lpitem.paramFun && lpitem.paramFun.length > 0) {
                //有函数
                try {
                  params[lpitem.paramKey || lpitem.msgKey] =
                    window[lpitem.paramFun[0].name] &&
                    window[lpitem.paramFun[0].name].call(this, {
                      ...params,
                      ...lpitem.paramFun[0].param,
                      moduleObject: this.moduleObject,
                      paramValue: this.conditionObject[lpitem.msgKey],
                    });
                } catch (error) {
                  params[lpitem.paramKey || lpitem.msgKey] =
                    typeof this.conditionObject[lpitem.msgKey] == "object"
                      ? JSON.stringify(this.conditionObject[lpitem.msgKey])
                      : this.conditionObject[lpitem.msgKey];
                }
              } else {
                params[lpitem.paramKey || lpitem.msgKey] =
                  typeof this.conditionObject[lpitem.msgKey] == "object"
                    ? JSON.stringify(this.conditionObject[lpitem.msgKey])
                    : this.conditionObject[lpitem.msgKey];
              }
            }
          }
        });
      }
      params[this.propData.pageIndex || "pageIndex"] = this.current;
      params[this.propData.pageSize || "pageSize"] = this.pageSize;
      params["sorter"] = this.sorter;
      switch (this.propData.dataSourceType) {
        case "customInterface":
          //请求接口时会调用这里设置的函数返回自定义的参数，返回格式为Object对象，例如：{param1:'',param2:''}
          let resParam = {};
          if (
            this.propData.requestParamFun &&
            this.propData.requestParamFun.length > 0
          ) {
            try {
              resParam =
                window[this.propData.requestParamFun[0].name] &&
                window[this.propData.requestParamFun[0].name].call(this, {
                  ...params,
                  ...this.propData.requestParamFun[0].param,
                  moduleObject: this.moduleObject,
                });
            } catch (error) {}
          }
          let newParam = { ...params, ...resParam };
          this.propData.customInterfaceUrl &&
            window.IDM.http[this.propData.requestType || "get"](
              this.propData.customInterfaceUrl,
              newParam,
              {
                headers: this.propData.requestContentType
                  ? {
                      "Content-Type":
                        this.propData.requestContentType ||
                        "application/json;charset=UTF-8",
                    }
                  : {},
              }
            )
              .then((res) => {
                //res.data
                let resultData = res && res.data;
                if (
                  that.propData.responseDataFun &&
                  that.propData.responseDataFun.length > 0
                ) {
                  try {
                    resultData =
                      window[that.propData.responseDataFun[0].name] &&
                      window[that.propData.responseDataFun[0].name].call(this, {
                        resultData: res.data,
                        ...params,
                        ...that.propData.responseDataFun[0].param,
                        moduleObject: that.moduleObject,
                        _this: that,
                      });
                  } catch (error) {}
                }
                that.resultChangeTableData(resultData);
              })
              .catch(function (error) {
                if (
                  that.propData.requestErrorFun &&
                  that.propData.requestErrorFun.length > 0
                ) {
                  try {
                    window[that.propData.requestErrorFun[0].name] &&
                      window[that.propData.requestErrorFun[0].name].call(this, {
                        error,
                        ...params,
                        ...that.propData.requestErrorFun[0].param,
                        moduleObject: that.moduleObject,
                        _this: that,
                      });
                  } catch (error) {}
                }
                that.loading = false;
                // that.listResultData = [];
              });

          if (this.moduleObject.env == "develop") {
            that.loading = false;
          }
          break;
        case "pageCommonInterface":
          //使用通用接口直接跳过，在setContextValue执行
          // that.loading = false;
          if (this.moduleObject.env == "develop") {
            that.loading = false;
          }
          break;
        case "customFunction":
          if (
            this.propData.customFunction &&
            this.propData.customFunction.length > 0
          ) {
            var resValue = {};
            try {
              resValue =
                window[this.propData.customFunction[0].name] &&
                window[this.propData.customFunction[0].name].call(this, {
                  ...params,
                  ...this.propData.customFunction[0].param,
                  moduleObject: this.moduleObject,
                });
            } catch (error) {}
            that.resultChangeTableData(resValue);
          }
          break;
        case "pageContainer":
          that.loading = false;
          break;
      }
    },
    /**
     * 设置行属性
     */
    customRow(record, index) {
      let that = this;
      return {
        props: {},
        on: {
          // 事件
          click: (event) => {
            that.customRowFunHandle(record, index, event, "customRowClick");
          }, // 点击行
          dblclick: (event) => {
            that.customRowFunHandle(record, index, event, "customRowDbClick");
          },
          contextmenu: (event) => {
            that.customRowFunHandle(
              record,
              index,
              event,
              "customRowContextMenu"
            );
          },
          mouseenter: (event) => {
            that.customRowFunHandle(
              record,
              index,
              event,
              "customRowMouseenter"
            );
          }, // 鼠标移入行
          mouseleave: (event) => {
            that.customRowFunHandle(
              record,
              index,
              event,
              "customRowMouseleave"
            );
          },
        },
      };
    },
    /**
     * 行属性的通用自定义函数
     */
    customRowFunHandle(record, index, event, name) {
      let that = this;
      var customRowHandle = that.propData[name];
      customRowHandle &&
        customRowHandle.forEach((item) => {
          window[item.name] &&
            window[item.name].call(this, {
              ...that.commonParam(),
              customParam: item.param,
              _this: that,
              event,
              record,
              index,
            });
        });
    },
    /**
     * 设置头部行属性
     */
    customHeaderRow(column, index) {
      let that = this;
      return {
        on: {
          click: () => {
            var customHeaderClick = that.propData.customHeaderClick;
            customHeaderClick &&
              customHeaderClick.forEach((item) => {
                window[item.name] &&
                  window[item.name].call(this, {
                    ...that.commonParam(),
                    customParam: item.param,
                    _this: that,
                    column,
                    index,
                  });
              });
          }, // 点击表头行
        },
      };
    },
    /**
     * 表格行的类名，返回string
     */
    rowClassNameHandle(record, index) {
      let that = this;
      if (
        that.propData.rowClassNameFunction &&
        that.propData.rowClassNameFunction.length > 0
      ) {
        return (
          window[that.propData.rowClassNameFunction[0].name] &&
          window[that.propData.rowClassNameFunction[0].name].call(this, {
            ...that.commonParam(),
            customParam: that.propData.rowClassNameFunction[0].param,
            _this: that,
            record,
            index,
          })
        );
      }
    },
    /**
     * 通用的url参数对象
     * 所有地址的url参数转换
     */
    commonParam() {
      let urlObject = IDM.url.queryObject();
      var params = {
        pageId:
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : "",
        urlData: JSON.stringify(urlObject),
      };
      return params;
    },
    /**
     * 数据改变事件
     */
    resultChangeTableData(listResultData) {
      this.loading = false;
      //设置数据源
      var rows =
        listResultData && listResultData.data ? listResultData.data.rows : [];
      if (rows.length == 0) {
        rows = listResultData && listResultData.rows;
      }
      this.dataRows = rows;
      var totalCount =
        listResultData && listResultData.data ? listResultData.data.total : -1;
      if (totalCount == -1) {
        totalCount = listResultData && listResultData.total;
      }
      if (totalCount && totalCount != -1) {
        this.totalCount = totalCount;
      }
    },
    /**
     * 分页、排序、筛选变化时触发
     */
    handleTableChange(pagination, filters, sorter, { currentDataSource }) {
      let that = this;
      this.pageSize = pagination.pageSize;
      this.current = pagination.current;
      this.totalCount = pagination.total;
      this.sorter = sorter;
      try {
        var tableChangeFunction = that.propData.tableChangeFunction;
        tableChangeFunction &&
          tableChangeFunction.forEach((item) => {
            window[item.name] &&
              window[item.name].call(this, {
                ...that.commonParam(),
                customParam: item.param,
                _this: that,
                pagination,
                filters,
                sorter,
              });
          });
      } catch (error) {}
      this.initData();
    },
    /**
     * 消息变动实时重新加载
     */
    onReInitDataMsgKey(conditionObject, messageKey) {
      this.conditionObject[messageKey] = conditionObject;
      this.reload(true);
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertAttrToStyleObject();
      console.log("组件内属性发生变化，变化后====》", this.propData);
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      this.rowCustomRenderList = [];

      var styleObject = {},
        tableTitleObj = {};
      if (this.propData.bgSize && this.propData.bgSize == "custom") {
        styleObject["background-size"] =
          (this.propData.bgSizeWidth
            ? this.propData.bgSizeWidth.inputVal +
              this.propData.bgSizeWidth.selectVal
            : "auto") +
          " " +
          (this.propData.bgSizeHeight
            ? this.propData.bgSizeHeight.inputVal +
              this.propData.bgSizeHeight.selectVal
            : "auto");
      } else if (this.propData.bgSize) {
        styleObject["background-size"] = this.propData.bgSize;
      }
      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject["background-position-x"] =
          this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject["background-position-y"] =
          this.propData.positionY.inputVal + this.propData.positionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case "width":
            case "height":
              styleObject[key] = element;
              break;
            case "bgColor":
              if (element && element.hex8) {
                styleObject["background-color"] = element.hex8;
              }
              break;
            case "box":
              if (element.marginTopVal) {
                styleObject["margin-top"] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                styleObject["margin-right"] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                styleObject["margin-bottom"] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                styleObject["margin-left"] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                styleObject["padding-top"] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                styleObject["padding-right"] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                styleObject["padding-bottom"] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                styleObject["padding-left"] = `${element.paddingLeftVal}`;
              }
              break;
            case "bgImgUrl":
              styleObject[
                "background-image"
              ] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case "positionX":
              //背景横向偏移

              break;
            case "positionY":
              //背景纵向偏移

              break;
            case "bgRepeat":
              //平铺模式
              styleObject["background-repeat"] = element;
              break;
            case "bgAttachment":
              //背景模式
              styleObject["background-attachment"] = element;
              break;
            case "border":
              if (element.border.top.width > 0) {
                styleObject["border-top-width"] =
                  element.border.top.width + element.border.top.widthUnit;
                styleObject["border-top-style"] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  styleObject["border-top-color"] =
                    element.border.top.colors.hex8;
                }
              }
              if (element.border.right.width > 0) {
                styleObject["border-right-width"] =
                  element.border.right.width + element.border.right.widthUnit;
                styleObject["border-right-style"] = element.border.right.style;
                if (element.border.right.colors.hex8) {
                  styleObject["border-right-color"] =
                    element.border.right.colors.hex8;
                }
              }
              if (element.border.bottom.width > 0) {
                styleObject["border-bottom-width"] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                styleObject["border-bottom-style"] =
                  element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  styleObject["border-bottom-color"] =
                    element.border.bottom.colors.hex8;
                }
              }
              if (element.border.left.width > 0) {
                styleObject["border-left-width"] =
                  element.border.left.width + element.border.left.widthUnit;
                styleObject["border-left-style"] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  styleObject["border-left-color"] =
                    element.border.left.colors.hex8;
                }
              }

              styleObject["border-top-left-radius"] =
                element.radius.leftTop.radius +
                element.radius.leftTop.radiusUnit;
              styleObject["border-top-right-radius"] =
                element.radius.rightTop.radius +
                element.radius.rightTop.radiusUnit;
              styleObject["border-bottom-left-radius"] =
                element.radius.leftBottom.radius +
                element.radius.leftBottom.radiusUnit;
              styleObject["border-bottom-right-radius"] =
                element.radius.rightBottom.radius +
                element.radius.rightBottom.radiusUnit;
              break;
            case "font":
              styleObject["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                styleObject["color"] = element.fontColors.hex8;
              }
              styleObject["font-weight"] =
                element.fontWeight && element.fontWeight.split(" ")[0];
              styleObject["font-style"] = element.fontStyle;
              styleObject["font-size"] =
                element.fontSize + element.fontSizeUnit;
              styleObject["line-height"] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == "-"
                  ? ""
                  : element.fontLineHeightUnit);
              styleObject["text-align"] = element.fontTextAlign;
              styleObject["text-decoration"] = element.fontDecoration;
              break;
            case "tableTitleFont":
              IDM.style.setFontStyle(tableTitleObj, element);
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .ant-table-thead>tr>th .ant-table-column-title",
        tableTitleObj
      );
    },
    showThisModuleHandle() {
      this.propData.defaultStatus = "default";
    },
    hideThisModuleHandle() {
      this.propData.defaultStatus = "hidden";
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
    receiveBroadcastMessage(object) {
      if (this.propData.linkageEnd?.length) {
        this.propData.linkageEnd.forEach((linkageObject) => {
          const currentItemType =
            linkageObject.reslinkageType == "custom"
              ? linkageObject.reslinkageTypeCustom
              : linkageObject.reslinkageType;
          if (currentItemType != object.type) {
            return;
          }
          //再次处理过滤条件
          if (
            linkageObject.resResultRule &&
            !IDM.getExpressData(linkageObject.resResultRule, object)
          ) {
            return;
          }
          switch (linkageObject.resType) {
            //重新加载刷新数据
            case "linkageReload":
              this.reload(true, object.message, object.messageKey);
              break;
            //重新加载数据来源
            case "linkageDemand":
              this.resultChangeTableData(object.message);
              break;
            case "linkageShowModule":
              this.showThisModuleHandle();
              break;
            case "linkageHideModule":
              this.hideThisModuleHandle();
              break;
            case "customFun":
              linkageObject.resFunction?.length &&
                IDM.invokeCustomFunctions.apply(this, [
                  linkageObject.resFunction,
                  {
                    moduleObject: this.moduleObject,
                    messageObject: object,
                  },
                ]);
              break;
          }
        });
        return;
      }
      if (object.type && object.type == "linkageDemand") {
        if (object.messageKey) {
          this.onReInitDataMsgKey(object.message, object.messageKey);
        }
        console.log(object?.message, "<------------------------");
        if (object?.message?.data) {
          this.resultChangeTableData(object.message);
        }
      } else if (object.type && object.type == "linkageReload") {
        this.reload(object.message && object.message.reloadFirstPage);
      }
      if (object && object.type == "linkageShowModule") {
        this.showThisModuleHandle();
      } else if (object && object.type == "linkageHideModule") {
        this.hideThisModuleHandle();
      }
    },
    /**
     * 执行发送联动消息
     * @param {*} actionType 触发的动作类型
     * @param {*} sendData 发送的数据
     */
    executeLinkageStart(actionType, sendData) {
      const linkageList = this.propData.linkageStart || [];
      if (!linkageList.length) {
        return;
      }
      let linkageFilterList = linkageList.filter(
        (item) => item.actionType?.indexOf(actionType) > -1
      );
      linkageFilterList.length &&
        linkageFilterList.forEach((linkageObject) => {
          if (!linkageObject.type) {
            return;
          }
          let moduleIdArray = linkageObject.module
            ? linkageObject.module.map((item) => item.moduleId)
            : [];
          this.sendBroadcastMessage({
            type:
              linkageObject.type == "custom"
                ? linkageObject.customType
                : linkageObject.type,
            message: sendData,
            rangeModule: moduleIdArray,
            messageKey: this.propData.ctrlId,
          });
        });
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
    sendBroadcastMessage(object) {
      window.IDM.broadcast && window.IDM.broadcast.send(object);
    },
    /**
     * 交互功能：设置组件的上下文内容值
     * @param {
     *  type:"定义的类型，已知类型：pageCommonInterface（页面统一接口返回值）、"
     *  key:"数据key标识，页面每个接口设置的数据集名称，方便识别获取自己需要的数据"
     *  data:"数据集，内容为：字符串 or 数组 or 对象"
     * }
     */
    setContextValue(object) {
      console.log("统一接口设置的值", object);
      if (object.type != "pageCommonInterface") {
        return;
      }
      //这里使用的是子表，所以要循环匹配所有子表的属性然后再去设置修改默认值
      if (object.key == this.propData.dataName) {
        //给defaultValue设置dataFiled的值
        var filedExp = this.propData.dataFiled;
        filedExp =
          this.propData.dataName +
          (filedExp.startsWiths("[") ? "" : ".") +
          filedExp;
        var dataObject = { IDM: window.IDM };
        dataObject[this.propData.dataName] = object.data;
        var _defaultVal = window.IDM.express.replace.call(
          this,
          "@[" + filedExp + "]",
          dataObject
        );
        this.resultChangeTableData(_defaultVal);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.console-easy-tablelist-item {
  :deep(.ant-table) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      font-size: var(--cellFontSize);
    }
  }
}
</style>
