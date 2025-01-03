import ActionFactory from './ActionFactory'
import FieldFactory from './FieldFactory'
import FormFactory from './FormFactory'
import ResourceFactory from './ResourceFactory'
export * from './ActionFactory'
export * from './ActionProvider'
export * from './components'
export * from './FieldFactory'
export * from './FormFactory'
export * from './ResourceFactory'

const { BasicField, Required } = FieldFactory

export {
  ActionFactory, BasicField, FieldFactory, FormFactory, Required, ResourceFactory
}

const factory = new ResourceFactory()

export default factory
