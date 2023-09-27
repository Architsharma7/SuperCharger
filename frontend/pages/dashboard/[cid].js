import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  depositFunds,
  getPODSIdetails,
  registerRaasJob,
} from "../../components/raasApiMethods";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { writeContract, readContract } from "@wagmi/core";
import { parseEther, toBytes, stringToBytes, toHex, formatEther } from "viem";
import {
  RAAS_HANDLER_ABI,
  RAAS_HANDLER_ADDRESS,
} from "../../constants/contracts";
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
  Box,
} from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { DB } from "@dataprograms/repdao-polybase";
import { ToastContainer, toast } from "react-toastify";

const Cid = () => {
  const router = useRouter();
  const { cid } = router.query;
  const [podsiDealInfo, setPodsiDealInfo] = useState();
  const [minerLocations, setMinerLocation] = useState(null);
  const [raasjob, setRaasJob] = useState({
    type: "",
    copies: "",
    enddate: "",
    aggregator: "lighthouse",
    epochs: "",
  });
  const [raasDeals, setRaasDeals] = useState({
    jobstatus: "",
    amountspent: "",
    amountdeposited: "",
    renew: "",
    repair: "",
    replication: "",
  });

  const [amount, setAmount] = useState("");
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    getpodsiData();
    getRaasDeals(cid);
  }, [cid]);

  function formatBigInt(bigInt) {
    const numberString = bigInt.toString();
    const formattedNumber = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedNumber;
  }

  const notify1 = () => {
    toast(`Deal made and sent to miner`, {
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
  };

  const notify2 = (url) => {
    toast(`Deposited ${url}`, {
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
  };

  const getRaasDeals = async (cid) => {
    if (!cid) return;
    const data = await publicClient.readContract({
      address: RAAS_HANDLER_ADDRESS,
      abi: RAAS_HANDLER_ABI,
      functionName: "getRaasData",
      args: [`${toHex(cid)}`],
    });
    console.log(data);
    setRaasDeals({
      jobstatus: data.jobStatus,
      amountdeposited: formatEther(data.totalAmountDeposited),
      amountspent: formatEther(data.totalAmountSpent),
      renew: formatBigInt(data.totalRenewJobsDone),
      repair: formatBigInt(data.totalRepairJobsDone),
      replication: formatBigInt(data.totalReplicationJobsDone),
    });
  };

  const getpodsiData = async () => {
    if (!cid) return;
    const data = await getPODSIdetails(cid);
    console.log(data);
    setPodsiDealInfo(data);
    // getMinerLocation(data);
  };

  const getMinerLocation = async (podsiDealInfo) => {
    try {
      if (podsiDealInfo.dealInfo) {
        const doc = await DB.collection("ground_control_sp_location")
          .where(
            "provider",
            "==",
            `${podsiDealInfo.dealInfo[0].storageProvider}`
          )
          .limit(1)
          .get();
        let finalData = [];
        await doc.data.forEach((e) => {
          finalData.push(e.data);
        });
        console.log(finalData);
        setMinerLocation(finalData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const depositFunds = async (cid, value) => {
    try {
      const data = await publicClient.simulateContract({
        account,
        address: RAAS_HANDLER_ADDRESS,
        abi: RAAS_HANDLER_ABI,
        functionName: "depositFunds",
        args: [`${toHex(cid)}`],
        value: parseEther(value),
      });
      if (!walletClient) {
        return;
      }
      console.log(account);
      const tx = await walletClient.writeContract(data.request);
      console.log("Transaction Sent");
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });
      console.log(transaction);
      // notify2(transaction)
    } catch (error) {
      console.log(error);
    }
  };

  // const register = async (_cid, _endDate, _Copies, _aggregator, _epoch) => {
  //   const requestReceivedTime = new Date();
  //   // Default end date is 1 month from the request received time
  //   const defaultEndDate = requestReceivedTime.setMonth(
  //     requestReceivedTime.getMonth() + 1
  //   );
  //   console.log(defaultEndDate);
  //   console.log(requestReceivedTime);
  //   console.log(Date.now());

  //   console.log(raasjob);
  // };

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
        <div className="flex justify-center mx-auto mt-10">
          <p className="text-3xl text-blue-500">File Details and RAAS</p>
        </div>
        <div className="w-11/12 flex justify-center mx-auto mt-6">
          <div className="w-1/2 mt-10 mx-5">
            <div className="flex flex-col">
              <TableContainer className="mb-4 justify-center mx-auto">
                <Table variant="simple">
                  <Tbody>
                    <Tr>
                      <Td>CID</Td>
                      <Td>
                        <a
                          href={`https://gateway.lighthouse.storage/ipfs/${cid}`}
                          target="_blank"
                          className="px-2 py-0.5 bg-slate-200 rounded-lg cursor-pointer"
                        >
                          view
                        </a>{" "}
                        {cid}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Total Repair Jobs</Td>
                      <Td>{raasDeals.repair && raasDeals.repair}</Td>
                    </Tr>
                    <Tr>
                      <Td>Total Renew Jobs</Td>
                      <Td>{raasDeals.renew && raasDeals.renew}</Td>
                    </Tr>
                    <Tr>
                      <Td>Total Replication Job</Td>
                      <Td>{raasDeals.replication && raasDeals.replication}</Td>
                    </Tr>
                    <Tr>
                      <Td>Total Amount Spent</Td>
                      <Td>{raasDeals.amountspent && raasDeals.amountspent}</Td>
                    </Tr>
                    <Tr>
                      <Td>Miner ID</Td>
                      <Td>
                        {podsiDealInfo &&
                          (podsiDealInfo.dealInfo.length
                            ? podsiDealInfo.dealInfo[0].storageProvider
                            : `not found`)}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Geo Location of Miner</Td>
                      <Td>{minerLocations ? minerLocations : `null`}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <Accordion allowToggle>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        See PODSI Details
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <TableContainer className="">
                      <Table variant="simple">
                        {podsiDealInfo && (
                          <Tbody>
                            <Tr>
                              <Td>Car File Size</Td>
                              <Td>
                                {podsiDealInfo.carFileSize &&
                                  podsiDealInfo.carFileSize}
                              </Td>
                            </Tr>
                            <Tr>
                              <Td>piece CID</Td>
                              <Td>
                                {podsiDealInfo.pieceCID &&
                                  podsiDealInfo.pieceCID}
                              </Td>
                            </Tr>
                            <Tr>
                              <Td>ID</Td>
                              <Td>
                                {podsiDealInfo.proof && podsiDealInfo.proof.id}
                              </Td>
                            </Tr>
                            <Tr>
                              <Td>Last Updated</Td>
                              <Td>
                                {podsiDealInfo.proof &&
                                  podsiDealInfo.proof.lastUpdate}
                              </Td>
                            </Tr>
                            <Tr>
                              <Td>Piece Size</Td>
                              <Td>
                                {podsiDealInfo.proof && podsiDealInfo.pieceSize}
                              </Td>
                            </Tr>
                            <Tr>
                              <Td>Proof Index</Td>
                              <Td>
                                {podsiDealInfo.proof &&
                                  podsiDealInfo.proof.fileProof.inclusionProof
                                    .proofIndex.index}
                              </Td>
                            </Tr>
                            <Tr>
                              <Td>Verifier ID</Td>
                              <Td>
                                {podsiDealInfo.proof &&
                                  podsiDealInfo.proof.fileProof.verifierData
                                    .commPc}
                              </Td>
                            </Tr>
                          </Tbody>
                        )}
                      </Table>
                    </TableContainer>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </div>
            <Card className="mt-10 mb-10">
              <CardBody>
                <div className="flex flex-col">
                  <p className="text-blue-500 text-2xl text-center">
                    Deposit Funds
                  </p>
                  <div className="mt-5">
                    <p className="text-xl">Amount</p>
                    <input
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                      className="border border-black mt-4 px-3 w-full py-1.5 rounded-xl"
                      type="number"
                      placeholder="amount in FIL"
                      value={amount}
                    ></input>
                  </div>
                  <div className="mt-5 w-full flex">
                    <button
                      onClick={() => {
                        depositFunds(cid, amount);
                      }}
                      className="text-blue-500 border border-blue-500 px-10 py-2 rounded-xl mx-auto text-center items-center"
                    >
                      Deposit
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          <Divider orientation="vertical" />
          <div className="w-1/2 mt-10 mx-14">
            <div className="flex flex-col">
              <Card>
                <CardBody>
                  <div className="flex flex-col">
                    <p className="text-blue-500 text-2xl text-center">
                      Attach RAAS
                    </p>
                    <div className="mt-5">
                      <p className="text-xl">Job Type</p>
                      <select
                        value={raasjob.type}
                        onChange={(e) => {
                          setRaasJob({
                            ...raasjob,
                            type: e.target.value,
                          });
                        }}
                        className="mt-4 text-xl w-full bg-gray-100 px-3 py-2 rounded-xl cursor-pointer"
                      >
                        <option value={"replication"}>Replication</option>
                        <option value={"renew"}>Renew</option>
                        <option value={"repair"}>Repair</option>
                        <option value={"all"}>All</option>
                      </select>
                      <div className="mt-5">
                        <p className="text-xl">Number of Copies</p>
                        <input
                          onChange={(e) => {
                            setRaasJob({
                              ...raasjob,
                              copies: e.target.value,
                            });
                          }}
                          className="border border-black mt-4 px-3 w-full py-1.5 rounded-xl"
                          type="number"
                          placeholder=""
                          value={raasjob.copies}
                        ></input>
                      </div>
                      <div className="mt-5">
                        <p className="text-xl">End Date</p>
                        <input
                          onChange={(e) => {
                            setRaasJob({
                              ...raasjob,
                              enddate: e.target.value,
                            });
                          }}
                          className="border border-black mt-4 px-3 w-full py-1.5 rounded-xl"
                          type="date"
                          placeholder=""
                          value={raasjob.enddate}
                        ></input>
                      </div>
                      <div className="mt-5">
                        <p className="text-xl">Aggregator</p>
                        <input
                          onChange={(e) => {
                            setRaasJob({
                              ...raasjob,
                              aggregator: e.target.value,
                            });
                          }}
                          className="border border-black mt-4 px-3 w-full py-1.5 rounded-xl"
                          type="text"
                          placeholder=""
                          value={raasjob.aggregator}
                        ></input>
                      </div>
                      <div className="mt-5">
                        <p className="text-xl">Epochs</p>
                        <input
                          onChange={(e) => {
                            setRaasJob({
                              ...raasjob,
                              epochs: e.target.value,
                            });
                          }}
                          className="border border-black mt-4 px-3 w-full py-1.5 rounded-xl"
                          type="number"
                          placeholder=""
                          value={raasjob.epochs}
                        ></input>
                      </div>
                      <div className="mt-5 w-full flex">
                        <button
                          onClick={() => {
                            registerRaasJob(
                              cid,
                              raasjob.enddate,
                              raasjob.copies,
                              raasjob.aggregator,
                              raasjob.epochs
                            );
                            // notify1();
                          }}
                          className="text-blue-500 border border-blue-500 px-10 py-2 rounded-xl mx-auto text-center items-center"
                        >
                          Attach
                        </button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cid;
