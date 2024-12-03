import React from 'react'
import jsonServerProvider from 'ra-data-json-server'
import { Admin } from 'react-admin'
import { authProvider } from './authProvider'
import factory, { ResourceGenerateOption } from '../src'

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com')

const RESOURCES: ResourceGenerateOption[] = [{
  name: 'users',
  fields: {
    id: 'Serial!',
    name: 'Text',
    email: 'Text',
  },
  listActions: [{
    name: 'ban',
    form: {
      reason: 'Text!',
      forever: 'Bool',
      until: 'DateTime!',
    },
  }],
  recordActions: [{
    name: 'greeting',
  }, {
    name: 'email',
    form: {
      title: 'Text!',
      repeat: 'Number!',
      attachment: 'File!',
      type: {
        componentType: 'Enum',
        options: ['promotion', 'notification'],
      },
    }
  }]
}, {
  name: 'posts',
  fields: {
    id: 'Serial!',
    userId: { componentType: 'Reference', reference: 'users' },
    title: 'Text',
    body: { componentType: 'Text', multiline: true },
  },
  filters: {
    id: 'Number',
  },
}]

const App = () => {
  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
    >
      {factory.generateResourceList(RESOURCES)}
    </Admin>
  )
}

export default App
