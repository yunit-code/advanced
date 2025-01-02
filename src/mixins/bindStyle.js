import { propToStyle } from '../utils'
export default function bindStyle(styles = {}) {
    const comboStyles = _.assign(
        {},
        {
            _root() {
                return this.propData
            },
        },
        styles
    )
    return {
        data() {
            return {
                className: _.reduce(
                    _.keys(comboStyles),
                    (carry, current) => {
                        if (['_root'].includes(current)) {
                            carry[current] = current
                        } else {
                            carry[current] = `${current}-${window.IDM.uuid()}`
                        }
                        return carry
                    },
                    {}
                ),
            }
        },
        watch: {
            propData: {
                handler() {
                    window.IDM.setStyleObjectToPageHead(
                        this.moduleObject.packageid,
                        [...this._bindTheme(), ...this._bindStyle()]
                    )
                },
                deep: true,
                immediate: true,
            },
        },
        methods: {
            /**
             * @Desc 设置主题
             */
            _bindTheme() {
                const themeList = this.propData.themeList || []
                if (!_.isArray(themeList) || themeList.length == 0) {
                    return
                }
                const themeNamePrefix =
                    window.IDM?.setting?.applications?.themeNamePrefix ||
                    'idm-theme-'
                return _.map(themeList, theme => ({
                    selector: `.${themeNamePrefix}${theme.key} #${
                        this.moduleObject.id || 'module_demo'
                    }`,
                    style: {
                        '--main-color': window.IDM?.hex8ToRgbaString(
                            theme.mainColor.hex8
                        ),
                    },
                }))
            },
            /**
             * @Desc 设置样式
             */
            _bindStyle() {
                return _.map(_.toPairs(this.className), ([key, className]) => {
                    if (key == '_root') {
                        return {
                            selector: `#${this.moduleObject.packageid}`,
                            style: propToStyle(comboStyles[key].call(this)),
                        }
                    }
                    return {
                        selector: `#${this.moduleObject.id} .${className}`,
                        style: propToStyle(comboStyles[key].call(this)),
                    }
                })
            },
        },
    }
}
