import { TextField, TextFieldProps } from '@mui/material'
import { useRef, useState } from 'react'
import { ChromePicker } from 'react-color'
import { useFormContext } from 'react-hook-form'
import { useOnOutsideClick } from '../hooks/event'

export type ColorFormInputProps = { name: string, isRequired?: boolean } & Omit<TextFieldProps, 'name'>

const ColorFormInput = ({ name, isRequired, ...props }: ColorFormInputProps) => {
  const { setValue, watch, formState, register } = useFormContext()
  const helperText = formState.errors[name]?.message?.toString()
  const [show, setShow] = useState(false)
  const value = watch(name)
  const options = isRequired ? { required: 'Required!' } : {}

  const ref = useRef<HTMLDivElement>(null)
  useOnOutsideClick(ref, () => setShow(false))

  return (
    <div>
      <TextField
        helperText={helperText}
        {...register(name, options)}
        onFocus={() => setShow(true)}
        value={value || ''}
        {...props}
      />
      {show && (
        <div ref={ref}>
          <ChromePicker
            color={value || ''}
            onChange={({ hex }) => setValue(name, hex, { shouldValidate: true, shouldTouch: true })}
          />
        </div>
      )}
    </div>
  )
}

export default ColorFormInput
