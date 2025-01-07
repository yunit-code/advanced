<template>
    <div
        idm-ctrl="idm_module"
        :id="moduleObject.id"
        :idm-ctrl-id="moduleObject.id"
        class="idm-advanced-iFormSearch"
    >
        <a-form-model
            :model="filter"
            @submit="submitHandle"
            @submit.native.prevent
            layout="inline"
        >
            <a-form-model-item
                v-if="propData.queryEnable"
                :prop="propData.fieldKey"
            >
                <a-input-search
                    v-model="filter[propData.fieldKey]"
                    placeholder="请输入检索内容"
                />
            </a-form-model-item>
            <a-form-model-item v-if="propData.submitEnable">
                <a-button type="primary" htmlType="submit">检索</a-button>
            </a-form-model-item>
            <a-form-model-item v-if="propData.resetEnable">
                <a-button @click="resetHandle">重置</a-button>
            </a-form-model-item>
            <a-form-model-item v-if="propData.exportEnable">
                <a-button @click="exportHandle">导出</a-button>
            </a-form-model-item>
            <a-form-model-item>
                <div
                    class="drag_container"
                    idm-ctrl-inner
                    :idm-ctrl-id="moduleObject.id"
                    idm-container-index="extra"
                ></div>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>

<script>
import { bindProp, bindStyle } from '../mixins'
export default {
    mixins: [
        bindProp({
            fieldKey: 'contentQuery',
            queryEnable: true,
            submitEnable: true,
            resetEnable: true,
        }),
        bindStyle(),
    ],
    data() {
        return {
            filter: {},
        }
    },
    methods: {
        setContextValue(object) {
            console.debug('iFormSearch setContextValue', object)
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr
            console.debug('iFormSearch propDataWatchHandle', propData)
        },
        receiveBroadcastMessage(data) {
            console.debug('iFormSearch receiveBroadcastMessage', data)
            switch (data.type) {
                case 'linkageDemand':
                    switch (data.messageKey) {
                        case 'filter':
                            Object.entries(data.message).forEach(
                                ([key, value]) => {
                                    this.$set(this.filter, key, value)
                                }
                            )
                            break
                        case 'reset':
                            this.filter = {}
                            break
                    }
                    break
            }
        },
        handleAction({ customFun, messageKey, rangeModule }) {
            window.IDM.invokeCustomFunctions.apply(this, [
                customFun,
                {
                    filter: this.filter,
                },
            ])
            window.IDM.broadcast?.send({
                type: 'linkageDemand',
                messageKey,
                rangeModule,
                message: this.filter,
            })
        },
        submitHandle() {
            this.handleAction({
                customFun: this.propData.submitFunc,
                messageKey: 'filter',
                rangeModule: this.propData.submitLinkageDemandPageModule,
            })
        },
        resetHandle() {
            this.filter = {}
            this.handleAction({
                customFun: this.propData.resetFunc,
                messageKey: 'reset',
                rangeModule: this.propData.resetLinkageDemandPageModule,
            })
        },
        exportHandle() {
            this.handleAction({
                customFun: this.propData.exportFunc,
                messageKey: 'export',
                rangeModule: this.propData.exportLinkageDemandPageModule,
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.idm-advanced-iFormSearch {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    :deep(.ant-btn-primary) {
        background-color: var(--theme-color, #1890ff);
        border-color: var(--theme-color, #1890ff);
        &:hover,
        &:active,
        &:focus {
            background-color: var(--theme-color, #1890ff);
            border-color: var(--theme-color, #1890ff);
        }
    }
}
</style>
