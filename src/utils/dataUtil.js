export function fetchData(
    {
        dataSourceType,
        dataSource,
        customInterface,
        pageCommonInterface,
        customFunction,
        staticData,
    },
    { params } = { params: {} }
) {
    return new Promise((resolve, reject) => {
        let reqParam = {}
        switch (dataSourceType) {
            case 'dataSource':
                if (!Array.isArray(dataSource)) {
                    reject({
                        message: '数据源格式错误',
                    })
                    return
                }
                if (dataSource.length == 0) {
                    reject({
                        message: '数据源为空',
                    })
                    return
                }
                window.IDM.datasource.request(
                    dataSource[0].id,
                    params,
                    resolve,
                    reject
                )
                break
            case 'customInterface':
                if (
                    customInterface.requestParamFun &&
                    customInterface.requestParamFun.length > 0
                ) {
                    try {
                        reqParam =
                            window[customInterface.requestParamFun[0].name] &&
                            window[
                                customInterface.requestParamFun[0].name
                            ].call(this, {
                                ...params,
                                ...customInterface.requestParamFun[0].param,
                            })
                    } catch (error) {
                        reject(error)
                    }
                }
                customInterface.url &&
                    window.IDM.http[customInterface.requestType || 'get'](
                        customInterface.url,
                        {
                            ...params,
                            ...reqParam,
                        },
                        {
                            headers: {
                                'Content-Type':
                                    customInterface.requestContentType ||
                                    'application/json;charset=UTF-8',
                            },
                        }
                    )
                        .then(res => {
                            let resultData = res && res.data
                            if (
                                customInterface.responseDataFun &&
                                customInterface.responseDataFun.length > 0
                            ) {
                                try {
                                    resultData =
                                        window[
                                            customInterface.responseDataFun[0]
                                                .name
                                        ] &&
                                        window[
                                            customInterface.responseDataFun[0]
                                                .name
                                        ].call(this, {
                                            resultData,
                                            ...params,
                                            ...customInterface
                                                .responseDataFun[0].param,
                                        })
                                } catch (error) {
                                    reject(error)
                                }
                            }
                            resolve(resultData)
                        })
                        .catch(function (error) {
                            if (
                                customInterface.requestErrorFun &&
                                customInterface.requestErrorFun.length > 0
                            ) {
                                try {
                                    window[
                                        customInterface.requestErrorFun[0].name
                                    ] &&
                                        window[
                                            customInterface.requestErrorFun[0]
                                                .name
                                        ].call(this, {
                                            error,
                                            ...params,
                                            ...customInterface
                                                .requestErrorFun[0].param,
                                        })
                                } catch (error) {
                                    reject(error)
                                }
                            }
                        })
                break
            case 'pageCommonInterface':
                for (const data of pageCommonInterface.dataset) {
                    if (data.key == pageCommonInterface.dataName) {
                        let value = data
                        if (pageCommonInterface.dataFiled) {
                            value = window.IDM.express.replace(
                                `@[${pageCommonInterface.dataFiled}]`,
                                data
                            )
                        }
                        if (
                            Array.isArray(pageCommonInterface.dataFunc) &&
                            pageCommonInterface.dataFunc.length > 0
                        ) {
                            value =
                                window[pageCommonInterface.dataFunc[0].name] &&
                                window[
                                    pageCommonInterface.dataFunc[0].name
                                ].call(this, {
                                    data,
                                    value,
                                })
                        }
                        resolve(value)
                    }
                }
                break
            case 'customFunction':
                if (customFunction && customFunction.length > 0) {
                    let resValue = {}
                    try {
                        resValue =
                            window[customFunction[0].name] &&
                            window[customFunction[0].name].call(this, {
                                ...params,
                                ...customFunction[0].param,
                            })
                    } catch (error) {}
                    resolve(resValue)
                }
                break
            case 'staticData':
                resolve(staticData)
                break
            case 'pageContainer':
                break
            default:
                reject({
                    message: '无效数据源',
                })
                break
        }
    })
}
export default {
    fetchData,
}
