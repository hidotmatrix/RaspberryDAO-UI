import React from "react";
import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useNetwork,
  useSigner,
  useContractRead,
  useContractReads,
  useContract,
  useContractEvent
} from 'wagmi'
import { Navbar } from "../components/Navbar.jsx";
// import Card from "../components/Card";
import { Sidebar } from "../components/Sidebar";
import Heading from "../components/Heading.jsx";
import { fetchProposalData } from "../utils/governace/governance-interaction.js";
import CardList from "../components/CardList.jsx";
import {
  checkTreasuryAddress,
  checkTreasuryName,
  checkTreasurySymbol,
  fundsInsideTreasury,
} from "../utils/governace/governance-interaction";
import Spinner from "../utils/Spinner/Spinner.jsx";
import ABI from "../contracts/Governance.json"
import { GOVERNANCE_CONRACT_ADDRESS } from "../constants/constants.js";

const Home = () => {

  const {data: signer} = useSigner();
  
  const provider = signer?.provider;

  useContractEvent({
    addressOrName: GOVERNANCE_CONRACT_ADDRESS,
    contractInterface: ABI.abi,
    eventName: 'ProposalCreated',
    listener: (event) => {
    },
  })


  const [proposalDataArray, setProposalDataArray] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [isRendering, setRendering] = useState(false);
  const [funds, setFunds] = useState("Fetching data");
  const [name, setName] = useState("Fetching data");
  const [symbol, setSymbol] = useState("Fetching data");
  const [released, setReleased] = useState("Fetching data");
  const [addressUser, setAddress] = useState("Fetching data");

  const { isConnected } = useAccount()
  const { chain } = useNetwork()

 

  useEffect( () => {
    let fetch = async () =>{
      if(isConnected){
        setName(await checkTreasuryName());
        setSymbol(await checkTreasurySymbol());
        setAddress(await checkTreasuryAddress());
        setFunds(await fundsInsideTreasury());
        const data = await fetchProposalData()
        setProposalDataArray(data);
        setLoading(false)
      }
    };
    fetch()
  
  }, [isConnected]);
  return (
    <div>
      <Navbar />
      <div className="flex flex-col md:flex-row justify-center">
        <div className="flex flex-col">
          <Sidebar />
        </div>
        <div className="flex flex-col">
          <Heading />
          {
            loading ? <Spinner/> : <CardList proposalDataArray={proposalDataArray} provider = {provider} />
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
