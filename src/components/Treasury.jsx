import React, { useEffect, useState } from "react";

import {
  checkFundReleaseFromTreasury,
  checkTreasuryAddress,
  checkTreasuryName,
  checkTreasurySymbol,
  fundsInsideTreasury,
} from "../utils/governace/governance-interaction";

const Treasury = () => {
  const [funds, setFunds] = useState("Fetching data");
  const [name, setName] = useState("Fetching data");
  const [symbol, setSymbol] = useState("Fetching data");
  const [released, setReleased] = useState("Fetching data");
  const [address, setAddress] = useState("Fetching data");

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

  console.log(`
    funds: ${String(funds)}
    name: ${String(name)}
    symbol: ${String(symbol)}
    released: ${String(released)}
    address: ${String(address)}
  `);

  return (
    <div>
      <div className="mx-auto" style={{ width: "500px" }}>
        <div className=" mt-10 text-2xl mx-auto  display: contents text-gray-50">
          <h1>
            {" "}
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
        <a
          href="#"
          className="block p-6 m-2 max-w-2xl    rounded-lg border shadow-md hover:bg-gray-700"
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
                {" "}
                {String(name)} ({String(symbol)}){" "}
              </p>
            </div>

            <button className="bg-green-500 hover:bg-blue-700 text-white font-bold  px-3 rounded-full">
              ERC20
            </button>
          </div>
          <h5 className="mb-2 text-2xl font-bold tracking-tight  text-white group-hover:text-gray-400"></h5>
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
        </a>
      </div>
    </div>
  );
};

export default Treasury;
