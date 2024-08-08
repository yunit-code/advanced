<template>
    <div
        idm-ctrl="idm_module"
        :id="moduleObject.id"
        :idm-ctrl-id="moduleObject.id"
    >
        <a-config-provider :locale="locale">
            <div class="table-container" :class="className.wrap">
                <div class="filter-wrap">
                    <a-form-model
                        :model="filter"
                        layout="inline"
                        class="filter-form"
                    >
                        <a-form-model-item
                            v-for="field in fields"
                            :key="field.value"
                            :label="field.label"
                            :prop="field.value"
                        >
                            <a-select
                                v-if="field.type == 'select'"
                                v-model="filter[field.value]"
                                :mode="field.selectMode"
                                :allowClear="true"
                                style="min-width: 100px"
                            >
                                <a-select-option
                                    v-for="item in optionData[field.value]"
                                    :key="item.key"
                                    :value="item.key"
                                    >{{ item.value }}</a-select-option
                                >
                            </a-select>
                            <template v-else-if="field.type == 'date'">
                                <a-date-picker
                                    v-model="filter[`${field.value}Start`]"
                                />
                                ~
                                <a-date-picker
                                    v-model="filter[`${field.value}End`]"
                                />
                            </template>
                            <a-input v-else v-model="filter[field.value]" />
                        </a-form-model-item>
                        <a-form-model-item>
                            <div
                                class="filter-extra drag_container"
                                idm-ctrl-inner
                                :idm-ctrl-id="moduleObject.id"
                                idm-container-index="filter-extra"
                            ></div>
                        </a-form-model-item>
                    </a-form-model>
                </div>
                <a-table
                    :dataSource="dataSource"
                    :pagination="pagination"
                    :rowKey="propData.rowKey"
                    :loading="loading"
                    @change="handleTableChange"
                    @expand="handleExpand"
                    :defaultExpandAllRows="env_develop_mode"
                    :expandRowByClick="!env_develop_mode"
                    :expandIconAsCell="false"
                    :expandIconColumnIndex="propData.expandIconColumnIndex || 1"
                    :indentSize="0"
                    :scroll="{ y: propData.tableMaxHeight, x: '100%' }"
                    :rowClassName="
                        (_, index) => (index % 2 == 0 ? 'odd' : 'even')
                    "
                    :columns="columns"
                    class="table-wrap"
                >
                    <template #expandIcon="{ record, expanded, expandable }">
                        <div>
                            <svg-icon
                                v-if="expandable && record.expandable"
                                style="
                                    font-size: 18px;
                                    color: #134fed;
                                    cursor: pointer;
                                "
                                icon-class="move"
                            ></svg-icon>
                        </div>
                    </template>
                    <template
                        v-if="propData.expandedRow"
                        #expandedRowRender="record"
                    >
                        <div
                            class="drag_container"
                            idm-ctrl-inner
                            :idm-ctrl-id="moduleObject.id"
                            :idm-container-index="`expand-${
                                record[propData.rowKey]
                            }`"
                        ></div>
                    </template>
                </a-table>
            </div>
        </a-config-provider>
    </div>
</template>

<script>
import { commonParam, dataUtil, propToStyle } from '../utils'
import { bindProp, bindStyle } from '../mixins'
import { nextTick } from 'vue'
import zh_CN from 'ant-design-vue/lib/locale/zh_CN'
import moreIcon from '../assets/more.png'
export default {
    mixins: [
        bindProp({
            dataSourceType: 'customInterface',
            columnSourceType: 'staticData',
            columns: [],
            rowKey: 'id',
            expandedRow: true,
        }),
        bindStyle(),
    ],
    data() {
        return {
            locale: zh_CN,
            columnsDataSource: [],
            dataSource: window.IDM.env_develop_mode
                ? [
                      {
                          id: '1',
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
                showSizeChanger: true,
                showTotal: (total, range) =>
                    `当前显示${range[0]}-${range[1]}，总共${total}条`,
                hideOnSinglePage: true,
            },
            conditionObject: {},
            optionData: {},
            env_develop_mode: window.IDM.env_develop_mode,
        }
    },
    computed: {
        columns() {
            return this.comboColumns(this.columnsDataSource)
        },
        fields() {
            return this.comboFilters(this.columnsDataSource)
        },
    },
    mounted() {
        this.init()
    },
    watch: {
        columns: {
            handler(columns) {
                columns
                    .filter(n => n.type == 'select')
                    .forEach(n => {
                        dataUtil
                            .fetchData({
                                dataSourceType: n.dataSourceType,
                                customInterface: {
                                    url: n.customInterfaceUrl,
                                    requestParamFun: n.requestParamFun,
                                    requestContentType: n.requestContentType,
                                    requestType: n.requestType,
                                    responseDataFun: n.responseDataFun,
                                    requestErrorFun: n.requestErrorFun,
                                },
                                customFunction: n.customFunction,
                            })
                            .then(data => {
                                this.$set(this.optionData, n.value, data)
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
            return columns.map((column, columnIndex) => {
                const key = `${keyPrefix}-${columnIndex}`
                return {
                    ...column,
                    key,
                    title: column.label || column.title,
                    dataIndex: column.value || column.dataIndex,
                    align: column.headerAlign,
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
            return columns
                .flatMap(n => (n.children ? this.comboFilters(n.children) : n))
                .filter(n => n.filter)
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
                        <a
                            href={this.getLink(value, record, column)}
                            target={column.target}
                            onClick={e => e.stopPropagation()}
                        >
                            {value}
                        </a>
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
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr
            this.init()
        },
        receiveBroadcastMessage(data) {
            console.debug('iTable receiveBroadcastMessage', data)
            switch (data.type) {
                case 'linkageDemand':
                    switch (data.messageKey) {
                        case 'filter':
                            Object.keys(data.message).forEach(key => {
                                this.$set(this.filter, key, data.message[key])
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
                        case 'customFun':
                            linkageObject.resFunction?.length &&
                                IDM.invokeCustomFunctions.apply(this, [
                                    linkageObject.resFunction,
                                    {
                                        moduleObject: this.moduleObject,
                                        messageObject: data,
                                    },
                                ])
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
        init() {
            this.loadColumnsOptions().then(() => this.initData())
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
                        customInterface: {
                            url: this.propData.customInterfaceUrl,
                            requestParamFun: this.propData.requestParamFun,
                            requestContentType:
                                this.propData.requestContentType,
                            requestType: this.propData.requestType,
                            responseDataFun: this.propData.responseDataFun,
                            requestErrorFun: this.propData.requestErrorFun,
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
                .fetchData({
                    dataSourceType: this.propData.columnSourceType,
                    customInterface: {
                        url: this.propData.columnCustomInterfaceUrl,
                        requestParamFun: this.propData.columnRequestParamFun,
                        requestContentType:
                            this.propData.columnRequestContentType,
                        requestType: this.propData.columnRequestType,
                        responseDataFun: this.propData.columnResponseDataFun,
                        requestErrorFun: this.propData.columnRequestErrorFun,
                    },
                    customFunction: this.propData.columnCustomFunction,
                    staticData: this.propData.columns,
                })
                .then(data => {
                    this.columnsDataSource = data
                    return data
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
            this.moduleObject.removeDynamicRenderModuleGroup?.call(
                this,
                this.moduleObject.packageid,
                `expand-${record[this.propData.rowKey]}`,
                false
            )
            if (expanded) {
                nextTick(() => {
                    this.moduleObject.dynamicRenderModuleGroupInitData?.call(
                        this,
                        this.moduleObject.packageid,
                        `expand-${record[this.propData.rowKey]}`,
                        {
                            record,
                        },
                        false
                    )
                })
            }
        },
        handleMenuClick(key, value, record, column) {
            if (
                Array.isArray(column.hanldeInterfaceFunc) &&
                column.hanldeInterfaceFunc.length > 0
            ) {
                window.IDM.invokeCustomFunctions.apply(this, [
                    column.hanldeInterfaceFunc,
                    {
                        key,
                        value,
                        record,
                        column,
                    },
                ])
            }
        },
        getActions(value, record, column) {
            if (column.handleActionsFunc) {
                if (value == undefined || value == null) {
                    return []
                }
                return window.IDM.invokeCustomFunctions
                    .apply(this, [
                        column.handleActionsFunc,
                        {
                            value,
                            record,
                            column,
                        },
                    ])
                    .flat()
            }
            return value || []
        },
        handleCustomHeaderCell(column) {
            const style = new Map()
            if (column.headerAlign) {
                style.set('text-align', column.headerAlign)
            }
            return {
                style: Object.fromEntries(style.entries()),
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
                    click: () => {
                        window.IDM.invokeCustomFunctions.apply(this, [
                            column.textClickFunc,
                            { record, recordIndex, column },
                        ])
                    },
                },
            }
        },
        handleHtmlRender(value, record, column, columnIndex) {
            return window.IDM.invokeCustomFunctions
                .apply(this, [
                    column.htmlFunction,
                    {
                        value,
                        record,
                        column,
                        columnIndex,
                    },
                ])
                .join()
        },
        getLink(value, record, column) {
            if (column.hrefFunc) {
                return window.IDM.invokeCustomFunctions
                    .apply(this, [
                        column.hrefFunc,
                        {
                            moduleObject: this.moduleObject,
                            record,
                            value,
                            column,
                        },
                    ])
                    .join()
            }
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
        },
    },
}
</script>

<style lang="scss" scoped>
.table-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.filter-wrap {
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
    .ant-table-thead > tr > th {
        color: #333;
        font-size: 16px;
        font-weight: bold;
        padding: 10px 10px;
        background-color: #f6fbfa;
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
}
</style>
