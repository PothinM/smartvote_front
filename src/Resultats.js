import React, { useEffect, useState } from 'react'
import { 
    Button,
    Text,
    Box,
    Flex,
    Spacer,
    Center,
    Stack,
    Image
} from '@chakra-ui/react'

import { ethers } from "ethers";
import contractAbi from './SmartVoteABI.json';

function Resultats() {
    const contractAddress = process.env.REACT_APP_SMARTVOTE_ADDRESS; //goerli

    const [votesBlancs, setVotesBlancs] = useState(0);
    const [votes, setVotes] = useState([]);

    const [voteOuvert, setVoteOuvert] = useState(true);

    useEffect(() => {
        getResultats();
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

    const getResultats = async () => {
        if(typeof window.ethereum !== 'undefined'){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractAbi, provider);
            try {
                //on récupère les candidats
                const candidatVote = await contract.getCandidats();

                await getVoteOuvert();
                
                //si les votes sont ouverts, on récupère les résultats
                if(voteOuvert){
                    //puis les résultats
                    const resultats = await contract.getResultats();
                
                    //on assigne les votes blancs
                    setVotesBlancs(resultats[0].toString());

                    //on assigne aux candidats un champs vote avec leurs nombres de votes
                    const res = [];
                    if(resultats.length > 0){
                        for (let index = 0; index < resultats[1].length; index++) {
                            res.push({  prenom: candidatVote[index][0], nom: candidatVote[index][1], partie: candidatVote[index][2], vote: resultats[1][index].toString(), uri: candidatVote[index][4]});
                        }
                    }
                    
                    setVotes(res);
                }

                
            } catch (err) {
                console.log(err);
            }
        }
    }

    
    function TabVotesBlancs() {
        return (
            <p>votes blancs : {votesBlancs}</p>
        );
    }

    function TabVotesCandidats() {
        return (
            <>
                <Flex w="min-content" m="0 auto">
                    {votes.map((candidat) => (
                        <Box m="8" border="1px solid" borderColor="gray.400" w="300px" borderRadius="lg">
                        <Box w="100%" h="200px" bg="gray.400" borderTopRadius="lg">
                            <Image objectFit='cover' src={candidat.uri}></Image>
                        </Box>
                        <Box p="6">
                            <Text fontSize="2xl" fontWeight="bold">
                            {candidat.prenom} {candidat.nom}
                            </Text>
                            <Text fontSize="xs" mb="6">
                            {candidat.partie}
                            </Text>
                            <Flex>
                                {voteOuvert? (
                                    <Text fontSize="xs">{candidat.vote}</Text>
                                ) : (null)}
                                <Spacer />
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
                        Resultats : 
                </Text>
                <Center>
                    {voteOuvert? (
                        <Stack spacing={4}>
                            <Button colorScheme='teal' size='xs' onClick={getResultats}>Actualiser</Button>
                            <TabVotesBlancs/>
                        </Stack>
                    ) : (<Text color='tomato'>Les votes n'ont pas encore commencé ! </Text>)}
                    
                </Center>
            </Box>
            <TabVotesCandidats/>
        </div>
    ) 
}

export default Resultats;