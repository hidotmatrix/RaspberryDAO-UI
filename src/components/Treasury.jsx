import React, { useEffect, useState } from "react";
import {
  checkTreasuryAddress,
  checkTreasuryName,
  checkTreasurySymbol,
  fundsInsideTreasury,
} from "../utils/governace/governance-interaction";
import logo from '../solana.svg';
import matic from "../polygon.svg"
import Tokens from "./Tokens";

const Treasury = () => {
  const [funds, setFunds] = useState("Fetching data");
  const [name, setName] = useState("Fetching data");
  const [symbol, setSymbol] = useState("Fetching data");
  const [released, setReleased] = useState("Fetching data");
  const [address, setAddress] = useState("Fetching data");
  const [view, setView] = useState(false);

  useEffect(() => {
    let fetch = async () => {
      setName(await checkTreasuryName());
      setSymbol(await checkTreasurySymbol());
      setAddress(await checkTreasuryAddress());
      setFunds(await fundsInsideTreasury());
    };
    fetch();
  });

  console.log(`
    funds: ${String(funds)}
    name: ${String(name)}
    symbol: ${String(symbol)}
    released: ${String(released)}
    address: ${String(address)}
  `);

  const change = () => {
    setView(false);
  };

  return (
    <>
      {view ? <Tokens show={view} switch={change}/> : null}
      <div>
        <div className="mx-auto" style={{ width: "500px" }}>
          <div className="mt-20 text-2xl mx-auto  display: contents text-gray-50">
            <h1 style={{ marginBottom: "16px", marginTop: "10px" }}>
              <b> Treasury </b>
            </h1>
          </div>
          <div
            className=" mt-2 block p-6 m-2 mx-auto max-w-2xl rounded-lg border shadow-md hover:bg-gray-100"
            style={{ borderColor: "#2d2d2d" }}
          >
            <p className="font-normal text-gray-400 mx-auto max-w-2xl text-center">
              <b> Available Treasuries </b>
            </p>
          </div>
          <div
            className="block p-6 max-w-2xl rounded-lg border shadow-md hover:bg-gray-700"
            style={{ borderColor: "#2d2d2d" }}
          >
            <div className="mb-3 flex flex-row justify-between">
              <div className="flex flex-row">
                <img
                  src="https://mdbootstrap.com/img/new/standard/city/041.jpg"
                  className=" h-6 w-6 rounded-full"
                  alt=""
                />
                <p className=" font-medium text-gray-400 ml-2">
                  {String(name)} ({String(symbol)})
                </p>
              </div>
              <button className="bg-green-500 hover:bg-blue-700 text-white font-bold  px-3 rounded-full">
                ERC20
              </button>
            </div>
            <div className="flex flex-row justify-between">
              <div>
                {/* <h5 className="mb-2 text-2xl font-bold tracking-tight  text-white group-hover:text-gray-400"></h5> */}
                <p className="font-normal text-gray-400">
                  <b> Treasury Address: </b> {String(address).substring(0, 5)}...
                  {String(address).substring(35, 40)}
                </p>
                <p className="font-normal text-gray-400">
                  <b> Funds Inside Treasury: </b> {String(funds)} Ξ
                </p>
                <p className="font-normal text-gray-400">
                  <b> Funds Released: </b> {String(released)}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{
                    width: "24px", borderRadius: "100%", backgroundColor: "black", marginRight:
                      "6px", position: "relative", height: "22px", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <img src={matic} alt="Logo" style={{ zIndex: "10", position: "absolute", width: "16px" }}></img>
                  </div>
                  <div style={{
                    width: "24px", borderRadius: "100%", backgroundColor: "black", marginRight:
                      "6px", position: "relative", height: "22px", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <img src={matic} alt="Logo" style={{ zIndex: "10", position: "absolute", width: "16px" }}></img>
                  </div>
                  <div style={{
                    width: "24px", borderRadius: "100%", backgroundColor: "black", marginRight:
                      "6px", position: "relative", height: "22px", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <img src={matic} alt="Logo" style={{ zIndex: "10", position: "absolute", width: "16px" }}></img>
                  </div>
                  <div style={{ color: "white", fontSize: "10px" }}>+3</div>
                </div>
                <div style={{ color: "white", marginTop: "6px", fontSize: "12px", cursor: "pointer", textDecoration:"underline",textUnderlineOffset:"2px"}} onClick={() => setView(true)}>
                  View All
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Treasury;
