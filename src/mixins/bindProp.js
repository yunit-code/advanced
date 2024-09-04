export default function bindProp(defaultPropData) {
    return {
        data() {
            return {
                moduleObject: this.$root.moduleObject,
                propData: this.$root.propData.compositeAttr || defaultPropData,
            }
        },
    }
}
