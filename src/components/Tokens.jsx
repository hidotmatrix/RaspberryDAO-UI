import React from 'react'
import Backdrop from '../utils/Backdrop/Backdrop'
import styles from './Tokens.module.css'
import logo from '../solana.svg';
import cross from './Cross.svg';

function Tokens(props) {
    let arr = [1, 2, 3, 4, 5, 6];
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
                        <img src={logo} alt="Logo" style={{ zIndex: "10", position: "absolute", width: "30px" }}></img>
                    </div>
                    <div className={styles.head}>Tokens</div>
                    <div className={styles.num}>6</div>
                </div>
                <div className={styles.tokens}>
                    {
                        arr.map(() => {
                            return (
                                <div className={styles.tokenname}>
                                    <div className={styles.left}>
                                        <div style={{
                                            width: "30px", borderRadius: "100%", marginRight: "10px", position: "relative", height: "20px"
                                        }}>
                                            <img src={logo} alt="Logo" style={{ zIndex: "10", position: "absolute", width: "30px" }}></img>
                                        </div>
                                        <div className={styles.headname}>Tokens</div>
                                    </div>
                                    <div className={styles.right}>
                                        <div>1.81SOL</div>
                                        <div>$52.74</div>
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