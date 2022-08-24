import React from "react";

const Details = () => {
  return (
    <div>
      <div className="mx-auto max-w-2xl">
        <div className=" mt-5  text-3xl font-bold text-gray-50">
          <h1>Grants Commitee Election for S5 and S6</h1>
        </div>
        <div className="mt-5 flex flex-row">
          <button class="bg-green-500 hover:bg-blue-700 text-white font-bold  px-1 rounded-full">
            Active
          </button>
          <img
            src="https://mdbootstrap.com/img/new/standard/city/041.jpg"
            class=" h-6 w-6 ml-2 rounded-full"
            alt=""
          />
          <p className=" font-medium text-gray-400 ml-2">
            BanklessDao by icedcool.eth
          </p>
          <button class=" hover:bg-blue-700 text-gray-400 font-bold  px-1 rounded-full">
            Core
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
