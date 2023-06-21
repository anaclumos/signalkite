// Base code from https://chakra-templates.dev/

import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  useColorMode,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { Link as RedwoodLink, routes } from '@redwoodjs/router'

const WithSubnavigation = () => {
  const { isOpen, onToggle } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  const { i18n, t } = useTranslation()

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'5rem'}
        maxW={'1200px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        m={'auto'}
        align={'center'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Link
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}
            fontWeight={700}
          >
            <RedwoodLink to={routes.home({ locale: i18n.language })}>
              {t('navigation.logo')}
            </RedwoodLink>
          </Link>
          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>
        <IconButton
          bg={useColorModeValue('white', 'gray.800')}
          display={{ base: 'none', md: 'inline-flex' }}
          onClick={toggleColorMode}
          m={2}
          icon={
            colorMode === 'light' ? (
              <MoonIcon color="black" />
            ) : (
              <SunIcon color="white" />
            )
          }
          aria-label="Toggle Color Mode"
        />
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          <Button
            as={'a'}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            href={'#'}
          >
            Sign In
          </Button>
          <Button
            as={'a'}
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'teal.500'}
            href={'#'}
            _hover={{
              bg: 'teal.400',
            }}
          >
            Sign Up
          </Button>
        </Stack>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  )
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const linkHoverColor = useColorModeValue('gray.800', 'white')
  const popoverContentBgColor = useColorModeValue('white', 'gray.700')
  const items = useNavigationItems()
  return (
    <Stack direction={'row'} spacing={4}>
      {items.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? '#'}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  )
}

const DesktopSubNav = ({ label, href, sublabel }: NavItem) => {
  return (
    <Link
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'teal.300' }}
            fontWeight={700}
          >
            {label}
          </Text>
          <Text fontSize={'sm'}>{sublabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'teal.500'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  )
}

const MobileNav = () => {
  const items = useNavigationItems()
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {items.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  )
}

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack mt={2} pl={4} align={'start'}>
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  )
}

type NavItem = {
  label: string
  sublabel?: string
  children?: Array<NavItem>
  href?: string
}

const useNavigationItems = (): Array<NavItem> => {
  const { t } = useTranslation()
  return [
    {
      label: t('navigation.explore.title'),
      children: [
        {
          label: t('navigation.explore.hackernews.label'),
          sublabel: t('navigation.explore.hackernews.sublabel'),
          href: '#',
        },
        {
          label: t('navigation.explore.lobsters.label'),
          sublabel: t('navigation.explore.lobsters.sublabel'),
          href: '#',
        },
        {
          label: t('navigation.explore.diffblog.label'),
          sublabel: t('navigation.explore.diffblog.sublabel'),
          href: '#',
        },
      ],
    },
    {
      label: t('navigation.personal.title'),
      children: [
        {
          label: t('navigation.personal.industry.label'),
          sublabel: t('navigation.personal.industry.sublabel'),
          href: '#',
        },
        {
          label: t('navigation.personal.brand.label'),
          sublabel: t('navigation.personal.brand.sublabel'),
          href: '#',
        },
      ],
    },
    {
      label: t('navigation.pricing'),
      href: '#',
    },
    {
      label: t('navigation.support'),
      href: '#',
    },
  ]
}

export default WithSubnavigation
