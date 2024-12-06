import { Checkbox, FormControl, FormControlLabel, FormHelperText, MenuItem, TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import React, { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Required, titleize } from './common'
import ColorFormInput from './components/form/ColorFormInput'
import FileFormInput from './components/form/FileFormInput'
import { FormContainer, WithForm } from './components/form/Form'

export type FormProperty = Record<string, FormFieldProperty>

export type FormFieldProperty =
  | string
  | ({ componentType: string } & Record<string, any>)
  | ReactElement<any>
  | false

export type FormFieldHandlerProps = {
  name: string,
  key: string,
  label: string,
  isRequired?: boolean,
} & Record<string, any>

export type FormFieldHandler = (props: FormFieldHandlerProps) => ReactElement<{ key?: string }>

type Library = Record<string, FormFieldHandler>

export const FormBasicField = {
  Text: 'Text',
  Number: 'Number',
  Bool: 'Bool',
  DateTime: 'DateTime',
  Enum: 'Enum',
  Color: 'Color',
  File: 'File',
}

class FormFactory {

  private library: Library

  constructor() {
    this.library = {
      [FormBasicField.Text]: (props) => <WithForm key={props.key} render={form =>
        <TextField
          {...form.register(props.name, FormFactory.getCommonRegisterProps(props, form))}
          {...FormFactory.getCommonFieldProps(props, form)}
        />
      } />,
      [FormBasicField.Number]: (props) => <WithForm key={props.key} render={form =>
        <TextField type='number'
          {...form.register(props.name, FormFactory.getCommonRegisterProps(props, form))}
          {...FormFactory.getCommonFieldProps(props, form)}
        />}
      />,
      [FormBasicField.Bool]: (props) => <WithForm key={props.key} render={form => {
        const { label, helperText, fullWidth, ...commonProps } = FormFactory.getCommonFieldProps(props, form)
        return (
          <FormControl error={!!helperText}>
            <FormControlLabel
              label={label}
              control={
                <Checkbox
                  {...form.register(props.name, FormFactory.getCommonRegisterProps(props, form))}
                  {...commonProps}
                />
              }
            />
            {!!helperText && (
              <FormHelperText>{helperText}</FormHelperText>
            )}
          </FormControl>
        )
      }} />,
      [FormBasicField.DateTime]: (props) => <WithForm key={props.key} render={form => {
        const { label, helperText, fullWidth, ...commonProps } = FormFactory.getCommonFieldProps(props, form)
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <FormControl fullWidth error={!!helperText}>
              <DateTimePicker
                label={label}
                {...form.register(props.name, FormFactory.getCommonRegisterProps(props, form))}
                onChange={(date) => form.setValue(props.name, date)}  // Manually set the value for the DateTime
              />
              {!!helperText && (
                <FormHelperText>{helperText}</FormHelperText>
              )}
            </FormControl>
          </LocalizationProvider>
        )
      }} />,
      [FormBasicField.Enum]: (props) => <WithForm key={props.key} render={form => {
        return (
          <TextField
            {...form.register(props.name, FormFactory.getCommonRegisterProps(props, form))}
            {...FormFactory.getCommonFieldProps(props, form)}
            select
          >
            {(props.options || []).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )
      }} />,
      [FormBasicField.Color]: (props) => <ColorFormInput {...props} />,
      [FormBasicField.File]: (props) => <WithForm key={props.key} render={form =>
        <FileFormInput
          {...form.register(props.name, FormFactory.getCommonRegisterProps(props, form))}
          {...FormFactory.getCommonFieldProps(props, form)}
        />
      } />,
    }
  }

  generateForm(form: FormProperty, onSubmit: (...any) => any): ReactElement<{ onSubmit: (...any) => any }> {
    return (
      <FormContainer
        onSubmit={onSubmit}
      >
        {this.generateFields(form)}
      </FormContainer>
    )
  }

  getLibrary(): Library {
    return this.library
  }

  getHandler(type: string) {
    return this.getLibrary()[type]
  }

  generateType(type: string, { name, ...props }: Omit<FormFieldHandlerProps, 'isRequired' | 'label'>) {
    const [realType, requiredMask] = type.split(Required)
    const handler = this.getHandler(realType)
    if (!handler) { return }
    const fieldProps = {
      ...(requiredMask != null
        ? { isRequired: true }
        : {}
      ),
      name,
      label: titleize(name),
      key: name,
      ...props,
    }
    return handler(fieldProps)
  }

  generateFields(form: FormProperty) {
    const fields = Object.entries(form).map(([name, property]) => this.generateField(name, property))
    return fields
  }


  generateField(name: string, property: FormFieldProperty) {
    if (property === false) {
      return null
    } else if (typeof property === 'string') {
      return this.generateType(property, { name })
    } else if (React.isValidElement(property)) {
      return property
    } else {
      const { componentType, ...rest } = property as ({ componentType: string } & Record<string, any>)
      return this.generateType(componentType, { name, ...rest })
    }
  }

  static getCommonFieldProps = (props: FormFieldHandlerProps, form: UseFormReturn) => {
    const { name, isRequired, label, ...rest } = props
    const result = {
      label,
      helperText: form.formState.errors[name]?.message?.toString(),
      error: !!form.formState.errors[name],
      fullWidth: true,
      ...rest,
    }
    return result
  }

  static getCommonRegisterProps = (props: FormFieldHandlerProps, form: UseFormReturn) => {
    const { isRequired } = props
    const required = isRequired ? 'Required!' : undefined
    return ({ required })
  }
}

export default FormFactory
