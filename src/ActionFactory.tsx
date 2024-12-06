import React, { ReactElement } from 'react'
import { ActionProvider, ListActionParams, RecordActionParams } from './ActionProvider'
import { titleize } from './common'
import { FormActionButton } from './components/buttons/ActionBotton'
import { BasicField } from './FieldFactory'
import FormFactory, { FormProperty } from './FormFactory'

export const BasicFormField = BasicField

export type ActionGeneratingProp = {
  name: string,
  label?: string,
  form?: FormProperty,
}

export type ActionProperty = ActionGeneratingProp | ReactElement<any>

export type ActionsGeneratingProp = ActionProperty[] | ReactElement<any>

export enum ActionType {
  LIST = 'list',
  RECORD = 'record',
}

const logActionProvider: ActionProvider = {
  triggerListAction<T = any>(params: ListActionParams<T>): any {
    console.log(params)
  },

  triggerRecordAction<T = any>(params: RecordActionParams<T>): any {
    console.log(params)
  },
}

class ActionFactory {

  actionProvider: ActionProvider
  formFactory: FormFactory

  constructor(actionProvider?: ActionProvider, formFactory?: FormFactory) {
    this.actionProvider = actionProvider ?? logActionProvider
    this.formFactory = formFactory ?? new FormFactory()
  }

  generateActions(type: ActionType, resource: string, actions?: ActionsGeneratingProp) {
    if (actions == null) {
      return undefined
    }
    if (React.isValidElement(actions)) {
      return actions as ReactElement
    }
    const results = (actions as ActionProperty[]).map((property, index) => {
      return this.generateAction(type, resource, property, index)
    })
    return results
  }

  generateAction(type: ActionType, resource: string, action: ActionProperty, index: number) {
    if (React.isValidElement(action)) {
      return React.cloneElement(action, { key: index, ...action.props as object }) as ReactElement
    } else {
      const { name, label, form } = action as ActionGeneratingProp
      const title = label ?? titleize(name)

      const onConfirm = this.getOnConfirm(type, resource, name)
      return <FormActionButton
        key={index}
        confirmProps={{
          title: 'Confirm?',
          content: `Are you sure you want to trigger [${title}]?`,
        }}
        label={title}
        form={form && this.formFactory.generateForm(form, onConfirm)}
        {...{ onConfirm, resource }}
      />
    }
  }

  private getOnConfirm(type: ActionType, resource: string, actionName: string) {
    if (type === ActionType.LIST) {
      return (values: any) => this.actionProvider.triggerListAction({
        resource,
        actionName,
        values,
      })
    } else {
      return (values: any, id: any) => this.actionProvider.triggerRecordAction({
        resource,
        actionName,
        id,
        values,
      })
    }
  }

}

export default ActionFactory
