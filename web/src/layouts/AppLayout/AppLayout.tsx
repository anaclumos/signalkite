import { Box } from '@chakra-ui/react'

import Navigation from 'src/components/Navigation/Navigation'
import Seo from 'src/components/Seo/Seo'

type AppLayoutProps = {
  children?: React.ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <Seo />
      <Box
        maxW={'1600px'}
        mx={'auto'}
        h="100dvh"
        py={{ base: 2 }}
        px={{ base: 4 }}
        display={{ base: 'block', md: 'flex' }}
      >
        <Navigation />
        HELLO
        <Box>{children}</Box>
      </Box>
    </>
  )
}

export default AppLayout
