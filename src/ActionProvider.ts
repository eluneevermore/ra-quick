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

export interface ActionProvider {
  triggerListAction<T = any>(params: ListActionParams<T>): any
  triggerRecordAction<T = any>(params: RecordActionParams<T>): any
}
