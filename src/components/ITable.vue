<template>
    <div
        idm-ctrl="idm_module"
        :id="moduleObject.id"
        :idm-ctrl-id="moduleObject.id"
    >
        <a-config-provider :locale="locale">
            <div class="table-container" :class="className.wrap">
                <a-form-model
                    :model="filter"
                    layout="inline"
                    class="filter-form"
                    v-if="fields.length > 0 || propData.searchExendBar"
                >
                    <a-form-model-item
                        v-for="field in fields"
                        :key="field._filterKey"
                        :label="field.label"
                        :prop="field.filterKey"
                    >
                        <a-select
                            v-if="field.type == 'select'"
                            v-model="filter[field._filterKey]"
                            :mode="field.selectMode"
                            :allowClear="field.allowClear"
                            :placeholder="`请选择${field.label}`"
                            notFoundContent="暂无数据"
                            style="min-width: 100px"
                        >
                            <a-select-option
                                v-for="item in optionData[field.value]"
                                :key="item.key"
                                :value="item.key"
                                >{{ item.value }}</a-select-option
                            >
                        </a-select>
                        <a-cascader
                            v-else-if="field.type == 'cascader'"
                            v-model="filter[field._filterKey]"
                            :options="optionData[field.value]"
                            :allowClear="field.allowClear"
                            :placeholder="`请选择${field.label}`"
                            notFoundContent="暂无数据"
                            style="min-width: 100px"
                        >
                        </a-cascader>
                        <template v-else-if="field.type == 'date'">
                            <a-date-picker
                                valueFormat="YYYY-MM-DD"
                                v-model="filter[`${field._filterKey}Start`]"
                                :allowClear="field.allowClear || false"
                                :disabledDate="
                                    v =>
                                        disabledDate(
                                            v,
                                            filter[`${field._filterKey}End`],
                                            'after'
                                        )
                                "
                            />
                            ~
                            <a-date-picker
                                valueFormat="YYYY-MM-DD"
                                v-model="filter[`${field._filterKey}End`]"
                                :allowClear="field.allowClear || false"
                                :disabledDate="
                                    v =>
                                        disabledDate(
                                            v,
                                            filter[`${field._filterKey}Start`],
                                            'before'
                                        )
                                "
                            />
                        </template>
                        <template v-else-if="field.type == 'dateRange'">
                            <a-range-picker
                                :value="getDates(field._filterKey)"
                                @change="
                                    dates => setDates(field._filterKey, dates)
                                "
                                :allowClear="field.allowClear || false"
                                valueFormat="YYYY-MM-DD"
                            >
                            </a-range-picker>
                        </template>
                        <a-input
                            v-else
                            v-model="filter[field._filterKey]"
                            :allowClear="field.allowClear"
                        />
                    </a-form-model-item>
                    <a-form-model-item v-if="propData.searchExendBar">
                        <div
                            class="filter-extra drag_container"
                            idm-ctrl-inner
                            :idm-ctrl-id="moduleObject.id"
                            idm-container-index="filter-extra"
                        ></div>
                    </a-form-model-item>
                </a-form-model>
                <a-table
                    :dataSource="dataSource"
                    :pagination="paginationConfig"
                    :rowKey="propData.rowKey"
                    :loading="loading"
                    :bordered="propData.bordered"
                    :expandedRowKeys.sync="expandedRowKeys"
                    @change="handleTableChange"
                    @expand="handleExpand"
                    :defaultExpandAllRows="env_develop_mode"
                    :expandRowByClick="!env_develop_mode"
                    :expandIconAsCell="false"
                    :expandIconColumnIndex="propData.expandIconColumnIndex || 1"
                    :rowSelection="selectionConfig"
                    :indentSize="0"
                    :scroll="{ y: propData.tableMaxHeight, x: '100%' }"
                    :rowClassName="
                        (_, index) => (index % 2 == 0 ? 'odd' : 'even')
                    "
                    :columns="columns"
                    :class="className.table"
                    :style="{
                        '--bodyHeight': propData.tableMaxHeight,
                    }"
                >
                    <template #expandIcon="{ record, expanded, expandable }">
                        <svg-icon
                            v-if="expandable && record.expandable"
                            style="
                                font-size: 18px;
                                color: #134fed;
                                cursor: pointer;
                            "
                            icon-class="move"
                        ></svg-icon>
                    </template>
                    <template
                        #expandedRowRender="record"
                        v-if="propData.expandedRow"
                    >
                        <div
                            class="drag_container"
                            idm-ctrl-inner
                            :idm-ctrl-id="moduleObject.id"
                            :idm-container-index="`expand-${
                                record[propData.rowKey]
                            }`"
                        >
                            <slot
                                :name="`${moduleObject.id}expand-${
                                    record[propData.rowKey]
                                }`"
                            ></slot>
                        </div>
                    </template>
                </a-table>
            </div>
        </a-config-provider>
    </div>
</template>

<script>
import { commonParam, dataUtil, propToStyle, availableArray } from '../utils'
import { bindProp, bindStyle } from '../mixins'
import { nextTick } from 'vue'
import zh_CN from 'ant-design-vue/lib/locale/zh_CN'
import moreIcon from '../assets/more.png'
export default {
    mixins: [
        bindProp({
            dataSourceType: 'customInterface',
            columnSourceType: '',
            columns: [],
            rowKey: 'id',
            expandedRow: true,
        }),
        bindStyle({
            wrap() {
                return this.propData
            },
            table() {
                return {
                    width: this.propData.tableWidth,
                    height: this.propData.tableHeight,
                    ulbox: this.propData.tableUlbox,
                    bgColor: this.propData.tableBgColor,
                    boxShadow: this.propData.tableBoxShadow,
                    boxborder: this.propData.tableBoxborder,
                }
            },
        }),
    ],
    data() {
        return {
            locale: zh_CN,
            columnsDataSource: [
                {
                    label: '序号',
                    type: 'index',
                },
                {
                    label: 'ID',
                    value: 'id',
                },
                {
                    label: '标题',
                    value: 'title',
                    filter: true,
                },
            ],
            dataSource: window.IDM.env_develop_mode
                ? [
                      {
                          id: '1',
                          title: '标题',
                          expandable: true,
                      },
                  ]
                : [],
            totalCount: 0,
            filter: {},
            sort: null,
            loading: false,
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
            },
            conditionObject: {},
            optionData: {},
            env_develop_mode: window.IDM.env_develop_mode,
            contextDataset: [],
            expandedRowKeys: [],
            selectedRowKeys: [],
        }
    },
    computed: {
        columns() {
            return this.comboColumns(this.columnsDataSource)
        },
        fields() {
            return this.comboFilters(this.columnsDataSource).map(column => ({
                ...column,
                _filterKey: this.expressReplace(
                    column.filterField || '@[value]',
                    {
                        value: column.value,
                        column,
                    }
                ),
            }))
        },
        paginationConfig() {
            let paginationConfig = {}
            if (!this.propData.openPagination) {
                return false
            }
            //分页位置
            paginationConfig.position =
                this.propData.paginationPosition || 'bottom'
            //指定每页可以显示多少条，以逗号隔开
            paginationConfig.pageSizeOptions = this.propData.pageSizeOptions
                ? this.propData.pageSizeOptions.split(',')
                : ['10', '20', '30', '40']
            //默认的每页条数，一般指定分页条数设置的其中一个即可
            paginationConfig.defaultPageSize =
                this.propData.defaultPageSize || 10
            //设置只有一页时是否隐藏分页器
            paginationConfig.hideOnSinglePage =
                this.propData.hideOnSinglePage || false
            //禁用分页
            paginationConfig.disabled =
                this.propData.disabledPagination || false
            //设置是否可以快速跳转至某页
            paginationConfig.showQuickJumper =
                this.propData.showQuickJumper || false
            //设置是否可以改变每页的大小
            paginationConfig.showSizeChanger =
                this.propData.showSizeChanger || false
            //设置是否是小尺寸分页
            paginationConfig.size = this.propData.smallPagination || false
            //设置是否显示为简单分页
            paginationConfig.simple = this.propData.simplePagination || false
            if (this.propData.showTotalFormat) {
                //设置用于显示数据总量和当前数据顺序
                paginationConfig.showTotal = function (total, range) {
                    return (
                        IDM.express &&
                        IDM.express.replace.call(
                            this,
                            this.propData.showTotalFormat,
                            {
                                total,
                                range,
                            }
                        )
                    )
                }
            }
            //分页的当前页索引
            paginationConfig.current = this.pagination.current
            //分页的大小
            paginationConfig['pageSize(.sync)'] = this.pagination.pageSize
            //分页的总数
            paginationConfig.total = this.pagination.total

            return paginationConfig
        },
        selectionConfig() {
            if (this.propData.selection == true) {
                return {
                    selectedRowKeys: this.selectedRowKeys,
                    onChange: v => (this.selectedRowKeys = v),
                }
            }
            return null
        },
    },
    mounted() {
        this.loadColumnsOptions()
            .then(() => this.loadOptionData())
            .then(() => this.initData())
    },
    watch: {
        'propData.customParams': {
            handler(customParams) {
                this.filter = window.IDM.invokeCustomFunctions
                    .call(this, customParams)
                    .reduce((carry, current) => {
                        return Object.assign({}, carry, current)
                    }, {})
            },
            immediate: true,
        },
        filter: {
            handler(filter) {
                this.propData.linkageStart
                    ?.filter(n => n.actionType == 'filterChange')
                    .forEach(n => {
                        window.IDM.broadcast?.send({
                            type: n.type == 'custom' ? n.customType : n.type,
                            messageKey: this.propData.ctrlId,
                            rangeModule: n.module?.map(item => item.moduleId),
                            message: filter,
                        })
                    })
            },
            deep: true,
        },
        selectedRowKeys: {
            handler(selectedRowKeys) {
                this.propData.linkageStart
                    ?.filter(n => n.actionType == 'selectChange')
                    .forEach(n => {
                        window.IDM.broadcast?.send({
                            type: n.type == 'custom' ? n.customType : n.type,
                            messageKey: this.propData.ctrlId,
                            rangeModule: n.module?.map(item => item.moduleId),
                            message: selectedRowKeys,
                        })
                    })
            },
        },
    },
    methods: {
        urlGetWebPath: window.IDM.url.getWebPath,
        expressReplace: window.IDM.express.replace,
        comboColumns(columns = [], keyPrefix = 'col') {
            if (columns.length == 0) return null
            return columns
                .filter(n => n.hidden != true)
                .map((column, columnIndex) => {
                    const key = `${keyPrefix}-${columnIndex}`
                    return {
                        ...column,
                        key,
                        title: column.label || column.title,
                        dataIndex: column.value || column.dataIndex,
                        align: column.headerAlign || 'center',
                        customCell: (record, rowIndex) =>
                            this.handleCustomCell(record, rowIndex, column),
                        customHeaderCell: e =>
                            this.handleCustomHeaderCell(e, column),
                        customRender: (value, record, index) =>
                            this.customRender({
                                value,
                                record,
                                index,
                                column,
                                columnIndex,
                            }),
                        children: this.comboColumns(column.children || [], key),
                    }
                })
        },
        comboFilters(columns = []) {
            return _.flatMap(columns, n =>
                n.children ? this.comboFilters(n.children) : n
            ).filter(n => n.filter)
        },
        customRender({ value, record, index, column, columnIndex }) {
            switch (column.type) {
                case 'index':
                    return index + 1
                case 'text':
                    return this.expressReplace(
                        column.textTemplate || '@[value]',
                        {
                            value,
                            record,
                            column,
                            columnIndex,
                        }
                    )
                case 'select':
                    return this.optionData[column.value]?.find(
                        n => n.key == value
                    )?.value
                case 'href':
                    return (
                        <span
                            class='href'
                            onClick={() => {
                                const link = this.getLink(value, record, column)
                                link && window.open(link, column.target)
                            }}
                        >
                            {value}
                        </span>
                    )
                case 'actions':
                    const actions = this.getActions(value, record, column)
                    if (column.dropdown && actions.length > 0) {
                        return (
                            <a-dropdown>
                                <a-menu
                                    slot='overlay'
                                    selectable={false}
                                    style={{
                                        textAlign: 'center',
                                    }}
                                    onClick={props => {
                                        this.handleMenuClick(
                                            props.key,
                                            value,
                                            record,
                                            column
                                        )
                                    }}
                                >
                                    {actions.map(action => (
                                        <a-menu-item key={action.value}>
                                            {action.label}
                                        </a-menu-item>
                                    ))}
                                </a-menu>
                                <img
                                    src={moreIcon}
                                    onClick={e => e.stopPropagation()}
                                />
                            </a-dropdown>
                        )
                    }
                    return (
                        <a-space>
                            {actions.map(action => (
                                <a-button
                                    onClick={e => e.stopPropagation()}
                                    key={action.value}
                                >
                                    {action.label}
                                </a-button>
                            ))}
                        </a-space>
                    )
                case 'htmlFunction':
                    return (
                        <span
                            domPropsInnerHTML={this.handleHtmlRender(
                                value,
                                record,
                                column,
                                columnIndex
                            )}
                        ></span>
                    )
                default:
                    return value
            }
        },
        setContextValue(object) {
            console.debug('iTable setContextValue', object)
            this.contextDataset.splice(0, 0, object)
            this.loadColumnsOptions()
                .then(() => this.loadOptionData())
                .then(() => this.initData())
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr
        },
        receiveBroadcastMessage(data) {
            console.debug('iTable receiveBroadcastMessage', data)
            switch (data.type) {
                case 'linkageDemand':
                    switch (data.messageKey) {
                        case 'filter':
                            _.entries(data.message).forEach(([key, value]) => {
                                this.$set(this.filter, key, value)
                            })
                            break
                        case 'reset':
                            this.filter = {}
                            break
                    }
                    break
            }
            if (this.propData.linkageEnd?.length) {
                this.propData.linkageEnd.forEach(linkageObject => {
                    const currentItemType =
                        linkageObject.reslinkageType == 'custom'
                            ? linkageObject.reslinkageTypeCustom
                            : linkageObject.reslinkageType
                    if (currentItemType != data.type) {
                        return
                    }
                    //再次处理过滤条件
                    if (
                        linkageObject.resResultRule &&
                        !IDM.getExpressData(linkageObject.resResultRule, data)
                    ) {
                        return
                    }
                    switch (linkageObject.resType) {
                        //重新加载刷新数据
                        case 'linkageReload':
                            this.reload(true, data.message, data.messageKey)
                            break
                        //重新加载数据来源
                        case 'linkageDemand':
                            this.resultChangeTableData(data.message)
                            break
                        case 'linkageShowModule':
                            this.showThisModuleHandle()
                            break
                        case 'linkageHideModule':
                            this.hideThisModuleHandle()
                            break
                        case 'linkageReloadConfig':
                            this.loadColumnsOptions()
                            break
                        case 'customFun':
                            linkageObject.resFunction?.length &&
                                IDM.invokeCustomFunctions.call(
                                    this,
                                    linkageObject.resFunction,
                                    {
                                        moduleObject: this.moduleObject,
                                        messageObject: data,
                                    }
                                )
                            break
                    }
                })
                return
            }
            if (data.type && data.type == 'linkageDemand') {
                if (data.messageKey) {
                    this.onReInitDataMsgKey(data.message, data.messageKey)
                }
                if (data?.message?.data) {
                    this.resultChangeTableData(data.message)
                }
            } else if (data.type && data.type == 'linkageReload') {
                this.reload(data.message && data.message.reloadFirstPage)
            }
        },
        /**
         * 消息变动实时重新加载
         */
        onReInitDataMsgKey(conditionObject, messageKey) {
            this.conditionObject[messageKey] = conditionObject
            this.reload(true)
        },
        /**
         * 重新加载
         */
        reload(reloadFirstPage, conditionObject, messageKey) {
            if (reloadFirstPage) {
                this.pagination.current = 1
            }
            this.selectedRowKeys = []
            if (messageKey) {
                this.conditionObject[messageKey] = conditionObject
            }
            //请求数据源
            this.initData()
        },
        initData() {
            if (
                window.IDM.env_develop_mode ||
                process.env.NODE_ENV != 'production'
            ) {
                return
            }
            this.expandedRowKeys = []
            //把已选择的清空
            this.selectedRowKeys = []
            let params = {
                ...commonParam(),
                ...this.filter,
            }
            //接收其他组件联动参数
            if (
                this.propData.linkageParamList &&
                this.propData.linkageParamList.length > 0
            ) {
                this.propData.linkageParamList.forEach(lpitem => {
                    if (Object.keys(lpitem).length > 0) {
                        if (
                            lpitem.msgKey &&
                            this.conditionObject[lpitem.msgKey]
                        ) {
                            if (lpitem.paramFun && lpitem.paramFun.length > 0) {
                                //有函数
                                try {
                                    params[lpitem.paramKey || lpitem.msgKey] =
                                        window[lpitem.paramFun[0].name] &&
                                        window[lpitem.paramFun[0].name].call(
                                            this,
                                            {
                                                ...params,
                                                ...lpitem.paramFun[0].param,
                                                moduleObject: this.moduleObject,
                                                paramValue:
                                                    this.conditionObject[
                                                        lpitem.msgKey
                                                    ],
                                            }
                                        )
                                } catch (error) {
                                    params[lpitem.paramKey || lpitem.msgKey] =
                                        typeof this.conditionObject[
                                            lpitem.msgKey
                                        ] == 'object'
                                            ? JSON.stringify(
                                                  this.conditionObject[
                                                      lpitem.msgKey
                                                  ]
                                              )
                                            : this.conditionObject[
                                                  lpitem.msgKey
                                              ]
                                }
                            } else {
                                params[lpitem.paramKey || lpitem.msgKey] =
                                    typeof this.conditionObject[
                                        lpitem.msgKey
                                    ] == 'object'
                                        ? JSON.stringify(
                                              this.conditionObject[
                                                  lpitem.msgKey
                                              ]
                                          )
                                        : this.conditionObject[lpitem.msgKey]
                            }
                        }
                    }
                })
            }
            params[this.propData.pageIndex || 'pageIndex'] =
                this.pagination.current
            params[this.propData.pageSize || 'pageSize'] =
                this.pagination.pageSize
            if (this.sort) {
                params[this.propData.orderType || 'orderType'] =
                    this.sort.orderType
                params[this.propData.reversed || 'reversed'] =
                    this.sort.reversed
            }
            this.loading = true
            dataUtil
                .fetchData(
                    {
                        dataSourceType: this.propData.dataSourceType,
                        dataSource: this.propData.dataSource,
                        customInterface: {
                            url: this.propData.customInterfaceUrl,
                            requestParamFun: this.propData.requestParamFun,
                            requestContentType:
                                this.propData.requestContentType,
                            requestType: this.propData.requestType,
                            responseDataFun: this.propData.responseDataFun,
                            requestErrorFun: this.propData.requestErrorFun,
                        },
                        pageCommonInterface: {
                            dataset: this.contextDataset,
                            dataName: this.propData.dataName,
                            dataFiled: this.propData.dataFiled,
                            dataFunc: this.propData.dataFunc,
                        },
                        customFunction: this.propData.customFunction,
                    },
                    {
                        params,
                    }
                )
                .then(data => {
                    this.resultChangeTableData(data)
                })
                .finally(() => {
                    this.loading = false
                })
        },
        loadColumnsOptions() {
            return dataUtil
                .fetchData(
                    {
                        dataSourceType: this.propData.columnSourceType,
                        dataSource: this.propData.columnDataSource,
                        customInterface: {
                            url: this.propData.columnCustomInterfaceUrl,
                            requestParamFun:
                                this.propData.columnRequestParamFun,
                            requestContentType:
                                this.propData.columnRequestContentType,
                            requestType: this.propData.columnRequestType,
                            responseDataFun:
                                this.propData.columnResponseDataFun,
                            requestErrorFun:
                                this.propData.columnRequestErrorFun,
                        },
                        pageCommonInterface: {
                            dataset: this.contextDataset,
                            dataName: this.propData.columnDataName,
                            dataFiled: this.propData.columnDataFiled,
                            dataFunc: this.propData.columnDataFunc,
                        },
                        customFunction: this.propData.columnCustomFunction,
                        staticData: this.propData.columns,
                    },
                    {
                        params: window.IDM.invokeCustomFunctions
                            .call(this, this.propData.columnCustomParams)
                            .reduce((carry, current) => {
                                return Object.assign({}, carry, current)
                            }, {}),
                    }
                )
                .then(data => {
                    this.columnsDataSource = data
                    return data
                })
        },
        loadOptionData() {
            this.columnsDataSource.forEach(column => {
                const filterKey = this.expressReplace(
                    column.filterField || '@[value]',
                    {
                        value: column.value,
                        column,
                    }
                )
                if (column.type == 'select') {
                    dataUtil
                        .fetchData({
                            dataSourceType: column.dataSourceType,
                            dataSource: column.dataSource,
                            customInterface: {
                                url: column.customInterfaceUrl,
                                requestParamFun: column.requestParamFun,
                                requestContentType: column.requestContentType,
                                requestType: column.requestType,
                                responseDataFun: column.responseDataFun,
                                requestErrorFun: column.requestErrorFun,
                            },
                            customFunction: column.customFunction,
                            staticData: column.staticData,
                        })
                        .then(data => {
                            this.$set(this.optionData, column.value, data)
                            if (column.selectMode == 'multiple') {
                                const selectedItems = data.filter(
                                    m => m.selected
                                )
                                if (selectedItems.length > 0) {
                                    this.$set(
                                        this.filter,
                                        filterKey,
                                        selectedItems.map(m => m.key)
                                    )
                                }
                                return
                            } else {
                                const selectedItem = data.find(m => m.selected)
                                if (selectedItem) {
                                    this.$set(
                                        this.filter,
                                        filterKey,
                                        selectedItem.key
                                    )
                                }
                                return
                            }
                        })
                }
                if (column.type == 'cascader') {
                    dataUtil
                        .fetchData({
                            dataSourceType: column.dataSourceType,
                            dataSource: column.dataSource,
                            customInterface: {
                                url: column.customInterfaceUrl,
                                requestParamFun: column.requestParamFun,
                                requestContentType: column.requestContentType,
                                requestType: column.requestType,
                                responseDataFun: column.responseDataFun,
                                requestErrorFun: column.requestErrorFun,
                            },
                            customFunction: column.customFunction,
                            staticData: column.staticData,
                        })
                        .then(data => {
                            this.$set(this.optionData, column.value, data)
                            const selectedItem = data.find(m => m.selected)
                            if (selectedItem) {
                                this.$set(
                                    this.filter,
                                    filterKey,
                                    selectedItem.key
                                )
                            }
                        })
                }
            })
        },
        handleTableChange(pagination, filters, sorter) {
            this.pagination.current = pagination.current
            this.pagination.pageSize = pagination.pageSize
            this.sort = sorter.order
                ? {
                      orderType: sorter.column.sortField || sorter.field,
                      reversed: sorter.order == 'descend',
                  }
                : null
            this.initData()
        },
        /**
         * 数据改变事件
         */
        resultChangeTableData(result) {
            this.dataSource = result.rows || result.data?.rows || []
            this.pagination.total = result.total || result.data?.total || 0
            this.dataSource.map(record => {
                this.columns.map((column, columnIndex) => {
                    if (column.type == 'component') {
                        this.moduleObject.removeDynamicRenderModuleGroup?.call(
                            this,
                            this.moduleObject.packageid,
                            `record-${
                                record[this.propData.rowKey]
                            }-${columnIndex}`,
                            false
                        )
                    }
                })
            })
            nextTick(() => {
                this.renderExpand()
            })
        },
        renderExpand() {
            this.dataSource.map(record => {
                this.columns.map((column, columnIndex) => {
                    if (column.type == 'component') {
                        this.moduleObject.dynamicRenderModuleGroupInitData?.call(
                            this,
                            this.moduleObject.packageid,
                            `record-${
                                record[this.propData.rowKey]
                            }-${columnIndex}`,
                            {
                                record,
                            },
                            false
                        )
                    }
                })
            })
        },
        handleExpand(expanded, record) {
            if (window.IDM.env_develop_mode) {
                return
            }
            if (expanded) {
                setTimeout(() => {
                    this.moduleObject.dynamicRenderModuleGroupInitData(
                        this.moduleObject.packageid,
                        `expand-${record[this.propData.rowKey]}`,
                        {
                            record,
                        },
                        false,
                        'dynamicRenderModule'
                    )
                }, 0)
            } else {
                this.moduleObject.removeDynamicRenderModuleGroup(
                    this.moduleObject.packageid,
                    `expand-${record[this.propData.rowKey]}`,
                    false
                )
            }
        },
        handleMenuClick(key, value, record, column) {
            if (availableArray(column.hanldeInterfaceFunc)) {
                window.IDM.invokeCustomFunctions.call(
                    this,
                    column.hanldeInterfaceFunc,
                    {
                        key,
                        value,
                        record,
                        column,
                    }
                )
            }
        },
        getActions(value, record, column) {
            if (availableArray(column.handleActionsFunc)) {
                if (value == undefined || value == null) {
                    return []
                }
                return _.flatten(
                    window.IDM.invokeCustomFunctions.call(
                        this,
                        column.handleActionsFunc,
                        {
                            value,
                            record,
                            column,
                        }
                    )
                )
            }
            return value || []
        },
        handleCustomHeaderCell(column) {
            const style = new Map()
            if (column.headerAlign) {
                style.set('text-align', column.headerAlign)
            }
            return {
                style: _.fromPairs([...style]),
            }
        },
        handleCustomCell(record, recordIndex, column) {
            const style = propToStyle(column)
            if (column.align) {
                style['text-align'] = column.align
            }
            return {
                style,
                on: {
                    click: event => {
                        if (availableArray(column.clickFunc)) {
                            window.IDM.invokeCustomFunctions.call(
                                this,
                                column.clickFunc,
                                {
                                    record,
                                    recordIndex,
                                    column,
                                    moduleObject: this.moduleObject,
                                    event,
                                }
                            )
                        }
                    },
                },
            }
        },
        handleHtmlRender(value, record, column, columnIndex) {
            return window.IDM.invokeCustomFunctions
                .call(this, column.htmlFunction, {
                    value,
                    record,
                    column,
                    columnIndex,
                })
                .join()
        },
        getLink(value, record, column) {
            if (availableArray(column.hrefFunc)) {
                return window.IDM.invokeCustomFunctions
                    .call(this, column.hrefFunc, {
                        moduleObject: this.moduleObject,
                        record,
                        value,
                        column,
                    })
                    .join()
            }
            if (column.href) {
                return this.urlGetWebPath(
                    this.expressReplace(
                        column.href,
                        {
                            moduleObject: this.moduleObject,
                            record,
                        },
                        true
                    )
                )
            }
            return ''
        },
        getDates(key) {
            return [this.filter[`${key}Start`], this.filter[`${key}End`]]
        },
        setDates(key, dates) {
            this.$set(this.filter, `${key}Start`, dates[0])
            this.$set(this.filter, `${key}End`, dates[1])
        },
        disabledDate(source, target, type) {
            if (!target) return false
            if (type == 'after') {
                return source.isAfter(target)
            }
            if (type == 'before') {
                return source.isBefore(target)
            }
        },
    },
}
</script>

<style lang="scss" scoped>
a,
.href {
    color: #2673d3;
    &:hover {
        text-decoration: underline;
    }
}
.table-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.filter-form {
    padding: 10px;
    background-color: #f5f5f5;
    :deep(.ant-form-item-label) {
        color: #333333;
        font-size: 16px;
        font-weight: 500;
    }
}
:deep(.tag) {
    color: var(--color);
    &.tag-border {
        border: 1px solid var(--color);
        background-color: var(--bg);
        border-radius: 3px;
        padding: 2px 5px;
    }
    &.tag-default {
        --color: #ccc;
        --bg: #cccccc21;
    }
    &.tag-info {
        --color: #0086d9;
        --bg: #0086d921;
    }
    &.tag-success {
        --color: #57bd6a;
        --bg: #57bd6a21;
    }
    &.tag-warning {
        --color: #fa6400;
        --bg: #fa640021;
    }
    &.tag-danger {
        --color: #e30000;
        --bg: #e3000021;
    }
}
:deep(.ant-table) {
    border: 1px solid #e8e8e8;
    border-radius: 3px;
    .ant-table-header,
    .ant-table-body {
        scrollbar-gutter: stable;
    }
    .ant-table-scroll {
        .ant-table-body {
            height: var(--bodyHeight);
            overflow-y: auto !important;
        }
    }
    .ant-table-thead {
        > tr {
            > th {
                color: #333;
                font-size: 16px;
                font-weight: bold;
                padding: 10px 10px;
                background-color: #f6fbfa;
            }
        }
    }
    .ant-table-tbody {
        > tr {
            cursor: pointer;
            &.even {
                background-color: #f6fbfa;
            }
            > td {
                color: #333333;
                font-size: 16px;
                font-weight: 500;
            }
        }
    }
    .ant-table-expanded-row {
        > td {
            border-bottom: none;
            padding: 0;
        }
    }
    .ant-table-tbody
        > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
        > td {
        background: none !important;
    }
    &.ant-table-empty {
        .ant-table-scroll {
            .ant-table-body {
                height: auto;
            }
        }
    }
}
</style>
