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
  calc,
  Center
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
import Inscription from './Inscription';

import { Footer } from './Footer';


function App() {
  const contractAddress = process.env.REACT_APP_SMARTVOTE_ADDRESS; //goerli
  
  const { ethereum } = window;

  const [accountAddress, setAccountAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isInscrit, setIsInscrit] = useState(false);
  const [nftMinted, setMinted] = useState(false);
  const [noSecuSoc, setNoSecuSoc] = useState(0);
  const [OnMumbai, setOnMumbai] = useState(false);

  useEffect(() => {
    connectWallet();
  }, []);

  if (ethereum) {
    ethereum.on('accountsChanged', function (accounts) {
      window.location.reload(true);
    })
    ethereum.on('chainChanged', (_chainId) => window.location.reload());
  }
  
  
  const connectButton = () => {
    //si metamask est détécté, et si le network est mumbai : on se connecte, sinon message alert
    if(ethereum){
      if(ethereum.networkVersion !== "80001"){
        alert('Pour utiliser Smart Vote vous devez être sur Mumbai');
      }
      else{
        connectWallet();
      }
    }
    else{
      alert('Pour utiliser Smart Vote vous devez installer Metamask');
    }
  }

  const connectWallet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccountAddress(accounts[0]);
      setIsConnected(true);

      const contract = new ethers.Contract(contractAddress, contractAbi, provider);
      const c = await contract.getElecteur(accounts[0]);
      
      //si l'élécteur a un numéro de sécu alors il est inscrit, le bool inscrit passe à true
      if(c[0].toString() !== "0"){
        setIsInscrit(true);
        setNoSecuSoc(c.noSecuSoc.toString());
        //si l'élécteur a mintOk à true, alors il est inscrit & a sa carte elec, le bool passe à true
        if(c.mintOk){
          setMinted(true);
        }
      }
      else {
        setIsInscrit(false);
      }

      setOnMumbai(true);
    } catch (error) {
      setIsConnected(false);
      setOnMumbai(false);

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
          {OnMumbai? (
            <ButtonGroup variant='outline' spacing='6'>
            {!isInscrit? (
              <Button colorScheme="teal" >
                <a href='/Inscription'>
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
              <Center>
                {noSecuSoc > 0 ? (<Text fontSize='sm'>Compte lié à {noSecuSoc}</Text>)
                : (<Text fontSize='sm'>Vous n'êtes pas encore inscrit</Text>)}
              </Center>
            </ButtonGroup>
          ) : (null)}
          
        </Heading>
      </Box>
      <Spacer />
      <Box p="2">
        {isConnected? (
          <Text fontSize='sm'>🎉 Connecté en tant que {accountAddress.slice(0, 4)}...{accountAddress.slice(38, 42)}</Text>
        ) : (
          <Button colorScheme="teal" onClick={connectButton}>Connexion</Button>
        )}
      </Box>
      <ColorModeSwitcher justifySelf="flex-end" />
    </Flex>
  )

  return (
    <ChakraProvider theme={theme}>
      <div className='content-container'>
        <Router>
          <NavBar />
          <Routes>
            <Route exact path='/' element={<Home/>} />
            {!isInscrit & !nftMinted? (
              <Route path='/Inscription' element={<Inscription/>} />
            ) : (null)}
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
