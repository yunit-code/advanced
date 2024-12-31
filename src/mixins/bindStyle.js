import { propToStyle } from '../utils'
export default function bindStyle(
    list = {
        wrap() {
            return this.propData
        },
    }
) {
    return {
        data() {
            return {
                className: Object.keys(list).reduce((carry, current) => {
                    if (['_root'].includes(current)) {
                        carry[current] = current
                    } else {
                        carry[current] = `${current}-${window.IDM.uuid()}`
                    }
                    return carry
                }, {}),
            }
        },
        watch: {
            propData: {
                handler() {
                    this._bindTheme()
                    this._bindStyle()
                },
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
                window.IDM.setStyleObjectToPageHead(
                    this.moduleObject.packageid,
                    themeList.map(theme => ({
                        selector: `.${themeNamePrefix}${theme.key} #${
                            this.moduleObject.id || 'module_demo'
                        }`,
                        style: {
                            '--theme-color': window.IDM?.hex8ToRgbaString(
                                theme.mainColor.hex8
                            ),
                        },
                    }))
                )
            },
            /**
             * @Desc 设置样式
             */
            _bindStyle() {
                window.IDM.setStyleObjectToPageHead(
                    this.moduleObject.packageid,
                    _.toPairs(this.className)
                        .map(([key, className]) => {
                            if (key == '_root') {
                                return {
                                    selector: `#${this.moduleObject.packageid}`,
                                    style: propToStyle(list[key].call(this)),
                                }
                            }
                            return {
                                selector: `#${this.moduleObject.id} .${className}`,
                                style: propToStyle(list[key].call(this)),
                            }
                        })
                )
            },
        },
    }
}
