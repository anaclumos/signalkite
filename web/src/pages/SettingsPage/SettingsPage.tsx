import { Heading } from '@chakra-ui/react'

import { MetaTags } from '@redwoodjs/web'

const SettingsPage = () => {
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
