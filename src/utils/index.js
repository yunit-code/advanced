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

export { default as dataUtil } from './dataUtil'
