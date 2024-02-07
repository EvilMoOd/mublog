---
title: useAxios
date: 2023/09/25
categories:
 - [轮子]
tags:
 - 轮子
description: "响应式获取后台数据，直接提取即可放到页面中进行渲染使用"
---

```typescript
import axios from 'axios'
import type { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
import { ref, shallowRef, computed, unref, watchEffect } from 'vue'
import { debounce, throttle } from 'lodash'

export function createAxios(config: AxiosRequestConfig) {
  const instance = axios.create(config)
  const controller = new AbortController()

  function useRequest<T>(config: AxiosRequestConfig, options: RequestOptions = {}) {
    // 默认响应值、防抖关闭，防抖延迟0.5s，默认立即执行
    const { defaultVal = {}, isDebounce = false, isThrottle = false, delay = 500, immediate = true } = options

    const isLoading = shallowRef(false) // 加载中
    const isFinished = shallowRef(false) // =是否完成
    const isAborted = shallowRef(false) // 请求被中断
    // v0.22.0开始 axios弃用CancelToken
    // const cancelToken: CancelTokenSource = axios.CancelToken.source()
    // 加载函数
    const loading = (loading: boolean) => {
      isLoading.value = loading
      isFinished.value = !loading
    }
    // 中断函数
    const abort = (message?: string) => {
      if (isFinished.value || !isLoading.value) return

      // cancelToken.cancel(message)
      controller.abort()
      isAborted.value = true
      isLoading.value = false
      isFinished.value = false
    }

    const response = ref<AxiosResponse<T>>() //axios响应
    const data = ref<T>(defaultVal) //响应数据
    const error = ref<AxiosError>() // axios 错误响应
    const errorData = ref<T>() // axios 错误响应数据

    // 普通请求
    const request = ({ params, data }: AxiosRequestConfig) => {
      return instance
        .request({
          ...config,
          params,
          data
        })
        .then(res => {
          response.value = res
          data.value = res.data
          loading(false)
        })
        .catch((e: AxiosError) => {
          error.value = e
          errorData.value = e.response ? e.response.data : ''
          loading(false)
        })
    }

    // 防抖请求
    const debounceRequest = debounce(request, delay)
    // 节流请求
    const throttleRequest = throttle(request, delay)
    // 手动请求
    const execute = (
      config: Pick<AxiosRequestConfig, 'params' | 'data'> = {
        params: {},
        data: {}
      }
    ) => {
      loading(true)
      return isDebounce ? debounceRequest(config) : isThrottle ? throttleRequest(config) : request(config)
    }

    // 立即执行
    if (immediate) execute()

    return {
      response,
      data,
      error,
      errorData,
      execute,
      isAborted,
      abort,
      isFinished,
      isLoading
    }
  }

  function useGet<Response>(url: string, params?: any, options?: RequestOptions) {
    const { response, data, error, errorData, execute, isAborted, abort, isFinished, isLoading } = useRequest<Response>(
      {
        url,
        params,
        method: 'get'
      },
      options
    )
    return {
      response,
      data,
      error,
      errorData,
      execute,
      isAborted,
      abort,
      isFinished,
      isLoading
    }
  }

  function usePost<Response>(url: string, data?: any, options?: RequestOptions) {
    const {
      response,
      data: resData,
      error,
      errorData,
      execute,
      isAborted,
      abort,
      isFinished,
      isLoading
    } = useRequest<Response>(
      {
        url,
        data,
        method: 'post'
      },
      options
    )
    return {
      response,
      data: resData,
      error,
      errorData,
      execute,
      isAborted,
      abort,
      isFinished,
      isLoading
    }
  }

  // 流文件转化为下载函数
  function useBlobDownload<T>(config: AxiosRequestConfig, options?: DownLoadRequestOptions) {
    const request = useRequest<T>({ ...config, responseType: 'blob' }, options)
    const { isFinished, download } = useResponseBlobDownLoad(options)
    // 全部下载完成标值
    const downLoadFinished = computed(() => unref(request.isFinished) && unref(isFinished))

    // 结果响应调用下载，转换blob流
    watchEffect(() => {
      if (!unref(request.isFinished)) return
      download(unref(request.response) as AxiosResponse)
    })

    return {
      ...request,
      downLoadFinished
    }
  }

  return {
    instance,
    useRequest,
    useGet,
    usePost,
    useBlobDownload
  }
}

interface DownLoadRequestOptions extends RequestOptions {
  fileName?: string // 文件名称
  contentType?: contentTypeStr // 文件类型
  cbData?: (res: AxiosResponse) => any // 返回值处理，默认取 response.data
}

const isServer = typeof window === 'undefined'

export type contentTypeStr =
  | 'application/*'
  | 'application/msword'
  | 'application/vnd.ms-excel'
  | 'application/pdf'
  | 'text/plain'
  | 'application/vnd.ms-powerpoint'

export function createLocalURL(file: BlobPart, contentType: contentTypeStr | string = 'application/*') {
  const blob = new Blob([file], {
    type: contentType //这个是Content-Typele的type类型（https://tool.oschina.net/commons）
  })
  return window.URL.createObjectURL(blob)
}

export function saveFileFromBlob(
  file: BlobPart,
  fileName: string,
  contentType: contentTypeStr | string = 'application/*'
) {
  if (isServer) {
    throw new Error('saveFileFromBlob methods is running in browser')
  }
  const link = document.createElement('a')
  const url = (link.href = createLocalURL(file, contentType))
  link.download = fileName
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export function useResponseBlobDownLoad(options?: DownLoadRequestOptions) {
  const isFinished = shallowRef(false) //下载完成标志
  const { fileName, contentType, cbData } = options || {}
  const filenameReg = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  const download = (_response: AxiosResponse) => {
    isFinished.value = false
    //读取响应头
    const headers = _response.headers || {}
    //读取文件类型
    const _contentType = contentType ?? headers['content-type'] //读取文件类型
    if (!_contentType) throw new Error('contentType Cannot be empty')
    // 读取文件名称
    const dispositionRegArr = filenameReg.exec(_response.headers['content-disposition'])
    const _fileName = fileName ?? decodeURI(dispositionRegArr ? dispositionRegArr[0] : '') //读取文件类型
    if (!_fileName) throw new Error('fileName Cannot be empty')
    //下载数据
    const data = cbData ? cbData(_response) : _response.data
    saveFileFromBlob(data, _fileName, _contentType)
    isFinished.value = true
  }

  return {
    isFinished,
    download
  }
}
interface RequestOptions {
  immediate?: boolean // 是否立即执行
  delay?: number // 防抖延迟时间
  isDebounce?: boolean // 是否防抖
  isThrottle?: boolean // 是否节流
  defaultVal?: any //默认响应值
}

```
