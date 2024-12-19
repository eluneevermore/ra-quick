import jsonServerProvider from 'ra-data-json-server'
import React from 'react'
import { Admin } from 'react-admin'
import factory, { OTFUploadContext, ResourceGenerateOption } from '../src'
import { authProvider } from './authProvider'

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
    userId: { componentType: 'Reference!', reference: 'users' },
    title: 'Text',
    body: { componentType: 'Text', multiline: true },
  },
  filters: {
    id: 'Number',
  },
}, {
  name: 'photos',
  fields: {
    id: 'Serial!',
    url: 'Image!',
  },
}]

const App = () => {
  return (
    <OTFUploadContext.Provider value={{ getUploadUrl: () => Promise.resolve('https://test') }}>
      <Admin
        authProvider={authProvider}
        dataProvider={dataProvider}
      >
        {factory.generateResourceList(RESOURCES)}
      </Admin>
    </OTFUploadContext.Provider>
  )
}

export default App
