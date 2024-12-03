import { Dialog, DialogTitle } from '@mui/material'
import React, { ReactElement, useCallback, useMemo, useState } from 'react'
import { useNotify, useRecordContext } from 'react-admin'
import { FormProperty } from '../../../FormFactory'
import ActionButton, { ActionButtonProps } from './ActionBotton'

type ConfirmHandler<R = any> = (values: Record<keyof FormProperty, any>, id?: any) => R

export type ListActionButtonProps = Omit<ActionButtonProps, 'onConfirm'> & {
  resource: string,
  form?: ReactElement<{ onSubmit: ConfirmHandler }>,
  onConfirm?: ConfirmHandler,
}

const FormActionButton = ({ form, onConfirm, confirmProps, ...props }: ListActionButtonProps) => {
  const [showForm, setShowForm] = useState(false)
  const hasForm = !!form
  const record = useRecordContext()
  const notify = useNotify()

  const showSuccess = useCallback((result: any) => {
    if (!result) {
      notify(`Finished [${props.label}] on [${props.resource}]`, { type: 'success' })
    } else {
      notify(`Result: ${result}`, { type: 'success' })
    }
  }, [notify])

  const confirmHandler = useCallback(async (values: any) => {
    if (!onConfirm) return
    const result = await onConfirm(values, record?.id)
    showSuccess(result)
    return result
  }, [onConfirm, record?.id, showSuccess])

  const buttonExtProps = useMemo(() => {
    const onClick = (
      hasForm
        ? (() => setShowForm(true))
        : confirmHandler
    ) as ActionButtonProps['onConfirm']
    const newConfirmProps: ActionButtonProps['confirmProps'] = hasForm ? null : confirmProps
    return { onConfirm: onClick, confirmProps: newConfirmProps }
  }, [hasForm, confirmProps, confirmHandler, setShowForm])

  const onSubmit: ConfirmHandler = useCallback(async (values, id) => {
    if (!!form) {
      const result = await form.props.onSubmit(values, id)
      setShowForm(false)
      showSuccess(result)
    }
  }, [form, setShowForm, showSuccess])


  return (
    <>
      <ActionButton {...props} {...buttonExtProps} />
      {showForm && (
        <Dialog fullWidth open={true} onClose={() => setShowForm(false)}>
          {props.label && <DialogTitle>{props.label}</DialogTitle>}
          {form && React.cloneElement(form, { ...form.props, onSubmit })}
        </Dialog>
      )}
    </>
  )
}

export default FormActionButton
