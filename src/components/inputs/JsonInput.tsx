import Ajv from 'ajv'
import JSONEditor, { JSONEditorOptions } from 'jsoneditor'
import { useEffect, useRef } from 'react'
import { InputProps, useInput } from 'react-admin'

const ajv = new Ajv()

export type JsonInputProps<ValueType = any> = InputProps<ValueType> & {
  className?: string,
  options?: JSONEditorOptions,
}

export const JsonInput = ((props: JsonInputProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<JSONEditor>()

  const { source, className, options = {} } = props

  const {
    fieldState: { isDirty },
    field: { value, onChange },
  } = useInput(props)

  // init the json editor
  useEffect(() => {
    const { schema, schemaRefs, ...opts } = options || {}
    // @ts-ignore
    const editor = new JSONEditor(elementRef.current, {
      name: source,
      modes: ['tree', 'form', 'code'],
      ...opts,
      onChange: () => onChange(editor.get()),
    }, value)

    editorRef.current = editor
    return () => {
      editor.destroy()
    }
  }, [])

  useEffect(() => {
    if (!isDirty) {
      editorRef.current?.set(value)
    } else {
      editorRef.current?.update(value)
    }
  }, [value])

  // update the schema
  useEffect(() => {
    try {
      const { schema, schemaRefs } = options || {}
      if (schema && ajv.validateSchema(schema)) {
        editorRef.current?.setSchema(schema, schemaRefs)
      }
    } catch { }
  }, [options?.schema])

  return (<div className={className} ref={elementRef} />)
})

export default JsonInput
