import { ReactElement } from 'react'
import FieldFactory, { FieldMode, FieldProperty } from './FieldFactory'
import {
  Resource,
  Create,
  Datagrid, Edit,
  EditButton, List, Show,
  ShowButton,
  SimpleForm,
  SimpleShowLayout,
  ResourceProps,
} from 'react-admin'
import ListActions from './components/list/ExtListActions'

type View = 'list' | 'show' | 'create' | 'edit'

export type ResourceGeneratedProps = {
  name: string,
  list?: () => JSX.Element,
  edit?: () => JSX.Element,
  show?: () => JSX.Element,
  create?: () => JSX.Element,
} & Partial<ResourceProps>

export type ResourceGenerateOption = {
  name: string,
  createInputs?: Record<string, FieldProperty>,
  createOptions?: Record<string, any>,
  datagridOptions?: Record<string, any>,
  editInputs?: Record<string, FieldProperty>,
  editOptions?: Record<string, any>,
  fields?: Record<string, FieldProperty>,
  filters?: Record<string, FieldProperty>,
  inputs?: Record<string, FieldProperty>,
  listActions?: Array<ReactElement<any>> | ReactElement<any>,
  listFields?: Record<string, FieldProperty>,
  listOptions?: Record<string, any>,
  only?: View[],
  props?: Partial<ResourceProps>,
  recordActions?: Array<ReactElement<any>> | ReactElement<any>,
  showFields?: Record<string, FieldProperty>,
  showOptions?: Record<string, any>,
}

class ResourceFactory {

  fieldFactory: FieldFactory

  constructor(fieldFactory?: FieldFactory) {
    this.fieldFactory = fieldFactory ?? new FieldFactory()
  }

  generateResource = (
    { name, ...options }: ResourceGenerateOption,
  ): JSX.Element => {
    return <Resource {...this.getProps(name, options)} />
  }

  generateResourceList(resources: ResourceGenerateOption[]) {
    return resources.map(({ name, ...options }) =>
      <Resource key={name} {...this.getProps(name, options)} />
    )
  }

  getProps = (
    name: string,
    {
      createInputs,
      createOptions,
      datagridOptions,
      editInputs,
      editOptions,
      fields,
      filters = {},
      inputs,
      listActions,
      listFields,
      listOptions,
      only = ['list', 'show', 'create', 'edit'],
      recordActions,
      showFields,
      showOptions,
      props = {},
    }: Omit<ResourceGenerateOption, 'name'> = {}): ResourceGeneratedProps => {
    const result: ResourceGeneratedProps = { name }
    const actions: Record<string, JSX.Element> = {}
    const hasShow = only.includes('show')
    if (hasShow) {
      result.show = () =>
        <Show {...showOptions}>
          <SimpleShowLayout>
            {this.renderShowFields({ ...fields, ...showFields })}
          </SimpleShowLayout>
        </Show>
      actions.show = <ShowButton />
    }
    const hasCreate = only.includes('create')
    if (hasCreate) {
      result.create = () =>
        <Create {...createOptions}>
          <SimpleForm>
            {this.renderCreateInputs({ ...fields, ...inputs, ...createInputs })}
          </SimpleForm>
        </Create>
    }
    const hasEdit = only.includes('edit')
    if (hasEdit) {
      result.edit = () =>
        <Edit {...editOptions}>
          <SimpleForm>
            {this.renderEditInputs({ ...fields, ...inputs, ...editInputs })}
          </SimpleForm>
        </Edit>
      actions.edit = <EditButton />
    }
    const hasList = only.includes('list')
    if (hasList) {
      result.list = () =>
        <List
          actions={<ListActions actions={listActions} />}
          filters={this.renderFilterInputs(filters)}
          {...{ hasCreate, hasEdit, ...listOptions }}
        >
          <Datagrid {...datagridOptions}>
            {this.renderListFields({ ...fields, ...listFields, ...actions })}
            {recordActions}
          </Datagrid>
        </List>
    }
    return Object.assign(result, props)
  }

  renderListFields = (fieldMap: Record<string, FieldProperty>) => {
    return this.renderFields(fieldMap, 'list')
  }

  renderShowFields = (fieldMap: Record<string, FieldProperty>) => {
    return this.renderFields(fieldMap, 'show')
  }

  renderCreateInputs = (fieldMap: Record<string, FieldProperty>) => {
    return this.renderFields(fieldMap, 'create')
  }

  renderEditInputs = (fieldMap: Record<string, FieldProperty>) => {
    return this.renderFields(fieldMap, 'edit')
  }

  renderFilterInputs = (fieldMap: Record<string, FieldProperty>) => {
    return this.renderFields(fieldMap, 'filter')
  }

  renderFields = (
    fieldMap: Record<string, FieldProperty>,
    fieldMode: FieldMode,
  ) => {
    const results = Object.entries(fieldMap).map(([source, property]) => {
      return this.fieldFactory.generateField(source, fieldMode, property)
    }).filter(r => r)
    return results as ReactElement[]
  }
}

export default ResourceFactory
