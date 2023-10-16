import JSONEditor, { JSONEditorOptions } from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'
import { useEffect, useRef } from 'react'
import type { InputProps } from 'react-admin'
import { useRecordContext } from 'react-admin'

export type JsonFieldProps<ValueType = any> = InputProps<ValueType> & {
  className?: string,
  options?: JSONEditorOptions,
}

const JsonField = (props: JsonFieldProps) => {
  const record = useRecordContext(props)
  const { className, source, options = {} } = props

  const elementRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<JSONEditor>()
  const value = record[source]

  // init the json editor
  useEffect(() => {
    // @ts-ignore
    const editor = new JSONEditor(elementRef.current, {
      name: source,
      modes: ['view', 'preview'],
      ...options,
    }, value)

    editorRef.current = editor
    return () => {
      editor.destroy()
    }
  }, [])

  // update the value
  useEffect(() => {
    editorRef.current?.set(value)
  }, [value])

  return <div ref={elementRef} className={className} />
}

export default JsonField
