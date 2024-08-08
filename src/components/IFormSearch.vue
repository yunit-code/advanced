<template>
    <div
        idm-ctrl="idm_module"
        :id="moduleObject.id"
        :idm-ctrl-id="moduleObject.id"
    >
        <a-form-model
            :model="filter"
            @submit="submitHandle"
            @submit.native.prevent
            layout="inline"
            :class="className.wrap"
        >
            <a-form-model-item :prop="propData.fieldKey">
                <a-input-search
                    v-model="filter[propData.fieldKey]"
                    placeholder="请输入检索内容"
                />
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" htmlType="submit">检索</a-button>
            </a-form-model-item>
            <a-form-model-item>
                <a-button @click="resetHandle">重置</a-button>
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
            console.debug('iTable setContextValue', object)
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr
            console.debug('iTable propDataWatchHandle', propData)
        },
        receiveBroadcastMessage(data) {
            console.debug('iFormSearch receiveBroadcastMessage', data)
        },
        submitHandle() {
            window.IDM.broadcast?.send({
                type: 'linkageDemand',
                messageKey: 'filter',
                rangeModule: this.propData.linkageDemandPageModule,
                message: this.filter,
            })
        },
        resetHandle() {
            this.filter = {}
            window.IDM.broadcast?.send({
                type: 'linkageDemand',
                messageKey: 'reset',
                rangeModule: this.propData.linkageDemandPageModule,
            })
        },
    },
}
</script>
