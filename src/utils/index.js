/**
 * 打开新窗口
 * @param {string} url
 */
export async function openWindow(url) {
    const link = document.createElement('iframe')
    link.src = IDM.url.getWebPath(url)
    link.style.width = '0px'
    link.style.height = '0px'
    link.style.display = 'none'
    document.body.appendChild(link)
    // document.body.removeChild(link);
}
/**
 * 通用的url参数对象
 * 所有地址url参数转换
 */
export const commonParam = () => {
    const urlObject = window.IDM?.url?.queryObject() || {}
    return {
        pageId: window.IDM?.broadcast?.pageModule?.id || '',
        urlData: JSON.stringify(urlObject),
    }
}
export const propToStyle = props => {
    return Object.entries(props).reduce((carry, [key, value]) => {
        switch (key) {
            case 'width':
                carry['width'] = value
                break
            case 'height':
                carry['height'] = value
                break
            case 'ulbox':
                IDM.style.setBoxStyle(carry, value)
                break
            case 'bgColor':
                carry['background-color'] = value && value.hex8
                break
            case 'boxShadow':
                carry['box-shadow'] = value
                break
            case 'boxborder':
                IDM.style.setBorderStyle(carry, value)
                break
            case 'font':
                carry['font-family'] = value.fontFamily
                if (value.fontColors.hex8) {
                    carry['color'] = value.fontColors.hex8
                }
                carry['font-weight'] =
                    value.fontWeight && value.fontWeight.split(' ')[0]
                carry['font-style'] = value.fontStyle
                carry['font-size'] = value.fontSize + value.fontSizeUnit
                carry['line-height'] =
                    value.fontLineHeight +
                    (value.fontLineHeightUnit == '-'
                        ? ''
                        : value.fontLineHeightUnit)
                carry['text-align'] = value.fontTextAlign
                carry['text-decoration'] = value.fontDecoration
                break
        }
        return carry
    }, {})
}
export const availableArray = value => Array.isArray(value) && value.length > 0
export { default as dataUtil } from './dataUtil'
export default {
    commonParam,
    propToStyle,
    openWindow,
    availableArray,
}
