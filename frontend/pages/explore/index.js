import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getMiners } from "../../components/reputation-service/filswan";
// import { getMiners } from "../../components/reputation-service/repDAO";

const Explore = () => {
  const [apiData, setApiData] = useState([]);
  const router = useRouter();

  const setMiners = async () => {
    const data = await getMiners();
    setApiData(data);
  };

  useEffect(() => {
    setMiners();
  }, []);

  return (
    <div className="w-screen">
      <div className="flex justify-center mx-auto mt-10">
        <TableContainer maxWidth={"100%"} display={"block"}>
          <Table variant="simple" size="lg">
            <TableCaption>
              Reputation and Green Score SP Aggregator
            </TableCaption>
            <Thead>
              <Tr>
                <Th fontSize="xl">SP Status</Th>
                <Th fontSize="xl">SP ID</Th>
                <Th fontSize="xl" isNumeric>
                  Green Score
                </Th>
                <Th fontSize="xl">SP Reputation Score</Th>
                <Th fontSize="xl">Location</Th>
                <Th fontSize="xl">Use SP</Th>
              </Tr>
            </Thead>
            <Tbody>
              {apiData ? (
                apiData.map((data) => {
                  return (
                    <Tr>
                      <Td fontSize="large" className="text-green-500">
                        {data.status}
                      </Td>
                      <Td fontSize="large">{data.miner_id}</Td>
                      <Td fontSize="large" isNumeric>
                        25.4
                      </Td>
                      <Td fontSize="large">{data.score}</Td>
                      <Td fontSize="large">{data.location}</Td>
                      <button
                        onClick={() => router.push(`/explore/${data.miner_id}`)}
                        className="mx-auto flex justify-center my-auto mt-4 font-semibold bg-blue-500 px-7 py-1 text-white rounded-2xl text-lg"
                      >
                        Use SP
                      </button>
                    </Tr>
                  );
                })
              ) : (
                <div></div>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Explore), { ssr: false });
