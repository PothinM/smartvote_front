import React from 'react'
import { 
    Text,
    Box,
    Center,
    Stack,
    Button,
    Container,
} from '@chakra-ui/react'


function CarteElectorale() {
    return (
        <div>
            <Box>
                <Text fontSize="5xl" fontWeight="bold" textAlign="center" mt="10px" mb="3px">
                        Carte Electorale : 
                </Text>
                <Center>
                    <Stack spacing={4}>
                        <Button colorScheme='teal' size='lg' >Mint</Button>
                    </Stack>
                </Center>
            </Box>
        </div>
    ) 
}

export default CarteElectorale;