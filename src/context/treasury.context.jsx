import { createContext, useEffect, useState } from "react";

export const TreasuryContext = createContext({
    treasuryArray: null,  
    setTreasuryArray: () => {},
    updateTreasuryArray: () => {}
})

export const TreasuryProvider = ({children}) => {
    const [treasuryArray, setTreasuryArray] = useState([]);

    const updateTreasuryArray = (element) => {
        treasuryArray.push(element);
        setTreasuryArray(treasuryArray)
    }

    useEffect(() => {
        
    })

    let value = {treasuryArray, setTreasuryArray, updateTreasuryArray}

    return (
        <TreasuryContext.Provider value={value}> {children} </TreasuryContext.Provider>
    )
}