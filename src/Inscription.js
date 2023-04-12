import React, { useEffect, useState } from 'react'
import { 
    Text,
    Box,
    Center,
    Stack,
    Button,
    Container,
    Input
} from '@chakra-ui/react'

//ethers
import { ethers } from "ethers";
import contractAbi from './SmartVoteABI.json';


function Inscription() {
    const contractAddress = process.env.REACT_APP_SMARTVOTE_ADDRESS; //goerli

    const [electeur, setElecteur] = useState([]);
    const [noSecuSoc, setNoSecuSoc] = useState();

    const [voteOuvert, setVoteOuvert] = useState(true);

    useEffect(() => {
        getVoteOuvert();
        getElecteur();
    }, []);

    async function requestAccount(){
        await window.ethereum.request({method: 'eth_requestAccounts'});
    }

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

    const inscrir = async () => {
        if(electeur.noSecuSoc.toString() !== 0){
            if(typeof window.ethereum !== 'undefined'){
                try{
                    //si les votes n'ont pas encore commencé, on peut s'inscrire
                    if(!voteOuvert){
                        await requestAccount();
                        const provider = new ethers.providers.Web3Provider(window.ethereum);
                        const signer = provider.getSigner();
                        const contract = new ethers.Contract(contractAddress, contractAbi, signer);
                        const tx = await contract.setElecteur(noSecuSoc);
                        await tx.wait();
                        alert("Vous êtes maintenant inscrit !");
                        window.location.reload();
                    }
                    else {
                        alert("Les votes ont commencé vous ne pouvez donc plus vous inscrire")
                    }
                    
                }
                catch(err){
                    console.log(err);
                }
            }
        }
        else{
            alert("Vous êtes déjà inscrit !");
        }

    }

    return (
        <div>
            <Box>
                <Text fontSize="5xl" fontWeight="bold" textAlign="center" mt="10px" mb="3px">
                        Inscription : 
                </Text>
                <Center>
                    {!voteOuvert? (
                        <Stack spacing={4}>
                            <Input placeholder='Numéro de sécurité social' onChange={e => setNoSecuSoc(e.target.value)} size='md' />
                            <Button colorScheme='teal' size='lg' onClick={inscrir}>S'inscrire</Button>
                        </Stack>
                    ) : (<Text color='tomato'>Les votes ont commencé, vous ne pouvez donc plus vous inscrire ! </Text>)}                    
                </Center>
            </Box>
        </div>
    ) 
}

export default Inscription;