import React, { useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";

const Dashboard = () => {
  const [file, setFile] = useState([]);
  const [encryptionOn, setEncryptionOn] = useState(false);
  const [account, setAccount] = useState("");
  const [dealParameters, setDealParameters] = useState({
    copies: 2,
    repair_thresh: 28800,
    renew_thresh: 240,
  });
  const [CIDForAC, setCIDforAC] = useState("");
  const [ACconditions, setACconditions] = useState({
    chain: "",
    method: "",
    ContractType: "",
    contractAddress: "",
    comparator: "",
    value: "",
    parameters: "",
    outputType: "",
    inputArrayType: "",
  });

  const uploadFile = async () => {
    const dealParams = {
      num_copies: dealParameters.copies,
      repair_threshold: dealParameters.repair_thresh, // 2880 = 1 day
      renew_threshold: dealParameters.renew_thresh,
      miner: [""], //router.query.miner //"t017840" 
      network: "calibration",
      add_mock_data: 2,
    };

    const response = await lighthouse.upload(
      file,
      process.env.NEXT_PUBLIC_API_KEY,
      false
      /* dealParams*/
    );
    console.log(
      `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`
    );
  };

  const encryptionSignature = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("please install metamask");
    }
    if (ethereum) {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const messageRequested = (await lighthouse.getAuthMessage(address)).data
        .message;
      const signedMessage = await signer.signMessage(messageRequested);
      setAccount(accounts[0]);
      return {
        signedMessage: signedMessage,
        publicKey: address,
      };
    }
  };

  const uploadFileEncrypted = async () => {
    const sig = await encryptionSignature();
    const response = await lighthouse.uploadEncrypted(
      file,
      process.env.NEXT_PUBLIC_API_KEY,
      sig.publicKey,
      sig.signedMessage,
      null //dealParams
    );
    console.log(response.data);
    const { Hash } = response.data[0];
    console.log(`https://gateway.lighthouse.storage/ipfs/${Hash}`);
  };

  const conditionsforAC = () => {
    if (ACconditions.contractAddress == "") {
      return [
        {
          id: 1,
          chain: ACconditions.chain,
          method: ACconditions.method,
          standardContractType: ACconditions.ContractType,
          returnValueTest: {
            comparator: ACconditions.comparator,
            value: ACconditions.value,
          },
          parameters: [ACconditions && ACconditions.parameters],
          outputType: ACconditions.outputType,
          inputArrayType: [ACconditions.inputArrayType],
        },
      ];
    } else {
      return [
        {
          id: 1,
          chain: ACconditions.chain,
          method: ACconditions.method,
          standardContractType: ACconditions.ContractType,
          contractAddress: ACconditions.contractAddress,
          returnValueTest: {
            comparator: ACconditions.comparator,
            value: ACconditions.value,
          },
          parameters: [ACconditions && ACconditions.parameters],
          outputType: ACconditions.outputType,
          inputArrayType: [ACconditions.inputArrayType],
        },
      ];
    }
  };

  const applyAccessConditions = async (e) => {
    const cid = CIDForAC;
    const conditions = conditionsforAC();
    const aggregator = "([1])";
    const { publicKey, signedMessage } = await encryptionSignature();

    const response = await lighthouse.applyAccessCondition(
      publicKey,
      cid,
      signedMessage,
      conditions,
      aggregator
    );

    console.log(response);
  };

  return (
    <div>
      <input onChange={(e) => setFile(e.target.files)} type="file" />
      <button
        onClick={() => {
          encryptionOn ? uploadFileEncrypted(file) : uploadFile(file);
        }}
      >
        Upload
      </button>
      <button onClick={() => setEncryptionOn(!encryptionOn)} className="mx-10">
        Change Encrypiton
      </button>
      <button
        onClick={() => {
          applyAccessConditions();
        }}
      >
        Apply Access Conditions
      </button>
    </div>
  );
};

export default Dashboard;
