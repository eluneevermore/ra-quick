import { Layout, LayoutProps } from 'react-admin'
import Menu from './Menu'

export const AppLayout = (props: LayoutProps) => <Layout
  {...props}
  menu={Menu}
/>

export default AppLayout
