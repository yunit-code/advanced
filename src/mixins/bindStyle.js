export default function () {
    return {
        data() {
            return {
                className: {
                    wrap: window.IDM.uuid()
                }
            }
        },
        mounted() {
            this._bindTheme()
            this._bindStyle()
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
                const themeNamePrefix = window.IDM?.setting?.applications?.themeNamePrefix || 'idm-theme-'
                themeList.forEach((item) => {
                    IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${this.moduleObject.id || 'module_demo'} .${this.className.wrap}`, {
                        color: item.mainColor ? window.IDM?.hex8ToRgbaString(item.mainColor.hex8) : ''
                    })
                })
            },
            /**
             * @Desc 设置样式
             */
            _bindStyle() {
                let styleObject = {}
                for (const key in this.propData) {
                    if (this.propData.hasOwnProperty.call(this.propData, key)) {
                        const element = this.propData[key]
                        if (!element && element !== false && element != 0) {
                            continue
                        }
                        switch (key) {
                            case 'width':
                                styleObject['width'] = element
                                break
                            case 'height':
                                styleObject['height'] = element
                                break
                            case 'ulbox':
                                IDM.style.setBoxStyle(styleObject, element)
                                break
                            case 'bgColor':
                                styleObject['background-color'] = element && element.hex8
                                break
                            case 'boxShadow':
                                styleObject['box-shadow'] = element
                                break
                            case 'boxborder':
                                IDM.style.setBorderStyle(styleObject, element)
                                break
                        }
                    }
                }
                window.IDM.setStyleToPageHead(`${this.moduleObject.id} .${this.className.wrap}`, styleObject)
            }
        }
    }
}
