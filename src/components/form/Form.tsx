import { Box, Button, DialogActions, DialogContent } from '@mui/material'
import { ReactElement, useMemo } from 'react'
import { FormProvider, UseFormReturn, useForm, useFormContext } from 'react-hook-form'

export type FormDialogProps = {
  open?: boolean
  title?: string
  onSubmit: (any) => any
  children?: React.ReactNode
  render?: (form: UseFormReturn) => ReactElement
}

export const FormContainer = ({
  onSubmit,
  children,
  render,
}: FormDialogProps) => {
  const formProps = useForm()
  const { handleSubmit } = formProps
  const content = useMemo(() => children ?? (render && render(formProps)), [children, render, formProps])

  return (
    <FormProvider {...formProps}>
      <Box component='form' onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {content}
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Box>
    </FormProvider>
  )
}

export type WithFormProps = {
  render: (form: UseFormReturn) => ReactElement
}

export const WithForm = ({
  render,
}: WithFormProps) => {
  const form = useFormContext()
  const content = useMemo(() => render(form), [form, render])
  return content
}

export default {
  FormContainer,
  WithForm,
}
