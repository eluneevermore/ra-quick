import ActionFactory from './ActionFactory'
import ActionProvider from './ActionProvider'
import FieldFactory from './FieldFactory'
import FormFactory from './FormFactory'
import ResourceFactory from './ResourceFactory'
export * from './ActionFactory'
export * from './ActionProvider'
export * from './FieldFactory'
export * from './FormFactory'
export * from './ResourceFactory'

const { BasicField, Required } = FieldFactory

export {
  ActionFactory, ActionProvider, BasicField, FieldFactory, FormFactory, Required, ResourceFactory
}

const factory = new ResourceFactory()

export default factory
