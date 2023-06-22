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
      <Navigation />
      <Box maxW={'1200px'} mx={'auto'} py={{ base: 2 }} px={{ base: 4 }}>
        {children}
      </Box>
    </>
  )
}

export default AppLayout
