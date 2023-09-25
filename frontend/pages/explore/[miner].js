import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, AbsoluteCenter, Box } from "@chakra-ui/react";
import { Divider } from "@chakra-ui/react";

const SpecificMiners = () => {
  const router = useRouter();

  const [minerDetails, setMinerDetails] = useState(null);

  const { miner } = router.query;

  const getMiners = async () => {
    try {
      if (miner) {
        const options = {
          method: "GET",
          url: `https://api.filswan.com/miners/${miner}`,
        };
        const response = await axios.request(options);

        const data = response.data.data.miner;

        console.log(data); // total data
        console.log(miner);

        setMinerDetails(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMiners();
  }, [miner]);

  return (
    <div>
      <div className="w-screen">
        <div className="mt-10">
          <div className="flex flex-col justify-center mx-auto w-5/6">
            <div className="grid grid-flow-col grid-rows-2 grid-cols-3 gap-x-20 gap-y-6">
              <Card align="center" variant="elevated" size="lg">
                <CardBody>
                  <div className="flex flex-col text-center">
                    <p className="text-blue-500 text-4xl">Miner ID</p>
                    {minerDetails && (
                      <p className="mt-4 text-2xl">{minerDetails.miner_id}</p>
                    )}
                  </div>
                </CardBody>
              </Card>
              <Card align="center" variant="elevated" size="lg">
                <CardBody>
                  <div className="flex flex-col text-center">
                    <p className="text-blue-500 text-4xl">Miner Status</p>
                    {minerDetails && (
                      <p className="mt-4 text-2xl text-green-500">
                        {" "}
                        • {minerDetails.status}
                      </p>
                    )}
                  </div>
                </CardBody>
              </Card>
              <Card align="center" variant="elevated" size="lg">
                <CardBody>
                  <div className="flex flex-col text-center">
                    <p className="text-blue-500 text-4xl">Miner Location</p>
                    {minerDetails && (
                      <p className="mt-4 text-2xl">{minerDetails.location}</p>
                    )}
                  </div>
                </CardBody>
              </Card>
              <Card align="center" variant="elevated" size="lg">
                <CardBody>
                  <div className="flex flex-col text-center">
                    <p className="text-blue-500 text-4xl">Miner Price</p>
                    {minerDetails && (
                      <p className="mt-4 text-2xl">
                        {minerDetails.verified_price}
                      </p>
                    )}
                  </div>
                </CardBody>
              </Card>
              <Card align="center" variant="elevated" size="lg">
                <CardBody>
                  <div className="flex flex-col text-center">
                    <p className="text-blue-500 text-4xl">Min Piece Size</p>
                    {minerDetails && (
                      <p className="mt-4 text-2xl">
                        {minerDetails.min_piece_size}
                      </p>
                    )}
                  </div>
                </CardBody>
              </Card>
              <Card align="center" variant="elevated" size="lg">
                <CardBody>
                  <div className="flex flex-col text-center">
                    <p className="text-blue-500 text-4xl">Max Piece Size</p>
                    {minerDetails && (
                      <p className="mt-4 text-2xl">
                        {minerDetails.max_piece_size}
                      </p>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
            <Box className="mt-6" position="relative" padding="10">
              <Divider />
              <AbsoluteCenter bg="white" px="4">
                <p className="text-xl text-slate-500">Use This Provider</p>
              </AbsoluteCenter>
            </Box>
            <div className="mt-10">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificMiners;
