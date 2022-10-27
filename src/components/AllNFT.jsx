import React, { useEffect, useState } from 'react'
import { useAccount, useNetwork, useContract, useProvider } from "wagmi";
import { Alchemy, Network } from "alchemy-sdk";
import styles from './AllNFT.module.css'
import Dummy from '../Dummy.svg';
import { Link } from 'react-router-dom';
import { TREASURY_CONTRACT_ADDRESS } from '../constants/constants';

function AllNFT() {
    const [userNFTs, setUserNFTs] = useState([]);
    const { chain } = useNetwork();
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
                //const address = "elanhalpern.eth"; // static address
                const address = TREASURY_CONTRACT_ADDRESS
    
                // Get all NFTs
                const nfts = await alchemy.nft.getNftsForOwner(address);
                console.log("NFTs....",nfts)
                setUserNFTs(nfts["ownedNfts"]);
                // Parse output
                let numNfts = nfts["totalCount"];
                const nftList = nfts["ownedNfts"];  
                console.log(`Total NFTs owned by ${address}: ${numNfts} \n`);
            } else {}
            } catch (error) {}
          }
        }
        fetchData();
      }, [chain, userNFTs]);
    return (
        <div className={styles.allnftpage}>
            <div className={styles.collections}>
                <Link to='/Treasury'>
                    <div className={styles.back}> &#60; Back</div>
                </Link>
                <div className={styles.headingandbuttons}>
                    <div className={styles.heading}>
                        NFT's
                    </div>
                    <div className={styles.buttons}>
                        <div className={styles.send}>
                            <button>Send NFT</button>
                        </div>
                        <div className={styles.deposit}>
                            <button>Deposit NFT</button>
                        </div>
                    </div>
                </div>
                <div className={styles.nfts}>
                    
                    {userNFTs.map((nft, index) => {
                  return (
                    nft.media.length!=0? <img key={index} src={nft.media[0].gateway} alt="Dummy-NFT" className={styles.nftimage}></img>: <img key={index}src={Dummy} alt="Dummy-NFT" className={styles.nftimage}></img>
                  );
                })}
                </div>
            </div>
        </div>
    )
}

export default AllNFT