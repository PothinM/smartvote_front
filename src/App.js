import React from 'react'
import { 
  ChakraProvider, 
  theme, 
  Heading, 
  Text, 
  Box,
  Badge,
  Flex,
  Spacer,
  Button,
  SimpleGrid,
  Link,
  ButtonGroup,
  calc
} from '@chakra-ui/react'
import { 
  WarningIcon
} from '@chakra-ui/icons'
import { ColorModeSwitcher } from './ColorModeSwitcher' //switch mode dark/light

//ethers
import { ethers } from "ethers";
import contractAbi from './SmartVoteABI.json';

//state/effect
import { useEffect, useState } from "react";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home';
import Vote from './Vote';
import Resultats from './Resultats';
import CarteElectorale from './CarteElectorale';

import { Footer } from './Footer';


function TopHeading() {
  return (
    <Box maxW="2xl" m="0 auto">
      <Heading as="h1" textAlign="center" fontSize="7xl" mt="100px">
        Find a Home Away from Home
      </Heading>
      <Text fontSize="xl" textAlign="center" mt="30px">
        We are the world's leading home rental service with over 10 thousand home owners matched
        with customers annually
      </Text>
      <Text
        w="fit-content"
        p="4"
        px="50px"
        bg="blue.300"
        borderRadius="10px"
        m="0 auto"
        mt="8"
        fontWeight="bold"
        color="white"
        fontSize="xl"
      >
        Get Started
      </Text>
    </Box>
  )
}

// const NavBar = ({haveMetamask, isConnected}) => (
//   <Flex>
//     <Box p="2">
//       <Heading size="md">
//         <Button colorScheme='teal' variant='ghost'>
//           <Link href='/'>
//             Smart Vote
//           </Link>
//         </Button>
//       </Heading>
//     </Box>
//     <Spacer />
//     <Box>
//       {haveMetamask? (
//         <p>pasOk</p>
//       ) : (
//         <p>Ok</p>
//       )}
//       {isConnected? (
//         <Button colorScheme="teal" mr="4">
//           isncr
//         </Button>
//       ) : (
//         <Button colorScheme="teal">conn</Button>
//       )}
//       <Button colorScheme="teal" mr="4">
//         Sign Up
//       </Button>
//       <Button colorScheme="teal">Log in</Button>
//       <ColorModeSwitcher justifySelf="flex-end" />
//     </Box>
//   </Flex>
// )

function Candidats() {
  return (
    <>
      <Text fontSize="5xl" fontWeight="bold" textAlign="center" mt="100px" mb="30px">
        Candidats
      </Text>
      <Flex w="min-content" m="0 auto">
        <Destination />
        <Destination />
        <Destination />
      </Flex>
    </>  
  ) 
}

function Destination() {
  return (
    <Box m="8" border="1px solid" borderColor="gray.400" w="300px" borderRadius="lg">
      <Box w="100%" h="200px" bg="gray.100" borderTopRadius="lg"></Box>
      <Box p="4">
        <Badge fontSize="0.8em" colorScheme="red">
          Popular
        </Badge>
        <Text fontSize="2xl" fontWeight="bold">
          Brawhala
        </Text>
        <Text fontSize="xs" mb="6">
          Toronto, Canada
        </Text>
        <Flex>
          <Text fontSize="xs">Starting at $50/day</Text>
          <Spacer />
          <Button size="xs">Expand</Button>
        </Flex>
      </Box>
    </Box>
  )
}

function TopDestinations() {
  return (
    <>
      <Text fontSize="5xl" fontWeight="bold" textAlign="center" mt="100px" mb="30px">
        Top Destinations
      </Text>
      <Flex w="min-content" m="0 auto">
        <Destination />
        <Destination />
        <Destination />
      </Flex>
    </>  
  )
}

function RightFeature() {
  return (
    <Box mt={20}>
      <SimpleGrid columns={2}>
        <Box>
          <Box w="100%" m="0 auto" maxW="400px" h="300px" bg="gray.50"></Box>
        </Box>
        <Box>
          <Text fontSize="5xl" fontWeight="bold" maxW="600px">
            We house you very quickly
          </Text>
          <Text mt={4} maxW="600px">
            Using state of the art technology, we are able to match groups to the perfect housing
            that they need based on the size of the home needed, the features they require from the
            home and their budget.
          </Text>
          <Text color="blue.600" mt={4} fontSize="sm">
            How we match users
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  )
}

/*function Footer() {
  return (
    <Box mt={20} mb={12}>
      <Text fontSize="4xl" mt={12} fontWeight="bold" textAlign="center">
        Smart Vote
      </Text>
      <Text
        fontSize="2xl"
        textAlign="center"
        maxW="800px"
        m="0 auto"
        borderBottom="1px #bbb solid"
        mt={4}
        pb={10}
      >
        Le vote n'a jamais été aussi simple !
      </Text>
      <SimpleGrid columns={2} w="max-content" gap={20} m="0 auto" mt={6}>
        <Text>Condition d'utilisation</Text>
        <Text>Assistance</Text>
      </SimpleGrid>
    </Box>
  )
}*/


function App() {
  const contractAddress = process.env.REACT_APP_SMARTVOTE_ADDRESS; //goerli
  
  const { ethereum } = window;

  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isInscrit, setIsInscrit] = useState(false);
  const [nftMinted, setMinted] = useState(false);

  useEffect(() => {
    connectWallet();
}, []);
  
  const connectWallet = async () => {
    try {
      if (!ethereum) {
        sethaveMetamask(false);
        alert('Pour utiliser Smart Vote vous devez installer Metamask');
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccountAddress(accounts[0]);
      setIsConnected(true);

      const contract = new ethers.Contract(contractAddress, contractAbi, provider);
      const c = await contract.getElecteur(accounts[0]);
      if(c[0].toString() !== "0"){
        setIsInscrit(true);
        if(c.mintOk){
          setMinted(true);
        }
      }
      else{
        setIsInscrit(false);
      }
        console.log(c.mintOk);
        console.log(c[0].toString());

    } catch (error) {
      setIsConnected(false);
    }
  }

  const NavBar = () => (
    <Flex>
      <Box p="2">
        <Heading size="md">
          <Button colorScheme='teal' variant='ghost'>
            <a href='/'>
              Smart Vote
            </a>
          </Button>
          <ButtonGroup variant='outline' spacing='6'>
            {!isInscrit? (
              <Button colorScheme="teal" >
                <a href='/CarteElectorale'>
                  Inscription
                </a>
              </Button>
              ) : (
              null
            )}
            {!nftMinted & isInscrit? (
                <Button colorScheme="teal" >
                  <a href='/CarteElectorale'>
                    Carte Electorale
                  </a>
                </Button>
              ) : (null)}
            {isInscrit & nftMinted? (
              <Button colorScheme="teal" >
                <a href='/Vote'>
                  Vote
                </a>
              </Button>
            ): (null) }
            <Button colorScheme="teal" >
              <a href='/Resultats'>
                Resultats
              </a>
            </Button>
          </ButtonGroup>
        </Heading>
      </Box>
      <Spacer />
      <Box p="2">
        {isConnected? (
          <Text fontSize='sm'>🎉 Connected as {accountAddress.slice(0, 4)}...{accountAddress.slice(38, 42)}</Text>
        ) : (
          <Button colorScheme="teal" onClick={connectWallet}>Connexion</Button>
        )}
      </Box>
      <ColorModeSwitcher justifySelf="flex-end" />
    </Flex>
  )

  //{candidatsPage ? (<Candidats/>) : null}
  //{votePage ? (<Voter/>) : null}
  /*
  <TopHeading />
  <TopDestinations />
  <RightFeature />
  */
  return (
    <ChakraProvider theme={theme}>
      <div className='content-container'>
        <Router>
          <NavBar />
          <Routes>
            <Route exact path='/' element={<Home/>} />
            {isInscrit & !nftMinted? (
              <Route path='/CarteElectorale' element={<CarteElectorale/>} />
            ) : (null)}
            {isInscrit & nftMinted? (
              <Route path='/Vote' element={<Vote/>} />
            ) : (null)}
            <Route path='/Resultats' element={<Resultats/>} />
          </Routes>
        </Router>
      </div>
      <div className='footer--pin'>
        <Footer/>
      </div>
      
      
    </ChakraProvider>
  )
}

export default App

// import React from 'react';
// import {
//   ChakraProvider,
//   Box,
//   Text,
//   Link,
//   VStack,
//   Code,
//   Grid,
//   theme,
// } from '@chakra-ui/react';
// import { ColorModeSwitcher } from './ColorModeSwitcher';
// import { Logo } from './Logo';

// function App() {
//   return (
//     <ChakraProvider theme={theme}>
//       <Box textAlign="center" fontSize="xl">
//         <Grid minH="100vh" p={3}>
//           <ColorModeSwitcher justifySelf="flex-end" />
//           <VStack spacing={8}>
//             <Logo h="40vmin" pointerEvents="none" />
//             <Text>
//               Edit <Code fontSize="xl">src/App.js</Code> and save to reload.
//             </Text>
//             <Link
//               color="teal.500"
//               href="https://chakra-ui.com"
//               fontSize="2xl"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Learn Chakra
//             </Link>
//           </VStack>
//         </Grid>
//       </Box>
//     </ChakraProvider>
//   );
// }

// export default App;
