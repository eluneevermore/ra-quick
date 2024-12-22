import React, { ReactElement } from 'react'
import {
  AutocompleteArrayInput,
  AutocompleteInput,
  BooleanInput, DateField,
  DateTimeInput, ImageField, NumberInput,
  ReferenceArrayField,
  ReferenceArrayInput,
  ReferenceField,
  ReferenceInput,
  SelectInput, TextField,
  TextInput,
  required
} from 'react-admin'
import { Required } from './common'
import ColorField from './components/fields/ColorField'
import JsonField from './components/fields/JsonField'
import ColorInput from './components/inputs/ColorInput'
import JsonInput from './components/inputs/JsonInput'
import OTFUpload from './components/inputs/OTFUpload'

type FieldProps = { source: string } & Record<string, any>

export type FieldProperty = string
  | { componentType: string } & Record<string, any>
  | ReactElement<{ source: string, label?: string }>
  | false

export type FieldMode = 'list' | 'show' | 'create' | 'edit' | 'filter'

type Library = Record<string, (props: FieldProps) => ReactElement<{ key?: string, source: string }>>

export const BasicField = {
  Serial: 'Serial',
  Text: 'Text',
  Number: 'Number',
  Bool: 'Bool',
  DateTime: 'DateTime',
  Image: 'Image',
  Enum: 'Enum',
  Color: 'Color',
  Json: 'Json',
  Reference: 'Reference',
  ReferenceArray: 'ReferenceArray',
}

class FieldFactory {

  static BasicField = BasicField

  static Required = Required

  FIELDS: Library = {
    [BasicField.Serial]: ({ validate, ...props }: FieldProps) => <TextField {...props} />,
    [BasicField.Text]: ({ validate, multiline, ...props }: FieldProps) => <TextField {...props} />,
    [BasicField.Number]: ({ validate, ...props }: FieldProps) => <TextField {...props} />,
    [BasicField.Bool]: ({ validate, ...props }: FieldProps) => <TextField {...props} />,
    [BasicField.DateTime]: ({ validate, ...props }: FieldProps) => <DateField showTime {...props} />,
    [BasicField.Image]: ({ validate, ...props }: FieldProps) => <ImageField {...props} />,
    [BasicField.Enum]: ({ validate, ...props }: FieldProps) => <TextField {...props} />,
    [BasicField.Color]: ({ validate, ...props }: FieldProps) => <ColorField {...props} />,
    [BasicField.Json]: ({ validate, ...props }: FieldProps) => <JsonField {...props} />,
    [BasicField.Reference]: ({ validate, reference, ...props }: FieldProps) => reference
      ? <ReferenceField {...props} reference={reference} link='show' />
      : <div>No "reference" specified</div>,
    [BasicField.ReferenceArray]: ({ validate, reference, ...props }: FieldProps) => reference
      ? <ReferenceArrayField {...props} reference={reference} />
      : <div>No "reference" specified</div>,
  }

  INPUTS: Library = {
    [BasicField.Text]: (props: FieldProps) =>
      <TextInput parse={value => value} {...props} />,
    [BasicField.Number]: (props: FieldProps) => <NumberInput {...props} />,
    [BasicField.Bool]: (props: FieldProps) => <BooleanInput {...props} />,
    [BasicField.DateTime]: (props: FieldProps) => <DateTimeInput {...props} />,
    [BasicField.Image]: (props: FieldProps) => <OTFUpload parse={value => value} {...props} />,
    [BasicField.Enum]: ({ options = [], ...props }: FieldProps) =>
      <SelectInput {...props} choices={options.map((id: string) => ({ id, name: id }))} />,
    [BasicField.Color]: (props: FieldProps) => <ColorInput {...props} />,
    [BasicField.Json]: (props: FieldProps) => <JsonInput {...props} />,
    [BasicField.Reference]: ({ reference, validate, children, ...props }: FieldProps) => {
      if (!reference) { return <div>No "reference" specified</div> }
      const newChildren = !!validate
        ? React.cloneElement(children ?? <AutocompleteInput />, { validate })
        : children
      return <ReferenceInput {...props} children={newChildren} reference={reference} />
    },
    [BasicField.ReferenceArray]: ({ reference, validate, children, ...props }: FieldProps) => {
      if (!reference) { return <div>No "reference" specified</div> }
      const newChildren = !!validate
        ? React.cloneElement(children ?? <AutocompleteArrayInput />, { validate })
        : children
      return <ReferenceArrayInput {...props} children={newChildren} reference={reference} />
    },
  }

  FILTERS = {
    ...this.INPUTS,
    [BasicField.Serial]: (props: FieldProps) => <NumberInput {...props} />,
  }

  CREATE_INPUTS = this.INPUTS

  UPDATE_INPUTS = {
    ...this.INPUTS,
    [BasicField.Serial]: (props: FieldProps) => <TextInput disabled {...props} />,
  }

  private getLibrary(view: FieldMode): Library {
    switch (view) {
      case 'create': return this.CREATE_INPUTS
      case 'edit': return this.UPDATE_INPUTS
      case 'list': return this.FIELDS
      case 'show': return this.FIELDS
      case 'filter': return this.FILTERS
    }
  }

  getHandler(type: string, mode: FieldMode) {
    return this.getLibrary(mode)[type]
  }

  generateType(type: string, mode: FieldMode, props: FieldProps) {
    const [realType, requiredMask] = type.split(Required)
    const handler = this.getHandler(realType, mode)
    if (!handler) { return }
    const fieldProps = {
      ...(requiredMask != null
        ? { validate: required() }
        : {}
      ),
      ...props,
    }
    return handler(fieldProps)
  }

  generateField(source: string, mode: FieldMode, property: FieldProperty) {
    const key = source
    if (property === false) { // Disable
      return null
    } else if (typeof property === 'string') { // String
      return this.generateType(property, mode, { key, source })
    } else if (React.isValidElement(property)) { // React
      return React.cloneElement(property, { key, ...property.props as object }) as ReactElement
    } else { // Object
      const { componentType, ...rest } = property
      return this.generateType(property.componentType, mode, { key, source, ...rest })
    }
  }
}

export default FieldFactory
