import React, { useEffect, useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { Card, CardBody, AbsoluteCenter, Box } from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Divider,
} from "@chakra-ui/react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../components/dataStore";

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
  const [RevokeAddress, setRevokeAddress] = useState("");
  const [address, setAddress] = useState("");
  const [cidData, setCidData] = useState([]);

  const notifyforRevoke = () =>
    toast(`Revoked access for ${RevokeAddress}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      type: "success",
    });

  const notifyforAC = () =>
    toast(`Applied access Controls for ${CIDForAC}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      type: "success",
    });

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

    notifyforAC();
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
    const addressToRevoke = [RevokeAddress];
    console.log(addressToRevoke);
    const ownerSignedMessage = sig.signedMessage;

    const response = await lighthouse.revokeFileAccess(
      ownerPublicKey,
      addressToRevoke,
      CID,
      ownerSignedMessage
    );
    console.log(response);

    notifyforRevoke();
  };

  function downloadBlob() {
    const a = document.createElement("a");
    a.href = fileURL;
    a.download = "my-file";
    a.click();
    window.URL.revokeObjectURL(fileURL);
  }

  useEffect(() => {
    getUserAddress();
  }, []);

  useEffect(() => {
    getCids();
  }, [address]);

  const getUserAddress = async () => {
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
      console.log(address);
      setAddress(address);
    }
  };

  const getCids = async () => {
    try {
      if (address) {
        const ref = doc(db, "UsersCIDs", `${address}`);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data().cid);
          setCidData(docSnap.data().cid);
        } else {
          console.log("No such document!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="w-screen">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="flex flex-col w-5/6 justify-center mx-auto mt-10">
          <TableContainer className="mb-10 justify-center mx-auto">
            <Table variant="simple">
              <TableCaption>CIDs for the user</TableCaption>
              <Thead>
                <Tr>
                  <Th fontSize="3xl">CIDs</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cidData ? (
                  cidData.map((data) => {
                    return (
                      <Tr>
                        <Td>
                          <a href={`/dashboard/${data}`} className="text-blue-500 cursor-pointer text-2xl">{data}</a>
                        </Td>
                      </Tr>
                    );
                  })
                ) : (
                  <div></div>
                )}
              </Tbody>
            </Table>
          </TableContainer>
          <Box position="relative" padding="10">
            <Divider />
            <AbsoluteCenter bg="" px="4">
              <p className="text-slate-500">Some Functions</p>
            </AbsoluteCenter>
          </Box>
          <div className="flex align-middle mt-10">
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
                        <a
                          href={fileURL}
                          target="_blank"
                          className="mt-5 bg-blue-500 px-6 py-1 rounded-xl text-white mx-3"
                        >
                          View File
                        </a>
                        <button
                          onClick={() => downloadBlob()}
                          className="mt-5 border-blue-500 border px-6 py-1 mx-3 rounded-xl"
                        >
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
                  <div className="flex flex-col">
                    <p className="text-blue-500 text-4xl text-center">
                      Revoke Access
                    </p>
                    <p className="mt-7 text-2xl">File CID</p>
                    <input
                      className="border border-black mt-4 px-3 w-full py-1.5 rounded-xl"
                      type="text"
                      onChange={(e) => setCID(e.target.value)}
                    ></input>
                    <p className="mt-7 text-2xl">Address of user</p>
                    <input
                      className="border border-black mt-4 px-3 w-full py-1.5 rounded-xl"
                      type="text"
                      placeholder="address from which access is being revoked"
                      onChange={(e) => setRevokeAddress(e.target.value)}
                    ></input>
                    <button
                      onClick={() => revoke()}
                      className="px-9 py-2 bg-blue-500 text-white text-xl w-full mx-auto rounded-xl mt-6"
                    >
                      Revoke Access
                    </button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
          <div className="mt-14 mb-10 w-2/3 mx-auto">
            <Card align="center" variant="elevated" size="lg">
              <CardBody>
                <div className="flex flex-col">
                  <p className="text-blue-500 text-4xl text-center">
                    Apply Access Controls
                  </p>
                  <p className="mt-7 text-2xl">File CID for access controls</p>
                  <input
                    className="border border-black mt-4 px-3 w-full py-1.5 rounded-xl"
                    type="text"
                    onChange={(e) => setCIDforAC(e.target.value)}
                  ></input>
                  <p className="mt-7 text-2xl">Chain</p>
                  <select
                    value={ACconditions.chain}
                    onChange={(e) => {
                      setACconditions({
                        ...ACconditions,
                        chain: e.target.value,
                      });
                    }}
                    className="mt-4 text-xl bg-gray-100 px-3 py-2 rounded-xl cursor-pointer"
                  >
                    <option value={"FVM"}>FVM</option>
                    <option value={"Mumbai"}>Mumbai</option>
                    <option value={"Ethereum"}>Ethereum</option>
                    <option value={"Optimism"}>Optimism</option>
                  </select>
                  <p className="mt-7 text-2xl">Method</p>
                  <input
                    className="border border-black mt-4 px-3 w-full py-1.5 rounded-xl"
                    type="text"
                    placeholder="eg. balanceOf, getBalance, getBlockNumber"
                    value={ACconditions.method}
                    onChange={(e) => {
                      setACconditions({
                        ...ACconditions,
                        method: e.target.value,
                      });
                    }}
                  ></input>
                  <p className="mt-7 text-2xl">Contract Type</p>
                  <select
                    value={ACconditions.ContractType}
                    onChange={(e) => {
                      setACconditions({
                        ...ACconditions,
                        ContractType: e.target.value,
                      });
                    }}
                    className="mt-4 text-xl bg-gray-100 px-3 py-2 rounded-xl cursor-pointer"
                  >
                    <option value={"Custom"}>Custom</option>
                    <option value={"ERC721"}>ERC721</option>
                    <option value={"ERC20"}>ERC20</option>
                  </select>
                  <p className="mt-7 text-2xl">Contract Address</p>
                  <input
                    className="border border-black mt-4 px-3 w-full py-1.5 rounded-xl"
                    type="text"
                    placeholder=""
                    value={ACconditions.contractAddress}
                    onChange={(e) => {
                      setACconditions({
                        ...ACconditions,
                        contractAddress: e.target.value,
                      });
                    }}
                  ></input>
                  <div className="flex">
                    <div className="mx-2">
                      <p className="mt-7 text-2xl">Comparator</p>
                      <select
                        value={ACconditions.comparator}
                        onChange={(e) => {
                          setACconditions({
                            ...ACconditions,
                            comparator: e.target.value,
                          });
                        }}
                        className="mt-4 text-xl bg-gray-100 px-3 py-2 rounded-xl cursor-pointer text-center"
                      >
                        <option value={"=="}>==</option>
                        <option value={"!="}>!=</option>
                        <option value={">"}>greater than</option>
                        <option value={"<"}>less than</option>
                      </select>
                    </div>
                    <div className="mx-2">
                      <p className="mt-7 text-2xl">Value</p>
                      <input
                        className="border border-black mt-4 px-3 w-full py-1.5 rounded-xl"
                        type="text"
                        placeholder=""
                        value={ACconditions.value}
                        onChange={(e) => {
                          setACconditions({
                            ...ACconditions,
                            value: e.target.value,
                          });
                        }}
                      ></input>
                    </div>
                  </div>
                  <button
                    onClick={() => applyAccessConditions()}
                    className="px-9 py-2 bg-blue-500 text-white text-xl w-full mx-auto rounded-xl mt-6"
                  >
                    Apply Access Controls
                  </button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
