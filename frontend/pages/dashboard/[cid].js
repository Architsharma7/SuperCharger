import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getPODSIdetails } from "../../components/raasApiMethods";
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
import { DB } from "@dataprograms/repdao-polybase";

const Cid = () => {
  const router = useRouter();
  const { cid } = router.query;
  const [podsiDealInfo, setPodsiDealInfo] = useState();
  const [minerLocations, setMinerLocation] = useState(null);
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
        <div className="w-11/12 flex justify-center mx-auto mt-20">
          <div className="w-1/2 mx-2">
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
                      <Td>metres (m)</Td>
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
                          <Tr>
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
                            <Td>
                              {podsiDealInfo &&
                                podsiDealInfo.proof.fileProof.verifierData
                                  .commPc}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          <div className="w-1/2 mx-5">{}</div>
        </div>
      </div>
    </div>
  );
};

export default Cid;
