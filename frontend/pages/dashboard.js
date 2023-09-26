import React, { useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { Card, CardBody, AbsoluteCenter, Box } from "@chakra-ui/react";

const Dashboard = () => {
  const [account, setAccount] = useState("");
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

  const router = useRouter();
  const [CID, setCID] = useState("");
  const [fileURL, setFileURL] = useState(null);
  const [userAccount, setUserAccount] = useState("");

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

  const decrypt = async () => {
    console.log(CID);
    const { publicKey, signedMessage } = await encryptionSignature();
    const keyObject = await lighthouse.fetchEncryptionKey(
      CID,
      publicKey,
      signedMessage
    );

    const fileType = "image/jpeg";
    const decrypted = await lighthouse.decryptFile(
      CID,
      keyObject.data.key,
      fileType
    );
    console.log(decrypted);
    const url = URL.createObjectURL(decrypted);
    setFileURL(url);
    console.log(url);
  };

  const revoke = async () => {
    const sig = await encryptionSignature();
    const ownerPublicKey = sig.publicKey;
    const addressToRevoke = [];
    const fileCID = CID;
    const ownerSignedMessage = sig.signedMessage;

    const response = await lighthouse.revokeFileAccess(
      ownerPublicKey,
      addressToRevoke,
      fileCID,
      ownerSignedMessage
    );
    console.log(response);
  };

  function downloadBlob() {
    const a = document.createElement('a');
    a.href = fileURL;
    a.download = "my-file";
    a.click();
    window.URL.revokeObjectURL(fileURL);
  }

  return (
    <div>
      <div className="w-screen">
        <div className="flex flex-col w-5/6 justify-center mx-auto mt-10">
          <div className="flex">
            <div className="w-1/2 mx-10">
              <Card align="center" variant="elevated" size="lg">
                <CardBody>
                  <div className="flex flex-col">
                    <p className="text-blue-500 text-4xl text-center">
                      Decrypt a &nbsp;File
                    </p>
                    <p className="mt-7 text-2xl">File CID</p>
                    <input
                      className="border border-black mt-4 px-3 w-full py-1.5 rounded-xl"
                      type="text"
                      onChange={(e) => setCID(e.target.value)}
                    ></input>
                    <button
                      onClick={() => decrypt()}
                      className="px-9 py-2 bg-blue-500 text-white text-xl w-2/3 mx-auto rounded-xl mt-6"
                    >
                      Decrypt
                    </button>
                    {fileURL ? (
                      <div className="flex justify-between">
                        <a href={fileURL} target="_blank" className="mt-5 bg-blue-500 px-6 py-1 rounded-xl text-white mx-3">
                          View File
                        </a>
                        <button onClick={() => downloadBlob()} className="mt-5 border-blue-500 border px-6 py-1 mx-3 rounded-xl">
                          Download File
                        </button>
                      </div>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            </div>
            <div className="w-1/2 mx-10">
              <Card align="center" variant="elevated" size="lg">
                <CardBody>
                  <div className="flex flex-col text-center">
                    <p className="text-blue-500 text-4xl">Miner ID</p>
                    <p className="mt-4 text-2xl">1672627</p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
