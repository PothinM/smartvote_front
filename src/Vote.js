import React, { useEffect, useState } from 'react'
import { 
    Text,
    Box,
    Center,
    Stack,
    Button,
    Flex, 
    Spacer
} from '@chakra-ui/react'

import { ethers } from "ethers";
import contractAbi from './SmartVoteABI.json';

function Vote() {
    const contractAddress = process.env.REACT_APP_SMARTVOTE_ADDRESS; //goerli

    const [candidats, setCandidats] = useState([]);
    const [electeur, setElecteur] = useState([]);

    useEffect(() => {
        getCandidats();
        getElecteur();
    }, []);

    const getCandidats = async () => {
        if(typeof window.ethereum !== 'undefined'){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractAbi, provider);

            try {
                const c = await contract.getCandidats();
                console.log(c);

                const res = [];
                for (let index = 0; index < c.length; index++) {
                    res.push({i: index, props: c[index]});
                }
                setCandidats(res);
            }
            catch(err) {
                console.log(err);
            }
        }
    }

    const getElecteur = async () => {
        if(typeof window.ethereum !== 'undefined'){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractAbi, provider);

            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });
                const c = await contract.getElecteur(accounts[0]);
                setElecteur(c);
            }
            catch(err) {
                console.log(err);
            }
        }
    }

    async function requestAccount(){
        await window.ethereum.request({method: 'eth_requestAccounts'});
    }
    
      
    const voter = async (param) => {
        if(!electeur.voteOk){
            if(typeof window.ethereum !== 'undefined'){
                console.log(electeur.voteOk);
                try{
                    await requestAccount();
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    console.log(signer);
                    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
                    const tx = await contract.vote(param);
                    await tx.wait();
                }
                catch(err){
                    console.log(err);
                }
            }
        }
        else{
            alert("Vous avez déjà voté !");
        }
        
        //let txVote = await contract.vote(param);
        //await txVote.wait();

    }


    function TabVotesCandidats() {
        return (
            <>
                <Flex w="min-content" m="0 auto">
                    {candidats.map((candidat) => (
                        <Box m="8" border="1px solid" borderColor="gray.400" w="300px" borderRadius="lg">
                        <Box w="100%" h="200px" bg="gray.100" borderTopRadius="lg"></Box>
                        <Box p="4">
                            <Text fontSize="2xl" fontWeight="bold">
                                {candidat.props[0]} {candidat.props[1]}
                            </Text>
                            <Text fontSize="xs" mb="6">
                                {candidat.props[2]}
                            </Text>
                            <Text fontSize="xs" mb="6">
                                {candidat.props[3]}
                            </Text>
                            <Flex>
                                <Spacer />
                                <Button size="md" onClick={() => voter(candidat.i)}>Vote</Button>
                            </Flex>
                        </Box>
                    </Box>
                    ))}
                </Flex>
                
            </>
        );
    }

    return (
        <div>
            <Box>
                <Text fontSize="5xl" fontWeight="bold" textAlign="center" mt="10px" mb="3px">
                        Candidats : 
                </Text>
                <Center>
                    <Stack spacing={4}>
                        <Button colorScheme='teal' size='xs' onClick={getCandidats} >Actualiser</Button>
                    </Stack>
                </Center>
            </Box>
            <TabVotesCandidats/>
        </div>
    ) 
}

export default Vote;