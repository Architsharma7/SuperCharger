import React from "react";
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

const Explore = () => {
  return (
    <div className="w-screen">
      <div className="flex justify-center mx-auto mt-20">
        <TableContainer maxWidth={"100%"} display={"block"}>
          <Table variant="simple" size="lg">
            <TableCaption>Reputation and Green Score SP Aggregator</TableCaption>
            <Thead>
              <Tr>
                <Th fontSize="xl">SP Name</Th>
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
              <Tr>
                <Td>inches</Td>
                <Td>millimetres (mm)</Td>
                <Td isNumeric>25.4</Td>
                <Td>millimetres (mm)</Td>
                <Td>millimetres (mm)</Td>
                <button className="mx-auto flex justify-center my-auto mt-4 font-semibold bg-blue-500 px-7 py-1 text-white rounded-2xl">Use SP</button>
              </Tr>
              <Tr>
                <Td>inches</Td>
                <Td>millimetres (mm)</Td>
                <Td isNumeric>25.4</Td>
                <Td>millimetres (mm)</Td>
                <Td>millimetres (mm)</Td>
              </Tr>
              <Tr>
                <Td>inches</Td>
                <Td>millimetres (mm)</Td>
                <Td isNumeric>25.4</Td>
                <Td>millimetres (mm)</Td>
                <Td>millimetres (mm)</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Explore;
