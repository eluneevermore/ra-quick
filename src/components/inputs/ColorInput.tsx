import { useRef, useState } from 'react'
import { InputProps, TextInput, useInput } from 'react-admin'
import { ChromePicker } from 'react-color'
import { useOnOutsideClick } from '../hooks/event'

export type ColorInputProps<ValueType = any> = InputProps<ValueType>

export const ColorInput = (props: ColorInputProps) => {
  const [show, setShow] = useState(false)

  const ref = useRef<HTMLDivElement>(null)
  useOnOutsideClick(ref, () => setShow(false))

  const input = useInput(props)
  const { value, onChange } = input.field

  return (
    <div>
      <TextInput {...props} onFocus={() => setShow(true)} />
      {
        show &&
        <div ref={ref}>
          <ChromePicker
            color={value}
            onChange={({ hex }) => onChange(hex)}
          />
        </div>
      }
    </div>
  )
}

export default ColorInput
