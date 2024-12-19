import { InputProps, TextField, useRecordContext } from 'react-admin'

export const ColorField = (props: InputProps) => {
  const { source } = props
  const record = useRecordContext(props)
  const value = record[source]

  return (
    <div style={{ display: 'flex' }}>
      <div style={{
        width: 20,
        height: 20,
        marginRight: 5,
        background: value
      }} />
      <TextField {...props} />
    </div>
  )
}

export default ColorField
