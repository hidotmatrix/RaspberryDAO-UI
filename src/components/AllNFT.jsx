import React from 'react'
import styles from './AllNFT.module.css'
import Dummy from '../Dummy.svg';
import { Link } from 'react-router-dom';

function AllNFT() {
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
                    <img src={Dummy} alt="Dummy-NFT" className={styles.nftimage}></img>
                    <img src={Dummy} alt="Dummy-NFT" className={styles.nftimage}></img>
                    <img src={Dummy} alt="Dummy-NFT"></img>
                    <img src={Dummy} alt="Dummy-NFT" className={styles.nftimage}></img>
                    <img src={Dummy} alt="Dummy-NFT" className={styles.nftimage}></img>
                    <img src={Dummy} alt="Dummy-NFT"></img>
                </div>
            </div>
        </div>
    )
}

export default AllNFT