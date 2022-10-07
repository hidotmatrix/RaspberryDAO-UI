import React from "react";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar.jsx";
// import Card from "../components/Card";
import { Sidebar } from "../components/Sidebar";
import Heading from "../components/Heading.jsx";
import { fetchProposalData } from "../utils/governace/governance-interaction.js";
import CardList from "../components/CardList.jsx";
import {
  checkFundReleaseFromTreasury,
  checkTreasuryAddress,
  checkTreasuryName,
  checkTreasurySymbol,
  fundsInsideTreasury,
} from "../utils/governace/governance-interaction";
import Spinner from "../utils/Spinner/Spinner.jsx";

const Home = () => {
  const [proposalDataArray, setProposalDataArray] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [isRendering, setRendering] = useState(false);
  const [funds, setFunds] = useState("Fetching data");
  const [name, setName] = useState("Fetching data");
  const [symbol, setSymbol] = useState("Fetching data");
  const [released, setReleased] = useState("Fetching data");
  const [address, setAddress] = useState("Fetching data");

  let getData = () => {
    setLoading(true)
    fetchProposalData()
      .then((result) => {
        setProposalDataArray(result);
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    let fetch = async () => {
      setName(await checkTreasuryName());
      setSymbol(await checkTreasurySymbol());
      setAddress(await checkTreasuryAddress());
      setFunds(await fundsInsideTreasury());
      setReleased(await checkFundReleaseFromTreasury());
    };
    fetch();
  });

  console.log(proposalDataArray);
  console.log(`
      funds: ${String(funds)}
      name: ${String(name)}
      symbol: ${String(symbol)}
      released: ${String(released)}
      address: ${String(address)}
    `);

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
            loading ? <Spinner/> : <CardList proposalDataArray={proposalDataArray} />
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
