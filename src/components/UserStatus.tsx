import { Button, Flex, HStack, Text } from '@chakra-ui/react'
import { logout } from 'thin-backend'
import { useCurrentUser, useIsLoggedIn } from 'thin-backend/react'

function UserStatus() {
  const user = useCurrentUser()
  const isLoggedIn = useIsLoggedIn()

  return (
    <HStack alignItems='center'>
      <Text as='span' fontSize='sm' color='green.100'>
        {isLoggedIn && user ? user.email : ''}
      </Text>
      <Button onClick={async () => logout()} colorScheme='green' size='sm'>
        {isLoggedIn ? 'Logout' : 'Login'}
      </Button>
    </HStack>
  )
}

export default UserStatus
