import ResourceFactory from './ResourceFactory'
import FieldFactory from './FieldFactory'
import type { FieldProperty, FieldMode } from './FieldFactory'
import type { ResourceGenerateOption, ResourceGeneratedProps } from './ResourceFactory'

const { BasicField, Required } = FieldFactory

export {
  FieldProperty,
  FieldMode,
  ResourceGenerateOption,
  ResourceGeneratedProps,
  ResourceFactory,
  FieldFactory,
  BasicField,
  Required,
}

export default new ResourceFactory()
