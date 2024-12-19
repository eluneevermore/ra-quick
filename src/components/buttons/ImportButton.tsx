import UploadFileIcon from '@mui/icons-material/UploadFile'
import Tooltip from '@mui/material/Tooltip'
import React, { ChangeEventHandler, ReactElement, useRef } from 'react'
import { Button } from 'react-admin'

export const ImportButton = (props: ImportButtonProps) => {
  const {
    label = 'Import',
    reset = true,
    onSelect = null,
    tooltip = label,
  } = props
  const ref = useRef<HTMLInputElement>(null)

  const selectFile = () => {
    if (ref.current) {
      if (reset) {
        ref.current.value = ''
      }
      ref.current.click()
    }
  }

  const selectHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0]
    if (!file) { return }
    onSelect && onSelect(file, event)
    if (reset && ref.current) {
      ref.current.value = ''
    }
  }

  return (
    <>
      <Tooltip title={tooltip}>
        <div>
          <Button label={label} onClick={selectFile}>
            <UploadFileIcon />
          </Button>
        </div>
      </Tooltip>
      <input hidden type='file' ref={ref} onChange={selectHandler} />
    </>
  )
}

export type ImportButtonProps = {
  label?: string,
  reset?: boolean,
  onSelect?: (file: File, event: React.ChangeEvent<HTMLInputElement>) => void,
  tooltip?: string | ReactElement<any>,
}

export default ImportButton
