// Base code from https://chakra-templates.dev/

import { useRef, useState, useEffect } from 'react'

import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  HamburgerIcon,
} from '@chakra-ui/icons'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Collapse,
  Flex,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { SignIn, useUser, useClerk, SignUp } from '@clerk/clerk-react'
import { useTranslation } from 'react-i18next'

import { Link as RedwoodLink, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

const withUnmountFunction = (WrappedComponent, onUnmount) => {
  return function (props) {
    useEffect(() => {
      return () => {
        if (typeof onUnmount === 'function') {
          onUnmount()
        }
      }
    }, [])
    return <WrappedComponent {...props} />
  }
}

const WithSubnavigation = () => {
  const { isOpen, onToggle } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  const { i18n, t } = useTranslation()
  const { isAuthenticated, signUp } = useAuth()
  const { isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const [signInOpen, setSignInOpen] = useState<boolean>(false)
  const [signUpOpen, setSignUpOpen] = useState<boolean>(false)
  const cancelRef = useRef()
  const SignInWithUnmountFunction = withUnmountFunction(SignIn, () => {
    setSignInOpen(false)
  })
  const SignUpWithUnmountFunction = withUnmountFunction(SignUp, () => {
    setSignUpOpen(false)
  })
  return (
    <>
      {!isSignedIn && (
        <AlertDialog
          isOpen={signInOpen}
          onClose={() => setSignInOpen(false)}
          leastDestructiveRef={cancelRef}
        >
          <AlertDialogOverlay>
            <AlertDialogContent
              bg={'rgba(0, 0, 0, 0)'}
              border={0}
              shadow={'none'}
            >
              <SignInWithUnmountFunction />
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
      {!isSignedIn && (
        <AlertDialog
          isOpen={signUpOpen}
          onClose={() => setSignUpOpen(false)}
          leastDestructiveRef={cancelRef}
        >
          <AlertDialogOverlay>
            <AlertDialogContent
              bg={'rgba(0, 0, 0, 0)'}
              border={0}
              shadow={'none'}
            >
              <SignUpWithUnmountFunction />
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
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
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <RedwoodLink to={routes.home({ locale: i18n.language })}>
              <Text
                textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                fontFamily={'heading'}
                color={useColorModeValue('gray.800', 'white')}
                fontWeight={700}
              >
                {t('navigation.logo')}
              </Text>
            </RedwoodLink>
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
            {isAuthenticated ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Avatar size={'sm'} src={user?.profileImageUrl} />
                </MenuButton>
                <MenuList>
                  <RedwoodLink to={routes.profile({ locale: i18n.language })}>
                    <MenuItem>{t('navigation.profile')}</MenuItem>
                  </RedwoodLink>
                  <RedwoodLink to={routes.settings({ locale: i18n.language })}>
                    <MenuItem>{t('navigation.settings')}</MenuItem>
                  </RedwoodLink>
                  <MenuDivider />
                  <Link
                    onClick={() => signOut()}
                    textDecor={'none'}
                    cursor={'pointer'}
                    _hover={{ textDecor: 'none' }}
                    minW={0}
                  >
                    <MenuItem>{t('navigation.signout')}</MenuItem>
                  </Link>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button
                  as={'a'}
                  fontSize={'sm'}
                  fontWeight={400}
                  variant={'link'}
                  onClick={() => setSignInOpen(!signInOpen)}
                  cursor={'pointer'}
                >
                  {t('navigation.signin')}
                </Button>
                <Button
                  as={'a'}
                  display={{ base: 'none', md: 'inline-flex' }}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  cursor={'pointer'}
                  bg={'teal.500'}
                  _hover={{
                    bg: 'teal.400',
                  }}
                  onClick={() => setSignUpOpen(!signInOpen)}
                >
                  {t('navigation.signup')}
                </Button>
              </>
            )}
          </Stack>
        </Flex>
        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Box>
    </>
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
      _hover={{ bg: useColorModeValue('teal.50', 'gray.900') }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'teal.500' }}
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
          href: '',
        },
        {
          label: t('navigation.explore.lobsters.label'),
          sublabel: t('navigation.explore.lobsters.sublabel'),
          href: '',
        },
        {
          label: t('navigation.explore.diffblog.label'),
          sublabel: t('navigation.explore.diffblog.sublabel'),
          href: '',
        },
      ],
    },
    {
      label: t('navigation.personal.title'),
      children: [
        {
          label: t('navigation.personal.industry.label'),
          sublabel: t('navigation.personal.industry.sublabel'),
          href: '',
        },
        {
          label: t('navigation.personal.brand.label'),
          sublabel: t('navigation.personal.brand.sublabel'),
          href: '',
        },
      ],
    },
    {
      label: t('navigation.pricing'),
      href: '',
    },
    {
      label: t('navigation.support'),
      href: '',
    },
  ]
}

export default WithSubnavigation
