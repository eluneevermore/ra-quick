import CloudUploadIcon from '@mui/icons-material/CloudUpload'
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
  getReadUrl?: (url: string) => string,
}

export const OTFUploadContext = createContext<{ getUploadUrl: undefined | (() => Awaitable<string>) }>({
  getUploadUrl: undefined,
})

export const OTFUpload = (props: OTFUploadProps) => {
  const {
    contentType,
    getUploadUrl: getUploadUrlProp,
    getReadUrl = defaultGetReadUrl,
  } = props
  const { field } = useInput(props)
  const [processing, setProcessing] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  const showNotification = useNotify()
  const { getUploadUrl: getUploadUrlContext } = useContext(OTFUploadContext)
  const getUploadUrl = getUploadUrlProp ?? getUploadUrlContext

  const uploadFile = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (processing) { return }
    if (!getUploadUrl) { return }
    const file = event.target.files?.[0]
    if (!file) { return }

    setProcessing(true)
    otfUpload(file, getUploadUrl, contentType)
      .then(uploadUrl => field.onChange(getReadUrl(uploadUrl)))
      .catch((error: Error) => showNotification(error.message, { type: 'error' }))
      .finally(() => setProcessing(false))
  }, [processing, setProcessing, getUploadUrl, contentType, field])

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
          <Button onClick={selectFile} label='Upload' disabled={processing}>
            <CloudUploadIcon></CloudUploadIcon>
          </Button>
        )
      }
      <input type='file' ref={ref} onChange={uploadFile} hidden />
    </div>
  )
}

export default OTFUpload
