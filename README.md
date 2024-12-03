# ra-quick

**ra-quick** is a powerful utility for generating React Admin resources quickly and efficiently from JSON object. With a focus on rapid development, it simplifies the process of creating fields, inputs, filters and actions, while allowing you to easily customize how it is generated.

You can return this JSON object from the server-side to dynamically change the frontend by automatically generating React Admin resources based on the provided data structure. This allows the frontend to adapt to different data models without requiring hard-coded configurations.

## Install:

```
pnpm add ra-quick
```

## Example:

```typescript
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
      permanent: 'Bool',
      until: 'DateTime!',
    },
  }],
  recordActions: [{
    name: 'greeting',
  }, {
    name: 'notify',
    form: {
      content: 'Text!',
      delay: 'Number',
      attachment: 'File',
      type: {
        componentType: 'Enum',
        options: ['promotion', 'push'],
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
```

## Demo:

https://codesandbox.io/p/sandbox/angry-fast-g7nwq6

## Features:

- [x] Fields/Inputs/Filters for Resources from JSON
- [x] List/Record custom actions (with form, import, export)
- [ ] Support React Admin 5
- [ ] data-provider for popular libraries

# Contributing

Contributions are welcome! If you have ideas or feature requests, feel free to submit an issue or pull request.

1. Fork the repository.
2. Create a new branch (git checkout -b feature/your-feature).
3. Make your changes and commit (git commit -am 'Add a new feature').
4. Push to the branch (git push origin feature/your-feature).
5. Open a pull request.
