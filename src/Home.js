import React from 'react';
import { 
  Text,
  Box,
  Center,
  Stack,
  Button,
} from '@chakra-ui/react'
  
const Home = () => {
  return (
    <div>
        <Box>
            <Text fontSize="5xl" fontWeight="bold" textAlign="center" mt="10px" mb="3px">
                    Accueil
            </Text>
            <Text fontSize="3xl" textAlign="center" mt="10px" mb="3px">
                    Bienvenue sur Smart Vote, l'application de vote démocratique en ligne.
            </Text>
        </Box>
    </div>
  ) 
};
  
export default Home;