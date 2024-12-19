import CircularProgress from '@mui/material/CircularProgress'
import { ChangeEvent, createContext, useCallback, useContext, useRef, useState } from 'react'
import { Button, InputProps, TextInput, useInput, useNotify } from 'react-admin'
import { Awaitable } from '../../utils'

const otfUpload = async (
  file: File,
  getUrl: () => Awaitable<string>,
  contentType?: string
) => {
  const url = await getUrl()
  const data: RequestInit = {
    method: 'PUT',
    body: file,
  }
  data.headers = {
    'Content-Type': contentType ?? file.type,
  }
  await fetch(url, data)
  return url
}

const defaultGetReadUrl = (url: string) => {
  return url.substring(0, url.indexOf('?'))
}

export type OTFUploadProps<ValueType = any> = InputProps<ValueType> & {
  contentType?: string,
  getUploadUrl?: () => Awaitable<string>,
  getReadUrl?: (url: string) => Awaitable<string>,
}

export const OTFUploadContext = createContext<{
  getUploadUrl?: () => Awaitable<string>,
  getReadUrl?: (url: string) => Awaitable<string>,
}>({})

export const OTFUpload = (props: OTFUploadProps) => {
  const {
    contentType,
    getUploadUrl: getUploadUrlProp,
    getReadUrl: getReadUrlProp,
  } = props
  const { field } = useInput(props)
  const [processing, setProcessing] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  const showNotification = useNotify()
  const uploadContext = useContext(OTFUploadContext)
  const getUploadUrl = getUploadUrlProp ?? uploadContext.getUploadUrl
  const getReadUrl = getReadUrlProp ?? uploadContext.getReadUrl ?? defaultGetReadUrl

  const uploadFile = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    if (processing) { return }
    if (!getUploadUrl) { return }
    const file = event.target.files?.[0]
    if (!file) { return }

    setProcessing(true)
    try {
      const uploadUrl = await otfUpload(file, getUploadUrl, contentType)
      const readUrl = await getReadUrl(uploadUrl)
      field.onChange(readUrl)
    } catch (error: any) {
      showNotification(error?.message, { type: 'error' })
    } finally {
      setProcessing(false)
    }
  }, [processing, setProcessing, getUploadUrl, getReadUrl, contentType, field])

  const selectFile = () => {
    if (processing) { return }
    if (ref.current) {
      ref.current.value = ''
      ref.current.click()
    }
  }

  if (!getUploadUrl) {
    return <div>No "getUploadUrl" specified</div>
  }

  return (
    <div>
      <TextInput {...props} />
      {processing
        ? <CircularProgress />
        : (
          <Button onClick={selectFile} label='Upload' disabled={processing} />
        )
      }
      <input type='file' ref={ref} onChange={uploadFile} hidden />
    </div>
  )
}

export default OTFUpload
