import React, { useEffect, useState } from 'react'
import { 
    Text,
    Box,
    Center,
    Stack,
    Button,
    Flex, 
    Spacer,
    Image,
} from '@chakra-ui/react'

import { ethers } from "ethers";
import contractAbi from './SmartVoteABI.json';

function Vote() {
    const contractAddress = process.env.REACT_APP_SMARTVOTE_ADDRESS; //goerli

    const [candidats, setCandidats] = useState([]);
    const [electeur, setElecteur] = useState([]);

    const [voteOuvert, setVoteOuvert] = useState(true);

    useEffect(() => {
        getCandidats();
        getElecteur();
    }, []);

    const getVoteOuvert = async () => {
        if(typeof window.ethereum !== 'undefined'){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractAbi, provider);
            try {
                const txVoteOuvert = await contract.getVoteStarted();
                setVoteOuvert(txVoteOuvert);
            } catch (err) {
                console.log(err);
                setVoteOuvert(false);
            }
        }
    }

    const getCandidats = async () => {
        if(typeof window.ethereum !== 'undefined'){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractAbi, provider);

            try {
                await getVoteOuvert();

                const c = await contract.getCandidats();

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
                try{
                    //si les votes sont ouvert, on peut voter
                    if(voteOuvert) {
                        await requestAccount();
                        const provider = new ethers.providers.Web3Provider(window.ethereum);
                        const signer = provider.getSigner();
                        const contract = new ethers.Contract(contractAddress, contractAbi, signer);
                        const tx = await contract.vote(param);
                        await tx.wait();
                        alert("A voté !");
                        window.location.reload();
                    }
                    else{
                        alert("Vous ne pouvez pas encore voter");
                    }
                    
                }
                catch(err){
                    console.log(err);
                }
            }
        }
        else{
            alert("Vous avez déjà voté !");
        }
    }

    function TabVotesCandidats() {
        return (
            <>
                <Flex w="min-content" m="0 auto">
                    {candidats.map((candidat) => (
                        <Box m="8" border="1px solid" borderColor="gray.400" w="300px" borderRadius="lg">
                        <Box w="100%" h="200px" bg="gray.400" borderTopRadius="lg">
                            <Image objectFit='cover' src={candidat.props[4]}></Image>
                        </Box>
                        <Box p="6">
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
                                {voteOuvert? (
                                    <Button size="md" onClick={() => voter(candidat.i)}>Vote</Button>
                                ) : (null)}
                                
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
                    {voteOuvert? (
                        <Stack spacing={4}>
                            <Button colorScheme='teal' size='xs' onClick={getCandidats} >Actualiser</Button>
                        </Stack>
                    ) : (<Text color='tomato'>Les votes n'ont pas encore commencé ! </Text>)}
                    
                </Center>
            </Box>
            <TabVotesCandidats/>
        </div>
    ) 
}

export default Vote;