export type ListActionParams<T = any> = {
  resource: string
  actionName: string
  values: T
}

export type RecordActionParams<T = any, K = any> = {
  resource: string
  actionName: string
  id: K
  values: T
}

export class ActionProvider {

  triggerListAction<T = any>(params: ListActionParams<T>): any {
    console.log(params)
  }

  triggerRecordAction<T = any>(params: RecordActionParams<T>): any {
    console.log(params)
  }
}

export default ActionProvider
