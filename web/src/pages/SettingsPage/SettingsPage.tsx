import { Heading } from '@chakra-ui/react'

import { MetaTags } from '@redwoodjs/web'

import { useLocaleRedirect } from 'src/hooks/useLocaleRedirect'

const SettingsPage = ({ locale }) => {
  useLocaleRedirect({ locale })
  return (
    <>
      <MetaTags title="Settings" description="Settings page" />
      <Heading as="h1" size="2xl" py={4}>
        Settings
      </Heading>
    </>
  )
}

export default SettingsPage
