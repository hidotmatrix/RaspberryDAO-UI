import React from "react";

const About = () => {
  return (
    <div>
      <>
        <div className="mx-auto mt-5 max-w-xl text-xl text-gray-50">
          <h1> <b> About </b> </h1>
        </div>
        <div
          className="mx-auto mt-2 block p-6 m-2 max-w-xl rounded-lg border shadow-md "
          style={{ borderColor: "#2d2d2d" }}
        >
          <h1 className=" text-gray-50 text-lg font-semibold">Network</h1>
          <p className="font-normal text-gray-400">Polygon Mumbai testnet</p>

          <h1 className=" text-gray-50 text-lg font-semibold mt-4">
            Proposal Validation
          </h1>
          <p className="font-normal text-gray-400 ">1. Queue</p>
          <p className="font-normal text-gray-400 ">2. Execute</p>

          <h1 className=" text-gray-50 text-lg font-semibold mt-4">
            Voting Strategy
          </h1>
          <p className="font-normal text-gray-400 ">ERC20</p>

        </div>
        <div>
          <ul
            className="mx-auto max-w-xl mt-5 text-lg font-medium text-gray-900  rounded-lg border border-gray-600 text-white"
            style={{ borderColor: "#2d2d2d" }}
          >
            <li
              className="py-2 px-4 w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600"
              style={{ borderColor: "#2d2d2d" }}
            >
              Admins
            </li>
            <li
              className="flex flex-row py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600"
              style={{ borderColor: "#2d2d2d" }}
            >
              <img
                src="https://mdbootstrap.com/img/new/standard/city/047.jpg"
                className=" h-8 w-8 rounded-full"
                alt=""
                style={{ marginRight: "10px" }}
              />
              0x35EA...14B7
            </li>
          </ul>
        </div>
        <div>
          <ul
            className="mx-auto max-w-xl mt-5 mb-5 text-lg font-medium text-gray-900  rounded-lg border border-gray-200  border-gray-600 text-white"
            style={{ borderColor: "#2d2d2d" }}
          >
            <li
              className="py-3 px-4 w-full rounded-t-lg border-b border-gray-600"
              style={{ borderColor: "#2d2d2d" }}
            >
              Authors
            </li>
            <li
              className="flex flex-row py-3 px-4 w-full border-b border-gray-600"
              style={{ borderColor: "#2d2d2d" }}
            >
              <img
                src="https://mdbootstrap.com/img/new/standard/city/041.jpg"
                className=" h-8 w-8 rounded-full"
                alt=""
                style={{ marginRight: "10px" }}
              />
              0x47f8...32a1
            </li>
            <li
              className="flex flex-row py-3 px-4 w-full border-b border-gray-600"
              style={{ borderColor: "#2d2d2d" }}
            >
              <img
                src="https://mdbootstrap.com/img/new/standard/city/042.jpg"
                className=" h-8 w-8 rounded-full"
                alt=""
                style={{ marginRight: "10px" }}
              />
              abvavgjoe.eth
            </li>
            <li
              className="flex flex-row py-3 px-4 w-full border-b border-gray-600"
              style={{ borderColor: "#2d2d2d" }}
            >
              <img
                src="https://mdbootstrap.com/img/new/standard/city/043.jpg"
                className=" h-8 w-8 rounded-full"
                alt=""
                style={{ marginRight: "10px" }}
              />
              redvan.eth
            </li>
            <li
              className="flex flex-row py-3 px-4 w-full border-b border-gray-600"
              style={{ borderColor: "#2d2d2d" }}
            >
              <img
                src="https://mdbootstrap.com/img/new/standard/city/044.jpg"
                className=" h-8 w-8 rounded-full"
                alt=""
                style={{ marginRight: "10px" }}
              />
              grendel.eth
            </li>
            <li
              className="flex flex-row py-3 px-4 w-full border-b border-gray-600"
              style={{ borderColor: "#2d2d2d" }}
            >
              <img
                src="https://mdbootstrap.com/img/new/standard/city/045.jpg"
                className=" h-8 w-8 rounded-full"
                alt=""
                style={{ marginRight: "10px" }}
              />
              frogmonkee.eth
            </li>
            <li
              className="flex flex-row py-3 px-4 w-full border-b border-gray-600"
              style={{ borderColor: "#2d2d2d" }}
            >
              <img
                src="https://mdbootstrap.com/img/new/standard/city/046.jpg"
                className=" h-8 w-8 rounded-full"
                alt=""
                style={{ marginRight: "10px" }}
              />
              icedcool.eth
            </li>
          </ul>
        </div>
      </>
    </div>
  );
};

export default About;
