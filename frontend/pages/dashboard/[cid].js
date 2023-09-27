import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getPODSIdetails,
  registerRaasJob,
} from "../../components/raasApiMethods";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { parseEther, toBytes, stringToBytes, toHex } from "viem";
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
  const { address: account } = useAccount();
  const publicClient = usePublicClient();

  useEffect(() => {
    getpodsiData();
    getRaasDeals(cid);
  }, [cid]);

  const getRaasDeals = async (cid) => {
    if (!cid) return;
    const data = await publicClient.readContract({
      address: `0xC37175181265D75ed04f28f3c027cC5fAceF5dAd`,
      abi: RAAS_HANDLER_ABI,
      functionName: "getRaasData",
      args: [`${toHex(cid)}`],
    });
    console.log(data);
  };

  const getpodsiData = async () => {
    if (!cid) return;
    const data = await getPODSIdetails(cid);
    console.log(data);
    setPodsiDealInfo(data);
    console.log(data);
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

  return (
    <div>
      <div className="w-screen">
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
                      <Td>{cid}</Td>
                    </Tr>
                    <Tr>
                      <Td>Total Repair Jobs</Td>
                      <Td>centimetres (cm)</Td>
                    </Tr>
                    <Tr>
                      <Td>Total Renew Jobs</Td>
                      <Td>metres (m)</Td>
                    </Tr>
                    <Tr>
                      <Td>Total Replication Job</Td>
                      <Td>metres (m)</Td>
                    </Tr>
                    <Tr>
                      <Td>Total Amount Spent</Td>
                      <Td>metres (m)</Td>
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
                        <Tbody>
                          {/* <Tr>
                            <Td>Car File Size</Td>
                            <Td>
                              {podsiDealInfo && podsiDealInfo.carFileSize}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td>piece CID</Td>
                            <Td>{podsiDealInfo && podsiDealInfo.pieceCID}</Td>
                          </Tr>
                          <Tr>
                            <Td>ID</Td>
                            <Td>{podsiDealInfo && podsiDealInfo.proof.id}</Td>
                          </Tr>
                          <Tr>
                            <Td>Last Updated</Td>
                            <Td>
                              {podsiDealInfo && podsiDealInfo.proof.lastUpdate}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td>Piece Size</Td>
                            <Td>{podsiDealInfo && podsiDealInfo.pieceSize}</Td>
                          </Tr>
                          <Tr>
                            <Td>Proof Index</Td>
                            <Td>
                              {podsiDealInfo &&
                                podsiDealInfo.proof.fileProof.inclusionProof
                                  .proofIndex.index}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td>Verifier ID</Td>
                            <Td>{podsiDealInfo && podsiDealInfo.proof.fileProof.verifierData.commPc}</Td>
                          </Tr> */}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </div>
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
                        <option value={"Replication"}>Replication</option>
                        <option value={"Renew"}>Renew</option>
                        <option value={"Repair"}>Repair</option>
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
                          onClick={() =>
                            registerRaasJob(
                              cid,
                              raasjob.enddate,
                              raasjob.copies,
                              raasjob.aggregator,
                              raasjob.epochs
                            )
                          }
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
