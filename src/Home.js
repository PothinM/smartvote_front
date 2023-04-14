import React from 'react';
import { 
  Text,
  Box,
  Image,
  Center
} from '@chakra-ui/react'

import logo from './logoSmartVote.png';

const Home = () => {
  return (
    <div>
        <Box>
            <Text fontSize="5xl" fontWeight="bold" textAlign="center" mt="10px" mb="3px">
                    Accueil
            </Text>
            <Center>
              <Image src={logo}></Image>
            </Center>
            <Text fontSize="3xl" textAlign="center" mt="10px" mb="3px">
                    Bienvenue sur Smart Vote, l'application de vote démocratique en ligne.
            </Text>
        </Box>
    </div>
  ) 
};
  
export default Home;