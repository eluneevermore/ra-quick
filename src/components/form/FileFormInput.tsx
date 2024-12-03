import { Button, FormHelperText, TextField } from '@mui/material'
import { useFormContext, UseFormRegisterReturn } from 'react-hook-form'

export type FileFormInputProps = {
  name: string,
  helperText?: string,
  label?: string,
} & Omit<UseFormRegisterReturn, 'name'>

const FileFormInput = ({ name, helperText, label, ...props }: FileFormInputProps) => {
  const { watch, setValue } = useFormContext()
  const selectedFile = watch(name)

  return (
    <div>
      <TextField
        value={selectedFile?.[0]?.name || ''}
        disabled
        label={label}
        fullWidth
      />
      <Button component='label' variant='contained'>
        Upload File
        <input type='file' hidden {...props} onChange={event => setValue(name, event.target.files)} />
      </Button>
      <FormHelperText error>{helperText}</FormHelperText>
    </div>
  )
}

export default FileFormInput
