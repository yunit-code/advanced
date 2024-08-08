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
                    carry[current] = `wrap-${window.IDM.uuid()}`
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
                if (!Array.isArray(themeList) || themeList.length == 0) {
                    return
                }
                const themeNamePrefix =
                    window.IDM?.setting?.applications?.themeNamePrefix ||
                    'idm-theme-'
                themeList.forEach(item => {
                    IDM.setStyleToPageHead(
                        `.${themeNamePrefix}${item.key} #${
                            this.moduleObject.id || 'module_demo'
                        } .${this.className.wrap}`,
                        {
                            color: item.mainColor
                                ? window.IDM?.hex8ToRgbaString(
                                      item.mainColor.hex8
                                  )
                                : '',
                        }
                    )
                })
            },
            /**
             * @Desc 设置样式
             */
            _bindStyle() {
                Object.entries(this.className).forEach(([key, className]) => {
                    window.IDM.setStyleToPageHead(
                        `${this.moduleObject.id} .${className}`,
                        propToStyle(list[key].call(this))
                    )
                })
            },
        },
    }
}