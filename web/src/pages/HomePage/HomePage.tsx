import { Box, Button, chakra, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { useLocaleRedirect } from 'src/hooks/useLocaleRedirect'

const HomePage = ({ locale }) => {

  const { t } = useTranslation()

  return (
    <>
      <Box mb={20}>
        <Box as="section" pt="6rem" pb={{ base: '0', md: '5rem' }}>
          <Box
            w="full"
            pb="12"
            pt="3"
            maxW={{ base: 'xl', md: '7xl' }}
            mx="auto"
            px={{ base: '6', md: '8' }}
          />
          <Box textAlign="center">
            <chakra.h1
              maxW="16ch"
              mx="auto"
              fontSize={{ base: '2.25rem', sm: '3rem', lg: '4rem' }}
              fontFamily="heading"
              letterSpacing="tighter"
              fontWeight="extrabold"
              mb="16px"
              lineHeight="1.2"
            >
              {t('homepage.title.main')}
              <br />
              <Box as="span" color="teal.500" _dark={{ color: 'teal.300' }}>
                {t('homepage.title.highlighted')}
              </Box>
            </chakra.h1>
            <Text
              maxW="560px"
              mx="auto"
              color="gray.500"
              _dark={{ color: 'gray.400' }}
              fontSize={{ base: 'lg', lg: 'xl' }}
              mt="6"
            >
              {t('homepage.message')}
            </Text>

            <Stack
              mt="10"
              spacing="4"
              justify="center"
              direction={{ base: 'column', sm: 'row' }}
            >
              <Button
                h="4rem"
                px="40px"
                fontSize="1.2rem"
                as="a"
                size="lg"
                colorScheme="teal"
                cursor={'pointer'}
              >
                {t('homepage.get-started')}
              </Button>
              <Button
                as="a"
                size="lg"
                h="4rem"
                px="40px"
                fontSize="1.2rem"
                href="https://github.com/anaclumos/heimdall"
                target="__blank"
              >
                GitHub
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default HomePage
