import React, { useEffect, useState } from 'react'
import { useAccount, useNetwork, useContract, useProvider, useBalance } from "wagmi";

import { Alchemy, Network } from "alchemy-sdk";
import Backdrop from '../utils/Backdrop/Backdrop'
import styles from './Tokens.module.css'
import logo from '../solana.svg';
import matic from "../polygon.svg"
import cross from './Cross.svg';
const axios = require('axios');


function Tokens(props) {
    const [treasuryTokens, setTreasuryTokens] = useState([]);
    const { chain } = useNetwork();
    const { data, isError, isLoading } = useBalance({
        addressOrName: 'awkweb.eth',
      })
      console.log("Balance",data.formatted)
      const dataObj = {
        bal:data.formatted.slice(0,5),
        symbol:data.symbol
      }
      const dataArr = [dataObj]
    
    useEffect(() => {
        async function fetchData() {
          let config;
          console.log("Chain Network", chain.network);
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
              if (chain.network === "homestead") { 
                setTreasuryTokens(dataArr)
            } else {}
            } catch (error) {}
            console.log("Treasury Tokens", treasuryTokens);
          }
        }
        fetchData();
      }, [chain, treasuryTokens]);
    let arr = [1];
    return (
        <>
            <Backdrop show={props.show} switch={props.switch} />
            <div className={styles.popup}>
                <div className={styles.crossimage} onClick={props.switch}>
                    <img src={cross}></img>
                </div>
                <div className={styles.heading}>
                    <div style={{
                        width: "30px", borderRadius: "100%", marginRight: "10px", position: "relative", height: "20px"
                    }}>
                        <img src={matic} alt="Logo" style={{ zIndex: "10", position: "absolute", width: "30px" }}></img>
                    </div>
                    <div className={styles.head}>Tokens</div>
                    <div className={styles.num}>1</div>
                </div>
                <div className={styles.tokens}>
                    {
                        treasuryTokens.map((token) => {
                            console.log("token",token)
                            return (
                                <div className={styles.tokenname}>
                                    <div className={styles.left}>
                                        <div style={{
                                            width: "30px", borderRadius: "100%", marginRight: "10px", position: "relative", height: "20px"
                                        }}>
                                            <img src={matic} alt="Logo" style={{ zIndex: "10", position: "absolute", width: "30px" }}></img>
                                        </div>
                                        <div className={styles.headname}>Tokens</div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>{token.bal} {token.symbol}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default Tokens