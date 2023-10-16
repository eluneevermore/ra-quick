import { Layout, LayoutProps } from 'react-admin'
import Menu from './Menu'

const AppLayout = (props: LayoutProps) => <Layout
  {...props}
  menu={Menu}
/>

export default AppLayout
