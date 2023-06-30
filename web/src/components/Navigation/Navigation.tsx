import {
  Box,
  Center,
  HStack,
  List,
  ListItem,
  ListProps,
} from '@chakra-ui/react'
import { useLocation } from '@redwoodjs/router'
import { ReactElement, ReactNode } from 'react'
import { Link as RedwoodLink } from '@redwoodjs/router'
import { FaHackerNews } from 'react-icons/fa6'

export interface RouteItem {
  title: string
  path?: string
}

export interface Routes {
  routes: RouteItem[]
}

export type SidebarContentProps = Routes & {
  pathname?: string
  contentRef?: any
}

type MainNavLinkProps = {
  href: string
  icon: ReactElement
  children: ReactNode
  label?: string
}

const MainNavLink = ({ href, icon, children }: MainNavLinkProps) => {
  return (
    <RedwoodLink to={href}>
      <HStack as="a" spacing="3" fontSize="sm">
        <Center w="6" h="6" borderWidth="1px" rounded="base">
          {icon}
        </Center>
        <span>{children}</span>
      </HStack>
    </RedwoodLink>
  )
}

export const mainNavLinks = [
  {
    icon: <FaHackerNews />,
    href: '/',
    label: 'Hacker News Summarized',
  },
  {
    icon: <FaHackerNews />,
    href: '/',
    label: 'Hacker News Summarized',
  },
  {
    icon: <FaHackerNews />,
    href: '/',
    label: 'Hacker News Summarized',
  },
]

export const MainNavLinkGroup = (props: ListProps) => {
  return (
    <List spacing="4" styleType="none" {...props}>
      {mainNavLinks.map((item) => (
        <ListItem key={item.label}>
          <MainNavLink icon={item.icon} href={item.href} label={item.label}>
            {item.label}
          </MainNavLink>
        </ListItem>
      ))}
    </List>
  )
}

const Sidebar = () => {
  return (
    <Box
      as="nav"
      pos="sticky"
      overscrollBehavior="contain"
      w="280px"
      h="100%"
      overflowY="auto"
      className="sidebar-content"
      flexShrink={0}
      border="1px solid red"
      display={{ base: 'none', md: 'block' }}
    >
      <MainNavLinkGroup mb="10" />
    </Box>
  )
}

export default Sidebar
