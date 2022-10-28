import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork, useContract, useProvider } from "wagmi";
import { Alchemy, Network } from "alchemy-sdk";
import styles from './viewNFT.module.css';
import { Link } from 'react-router-dom';
import Dummy from '../Dummy.svg';
import {BsArrowLeftCircle, BsArrowRightCircle}from 'react-icons/bs';
import { TREASURY_CONTRACT_ADDRESS } from '../constants/constants';

function ViewNFT() {
    const [userNFTs, setUserNFTs] = useState([]);
    const {address} = useAccount()
    const { chain } = useNetwork();
    const [img1,setImg1] = useState("")
    const [img2,setImg2] = useState("")
    const [img3,setImg3] = useState("")
    useEffect(() => {
        async function fetchData() {
          let config;
          if (chain) {
            switch (chain.network) {
              case "homestead":
                config = {
                  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
                  network: Network.ETH_MAINNET,
                };
                break;
              case "matic":
                config = {
                  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
                  network: Network.MATIC_MAINNET,
                };
                break;
              case "rinkeby":
                config = {
                  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
                  network: Network.ETH_RINKEBY,
                };
                break;
              case "maticmum":
                config = {
                  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
                  network: Network.MATIC_MUMBAI,
                };
                break;
              case "Godwoken Testnet":
                config = {};
                break;
            }
    
            try {
              if (chain.network === "maticmum") { 
                const alchemy = new Alchemy(config);
                // Wallet address
              //  const address = "elanhalpern.eth"; // static address
              const address = TREASURY_CONTRACT_ADDRESS
    
                // Get all NFTs
                const nfts = await alchemy.nft.getNftsForOwner(address);
                setUserNFTs(nfts["ownedNfts"]);
                // Parse output
                let numNfts = nfts["totalCount"];
                const nftList = nfts["ownedNfts"];  
                if(numNfts%2!==0){
                    numNfts-=1;
                }
                if(numNfts>2){
                   setImg1(nftList[numNfts/2-1].media[0].gateway)
                   setImg2(nftList[numNfts/2].media[0].gateway)
                   setImg3(nftList[numNfts/2+1].media[0].gateway)
                }
                else {
                  setImg1(Dummy)
                  setImg2(Dummy)
                  setImg3(Dummy)
                }
            } else {}
            } catch (error) {}
          }
        }
        fetchData();
      }, [chain, userNFTs]);
    return (
        <div className={styles.nftbox}>
            <div className={styles.nftheadingandview}>
                <div className={styles.nftheading}>NFT's</div>
                <Link to='/view'>
                    <div className={styles.view}>View &#62;</div>
                </Link>
            </div>
            <div className={styles.images}>
                <div className={styles.leftarrow}>
                    <BsArrowLeftCircle/>
                </div>
                <div className={styles.leftimage}>
                    <img src={img1} alt="Dummy-Image"></img>
                </div>
                <div className={styles.mainimage}>
                    <img src={img2} alt="Dummy-Image"></img>
                </div>
                <div className={styles.rightimage}>
                    <img src={img3} alt="Dummy-Image"></img>
                </div>
                <div className={styles.rightarrow}>
                    <BsArrowRightCircle/>
                </div>
            </div>
        </div>
    )
}

export default ViewNFT;