import { Heading } from '@chakra-ui/react'

import { MetaTags } from '@redwoodjs/web'

import { useLocaleRedirect } from 'src/hooks/useLocaleRedirect'

const ProfilePage = ({ locale }) => {
  useLocaleRedirect({ locale })
  return (
    <>
      <MetaTags title="Profile" description="Profile page" />
      <Heading as="h1" size="2xl" noOfLines={2} py={4}>
        Profile
      </Heading>
    </>
  )
}

export default ProfilePage
