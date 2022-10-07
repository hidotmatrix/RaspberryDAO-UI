import React from 'react';
import styles from './viewNFT.module.css';
import { Link } from 'react-router-dom';
import Dummy from '../Dummy.svg';
import {BsArrowLeftCircle, BsArrowRightCircle}from 'react-icons/bs';

function viewNFT() {
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
                    <img src={Dummy} alt="Dummy-Image"></img>
                </div>
                <div className={styles.mainimage}>
                    <img src={Dummy} alt="Dummy-Image"></img>
                </div>
                <div className={styles.rightimage}>
                    <img src={Dummy} alt="Dummy-Image"></img>
                </div>
                <div className={styles.rightarrow}>
                    <BsArrowRightCircle/>
                </div>
            </div>
        </div>
    )
}

export default viewNFT