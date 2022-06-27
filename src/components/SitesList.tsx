import { Box, Text, Icon, SimpleGrid, HStack } from '@chakra-ui/react'

import type { Site } from 'thin-backend'
import {
  createRecord,
  query,
  initThinBackend,
  ensureIsUser,
  getCurrentUser,
  getCurrentUserId,
  User,
  deleteRecord,
  updateRecord
} from 'thin-backend'
import {
  useQuery,
  useQuerySingleResult,
  useCurrentUser,
  useIsLoggedIn
} from 'thin-backend/react'
import { FaSpinner } from 'react-icons/fa'

import { SiteCard } from './SiteCard'
import { NewSiteButton } from './buttons/Buttons'

export function SitesList() {
  const sites = useQuery(query('sites').orderByDesc('createdAt'))
  const user = useCurrentUser()
  const isLoggedIn = useIsLoggedIn()

  if (sites === null) {
    return (
      <Box>
        <Icon as={FaSpinner} boxSize='3em' />
      </Box>
    )
  }

  return (
    <Box>
      <HStack align='center'>
        <Text as='h1'>Sites</Text>
        {isLoggedIn ? <NewSiteButton aria-label='Add a new site.' /> : null}
      </HStack>
      <Text
        sx={{
          fontSize: { base: '2.8vmin', md: '1.3vmax' },
          lineHeight: { base: '1.2', md: 'inherit' },
          mt: 0,
          mb: 1
        }}
      >
        A few highlights, voted for by the communuty.
      </Text>
      <SimpleGrid columns={[1, 2, 3]} spacing={8}>
        {sites.map((site: Site) => (
          <SiteCard key={site.id} site={site} />
        ))}
      </SimpleGrid>
    </Box>
  )
}
