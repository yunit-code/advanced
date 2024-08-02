export const fetchData = (
    { dataSourceType, customInterface, customFunction },
    { params } = { params: {} }
) => {
    return new Promise((resolve, reject) => {
        let reqParam = {}
        switch (dataSourceType) {
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
            case 'pageContainer':
                break
        }
    })
}
export default {
    fetchData,
}
