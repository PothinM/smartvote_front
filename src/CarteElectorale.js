import React, { useEffect, useState } from 'react'
import { 
    Text,
    Box,
    Center,
    Stack,
    Button,
    Container,
} from '@chakra-ui/react'

//ethers
import { ethers } from "ethers";
import contractAbi from './SmartVoteABI.json';

function CarteElectorale() {
    const contractAddress = process.env.REACT_APP_SMARTVOTE_ADDRESS; //goerli

    const [electeur, setElecteur] = useState([]);

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

    const mint = async () => {
        if(!electeur.mintOk){
            if(typeof window.ethereum !== 'undefined'){
                try{
                    //si les votes ne sont pas ouvert, on peut minter la carte éléctorale
                    if(!voteOuvert){
                        await requestAccount();
                        const provider = new ethers.providers.Web3Provider(window.ethereum);
                        const signer = provider.getSigner();
                        const contract = new ethers.Contract(contractAddress, contractAbi, signer);
                        const tx = await contract.mintCarteElectorale();
                        await tx.wait();
                        alert("Vous avez récupéré votre carte éléctorale !");
                        window.location.reload();
                    }else {
                        alert("Les votes ont commencé vous ne pouvez donc plus récupérer votre carte éléctorale");
                    }
                    
                }
                catch(err){
                    console.log(err);
                }
            }
        }
        else{
            alert("Vous avez déjà récupéré votre carte éléctorale !");
        }
    }


    return (
        <div>
            <Box>
                <Text fontSize="5xl" fontWeight="bold" textAlign="center" mt="10px" mb="3px">
                        Carte Electorale : 
                </Text>
                <Center>
                    {!voteOuvert? (
                        <Stack spacing={4}>
                            <Button colorScheme='teal' size='lg' onClick={mint} >Mint</Button>
                        </Stack>
                    ) : (<Text color='tomato'>Les votes ont commencé, vous ne pouvez donc plus récupérer votre carte éléctorale ! </Text>)}
                </Center>
            </Box>
        </div>
    ) 
}

export default CarteElectorale;