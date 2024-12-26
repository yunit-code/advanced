export default function bindProp(defaultPropData) {
    return {
        data() {
            return {
                moduleObject: this.$root.moduleObject,
                propData: Object.assign(
                    {},
                    defaultPropData,
                    this.$root.propData.compositeAttr
                ),
            }
        },
    }
}
