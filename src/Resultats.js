import React, { useEffect, useState } from 'react'
import { 
    Button,
    Text,
    Box,
    Badge,
    Flex,
    Spacer,
    Container,
    Center,
    Stack,
} from '@chakra-ui/react'

import { ethers } from "ethers";
import contractAbi from './SmartVoteABI.json';


function Resultats() {
    const contractAddress = process.env.REACT_APP_SMARTVOTE_ADDRESS; //goerli

    const [votesBlancs, setVotesBlancs] = useState(0);
    const [votes, setVotes] = useState([]);

    const getResultats = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractAbi, provider);

        const resultats = await contract.getResultats();
        console.log(resultats[0].toString());
        setVotesBlancs(resultats[0].toString());

        const candidatVote = await contract.getCandidats();
        console.log(candidatVote);

        const res = [];
        for (let index = 0; index < resultats[1].length; index++) {
            res.push({  prenom: candidatVote[index][0], nom: candidatVote[index][1], partie: candidatVote[index][2], vote: resultats[1][index].toString()});
        }
        setVotes(res);
        console.log(votes);
    }

    useEffect(() => {
        getResultats();
      }, []);

    function TabVotesBlancs() {
        return (
        <p>votes blancs : {votesBlancs}</p>
        );
    }

    function TabVotesCandidats() {
        return (
            <>
                <Flex w="min-content" m="0 auto">
                    {votes.map((user) => (
                        <Box m="8" border="1px solid" borderColor="gray.400" w="300px" borderRadius="lg">
                        <Box w="100%" h="200px" bg="gray.100" borderTopRadius="lg"></Box>
                        <Box p="4">
                            <Text fontSize="2xl" fontWeight="bold">
                            {user.prenom} {user.nom}
                            </Text>
                            <Text fontSize="xs" mb="6">
                            {user.partie}
                            </Text>
                            <Flex>
                            <Text fontSize="xs">{user.vote}</Text>
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
                    <Stack spacing={4}>
                        <Button colorScheme='teal' size='xs' onClick={getResultats}>Actualiser</Button>
                        <TabVotesBlancs/>
                    </Stack>
                </Center>
            </Box>
            <TabVotesCandidats/>
        </div>
    ) 
}

export default Resultats;