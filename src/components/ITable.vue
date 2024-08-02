<template>
    <div
        idm-ctrl="idm_module"
        :id="moduleObject.id"
        :idm-ctrl-id="moduleObject.id"
    >
        <a-config-provider :locale="locale">
            <div class="table-wrap" :class="className.wrap">
                <a-form-model
                    v-if="fields.length > 0"
                    :model="filter"
                    layout="inline"
                    class="filter-wrap"
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
                </a-form-model>
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
                    :scroll="{ y: propData.tableMaxHeight }"
                    :rowClassName="
                        (_, index) => (index % 2 == 0 ? 'odd' : 'even')
                    "
                >
                    <a-table-column
                        v-for="(column, columnIndex) in propData.columns"
                        :title="column.label"
                        :data-index="column.value"
                        :sorter="column.sorter"
                        :align="column.align"
                        :width="column.width"
                        :customHeaderCell="
                            e => handleCustomHeaderCell(column, e)
                        "
                        :key="columnIndex"
                    >
                        <template #default="value, record, index">
                            <template v-if="column.type == 'index'">
                                {{ index + 1 }}
                            </template>
                            <template v-else-if="column.type == 'text'">
                                {{
                                    expressReplace(
                                        column.textTemplate || '@[value]',
                                        {
                                            value,
                                            record,
                                            column,
                                            columnIndex,
                                        }
                                    )
                                }}
                            </template>
                            <template v-else-if="column.type == 'select'">
                                {{
                                    optionData[column.value]?.find(
                                        n => n.key == value
                                    )?.value
                                }}
                            </template>
                            <template v-else-if="column.type == 'href'">
                                <a
                                    :href="
                                        urlGetWebPath(
                                            expressReplace(
                                                column.href,
                                                {
                                                    moduleObject,
                                                    record,
                                                },
                                                true
                                            )
                                        )
                                    "
                                    :target="column.target"
                                    @click.stop
                                    >{{ value }}</a
                                >
                            </template>
                            <template v-else-if="column.type == 'actions'">
                                <a-dropdown
                                    v-if="
                                        column.dropdown &&
                                        getActions(value, record, column)
                                            .length > 0
                                    "
                                >
                                    <a-menu
                                        slot="overlay"
                                        :selectable="false"
                                        @click="
                                            ({ key }) =>
                                                handleMenuClick(
                                                    key,
                                                    value,
                                                    record,
                                                    column
                                                )
                                        "
                                    >
                                        <a-menu-item
                                            v-for="item in getActions(
                                                value,
                                                record,
                                                column
                                            )"
                                            :key="item.value"
                                            style="text-align: center"
                                        >
                                            {{ item.label }}
                                        </a-menu-item>
                                    </a-menu>
                                    <img
                                        src="../assets/more.png"
                                        @click.stop.prevent
                                        alt=""
                                    />
                                </a-dropdown>
                                <a-space v-else>
                                    <a-button
                                        v-for="item in getActions(
                                            value,
                                            record,
                                            column
                                        )"
                                        :key="item.value"
                                        @click.stop="
                                            handleMenuClick(
                                                item.value,
                                                value,
                                                record,
                                                column
                                            )
                                        "
                                    >
                                        {{ item.label }}
                                    </a-button>
                                </a-space>
                            </template>
                            <template v-else-if="column.type == 'component'">
                                <div
                                    class="drag_container"
                                    idm-ctrl-inner
                                    :idm-ctrl-id="moduleObject.id"
                                    :idm-container-index="`record-${
                                        record[propData.rowKey]
                                    }-${columnIndex}`"
                                ></div>
                            </template>
                            <template
                                v-else-if="column.type == 'htmlFunction'"
                                v-html="
                                    handleHtmlRender(
                                        value,
                                        record,
                                        column,
                                        columnIndex
                                    )
                                "
                            >
                                <span
                                    v-html="
                                        handleHtmlRender(
                                            value,
                                            record,
                                            column,
                                            columnIndex
                                        )
                                    "
                                ></span>
                            </template>
                            <template v-else>
                                {{ value }}
                            </template>
                        </template>
                    </a-table-column>

                    <template #expandIcon="{ record, expanded, expandable }">
                        <svg-icon
                            v-if="expandable && record.expandable"
                            style="
                                font-size: 18px;
                                color: #134fed;
                                cursor: pointer;
                                margin-right: 3px;
                            "
                            icon-class="move"
                        ></svg-icon>
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
import { commonParam, dataUtil } from '../utils'
import bindStyle from '../mixins/bindStyle'
import { nextTick } from 'vue'
import zh_CN from 'ant-design-vue/lib/locale/zh_CN'
export default {
    mixins: [bindStyle()],
    data() {
        return {
            locale: zh_CN,
            moduleObject: this.$root.moduleObject,
            dataSource: [
                {
                    id: '',
                },
            ],
            totalCount: 0,
            filter: {},
            sort: {},
            loading: false,
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: true,
                showTotal: (total, range) =>
                    `当前显示${range[0]}-${range[1]}，总共${total}条`,
            },
            conditionObject: {},
            optionData: {},
            env_develop_mode: window.IDM.env_develop_mode,
            propData: this.$root.propData.compositeAttr || {
                dataSourceType: 'customInterface',
                columns: [
                    {
                        label: '序号',
                        value: 'id',
                        type: 'index',
                        headerAlign: 'center',
                        width: 60,
                    },
                    {
                        label: '名称',
                        value: 'title',
                        type: 'text',
                    },
                    {
                        label: '操作',
                        value: 'buttonList',
                        type: 'actions',
                        dataSource: 'record',
                        labelKey: 'text',
                        valueKey: 'value',
                        dropdown: true,
                    },
                ],
                rowKey: 'id',
                expandedRow: true,
            },
        }
    },
    computed: {
        fields() {
            return this.propData.columns.filter(n => n.filter)
        },
    },
    mounted() {
        this.init()
    },
    methods: {
        urlGetWebPath: window.IDM.url.getWebPath,
        expressReplace: window.IDM.express.replace,
        setContextValue(object) {
            console.debug('iTable setContextValue', object)
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr
            console.debug('iTable propDataWatchHandle', propData)
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
            this.initData()
            this.loadColumnsOptions()
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
                this.dataSource = [
                    {
                        id: '',
                    },
                ]
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
            params[this.propData.orderType || 'orderType'] = this.sort.orderType
            params[this.propData.reversed || 'reversed'] = this.sort.reversed
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
            // load columns options
            this.propData.columns
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
        handleTableChange(pagination, filters, sorter) {
            this.pagination.current = pagination.current
            this.pagination.pageSize = pagination.pageSize
            this.sort = {
                orderType: sorter.order
                    ? this.propData.columns[sorter.columnKey]?.sortField ||
                      sorter.field
                    : '',
                reversed: sorter.order ? sorter.order == 'descend' : '',
            }
            this.initData()
        },
        /**
         * 数据改变事件
         */
        resultChangeTableData(listResultData) {
            this.loading = false
            //设置数据源
            var rows =
                listResultData && listResultData.data
                    ? listResultData.data.rows
                    : []
            if (rows.length == 0) {
                rows = listResultData && listResultData.rows
            }
            this.dataSource = rows
            var totalCount =
                listResultData && listResultData.data
                    ? listResultData.data.total
                    : -1
            if (totalCount == -1) {
                totalCount = listResultData && listResultData.total
            }
            if (totalCount && totalCount != -1) {
                this.pagination.total = totalCount
            }
            this.dataSource.map(record => {
                this.propData.columns.map((column, columnIndex) => {
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
                this.dataSource.map(record => {
                    this.propData.columns.map((column, columnIndex) => {
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
                window.IDM.invokeCustomFunctions(this, [
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
            return column.actions || []
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
    },
}
</script>

<style lang="scss" scoped>
.table-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
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
.filter-wrap {
    padding: 10px;
    background-color: #f5f5f5;
    :deep(.ant-form-item-label) {
        color: #333333;
        font-size: 16px;
        font-weight: 500;
    }
}
:deep(.ant-table) {
    border: 1px solid #e8e8e8;
    border-radius: 3px;
    .ant-table-thead > tr > th {
        color: #333 !important;
        font-size: 16px !important;
        font-weight: bold !important;
        padding: 10px 10px !important;
        background-color: #f6fbfa !important;
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
