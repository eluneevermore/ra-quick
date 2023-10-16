import { DashboardMenuItem, Menu, MenuProps, ResourceMenuItem, useResourceDefinitions, useSidebarState } from 'react-admin'
import { styled } from '@mui/material'
import MuiAccordion from '@mui/material/Accordion'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import type { AccordionProps } from '@mui/material/Accordion'
import type { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import { groupBy } from '../../utils'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters defaultExpanded elevation={0} square {...props} />
))(({ theme }) => ({
  '&:not(:last-child)': {
    borderBottom: `1px solid ${theme.palette.divider} !important`,
  },
  '&:before': {
    display: 'none',
  },
}))

const AccordionSummary = ({ children, ...props }: AccordionSummaryProps) => {
  const [open] = useSidebarState()
  return (
    <MuiAccordionSummary
      expandIcon={<ExpandMoreIcon />}
      {...props}
    >
      {open ? children : null}
    </MuiAccordionSummary>
  )
}

const getDefaultChildren = ({ hasDashboard }: { hasDashboard: boolean | undefined }) => {
  const resources = useResourceDefinitions()
  const resourceNames = Object.keys(resources).filter(name => resources[name].hasList)
  const { root, ...resourceGroups } = groupBy(resourceNames, (name: string) =>
    resources[name].options?.menuGroup ?? 'root')

  return [
    hasDashboard ? (
      <DashboardMenuItem key="default-dashboard-menu-item" />
    ) : null,
    Object.entries(resourceGroups || {}).map(([groupName, resourceName]) => (
      <Accordion key={groupName}>
        <AccordionSummary>{groupName}</AccordionSummary>
        {resourceName.map(name => (
          <ResourceMenuItem key={name} name={name} />
        ))}
      </Accordion>
    )),
    (root || []).map(name => (
      <ResourceMenuItem key={name} name={name} />
    ))
  ]
}

const AppMenu = (props: MenuProps) => {
  const {
    hasDashboard,
    children = getDefaultChildren({ hasDashboard }),
  } = props
  return (
    <Menu {...props}>
      {children}
    </Menu>
  )
}

export default AppMenu
