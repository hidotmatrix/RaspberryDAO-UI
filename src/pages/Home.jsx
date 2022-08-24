import React from "react";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar.jsx";
// import Card from "../components/Card";
import { Sidebar } from "../components/Sidebar";
import Heading from "../components/Heading.jsx";
import { fetchProposalData } from "../utils/governace/governance-interaction.js";
import CardList from "../components/CardList.jsx";

const Home = () => {
  const [proposalDataArray, setProposalDataArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRendering, setRendering] = useState(false);

  let getData = () => {
    setLoading(true)
    fetchProposalData()
    .then((result) => {
      setProposalDataArray(result);
      setLoading(false);
    });
  };

  // useEffect(() => {
  //   setRendering(true)
  // })

  useEffect( () => {
    // isRendering && getData();
    getData();
  }, []);

  console.log(proposalDataArray);

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
            
            loading ? null : <CardList proposalDataArray={proposalDataArray} />
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
