import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Card, CardBody, AbsoluteCenter, Box } from "@chakra-ui/react";
import { Divider } from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";
import { Switch } from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SpecificMiners = () => {
  const router = useRouter();

  const [minerDetails, setMinerDetails] = useState(null);
  const [dealParameters, setDealParameters] = useState({
    copies: 2,
    repair_thresh: 28800,
    renew_thresh: 240,
  });
  const [encryptionOn, setEncryptionOn] = useState(false);
  const [account, setAccount] = useState("");
  const [fileHash, setFileHash] = useState("");

  const { miner } = router.query;
  const notify = () =>
    toast(
      `File uploaded, link: https://gateway.lighthouse.storage/ipfs/${fileHash}`,
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        type: "success",
      }
    );

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

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const uploadFile = async () => {
    const dealParams = {
      num_copies: dealParameters.copies,
      repair_threshold: dealParameters.repair_thresh, // 2880 = 1 day
      renew_threshold: dealParameters.renew_thresh,
      miner: [`${miner}`], //"t017840"
      network: "calibration",
      add_mock_data: 2,
    };

    const response = await lighthouse.upload(
      acceptedFiles,
      process.env.NEXT_PUBLIC_API_KEY,
      false,
      dealParams
    );
    console.log(
      `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`
    );
    setFileHash(response.data.Hash);
    notify();
  };

  const allowEncryption = () => {
    setEncryptionOn(!encryptionOn);
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
    const dealParams = {
      num_copies: dealParameters.copies,
      repair_threshold: dealParameters.repair_thresh, // 2880 = 1 day
      renew_threshold: dealParameters.renew_thresh,
      miner: [`${miner}`], //"t017840"
      network: "calibration",
      add_mock_data: 2,
    };
    const sig = await encryptionSignature();
    const response = await lighthouse.uploadEncrypted(
      acceptedFiles,
      process.env.NEXT_PUBLIC_API_KEY,
      sig.publicKey,
      sig.signedMessage,
      dealParams
    );
    console.log(response.data);
    const { Hash } = response.data[0];
    setFileHash(Hash);
    console.log(`https://gateway.lighthouse.storage/ipfs/${Hash}`);
    notify();
  };

  return (
    <div>
      <div className="w-screen">
        <div className="mt-10">
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
              <Accordion defaultIndex={[0]} allowToggle={false}>
                <AccordionItem className="mb-5">
                  <h2>
                    <AccordionButton
                      _expanded={{ bg: "#4299E1", color: "white" }}
                    >
                      <Box as="span" flex="1" textAlign="left" fontSize="3xl">
                        File Upload
                      </Box>
                      {/* <AccordionIcon fontSize="3xl" /> */}
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pt={10} pb={10}>
                    <div className="flex flex-col">
                      <div
                        {...getRootProps({ className: "dropzone" })}
                        className="border border-dotted border-black py-28 cursor-pointer rounded-2xl"
                      >
                        <input {...getInputProps()} />
                        {acceptedFiles ? (
                          <p className="text-center text-black text-xl">
                            {acceptedFiles.map((file) => (
                              <li key={file.path}>
                                {file.path} - {file.size} bytes
                              </li>
                            ))}
                          </p>
                        ) : (
                          <p className="text-center text-slate-400 text-xl">
                            Drag 'n' drop some files here, or click to select
                            files
                          </p>
                        )}
                      </div>
                      <div className="mt-6">
                        <div className="flex justify-between align-middle">
                          <div>
                            <p className="text-2xl">Parameters (Optional)</p>
                          </div>
                          <div className="flex flex-col">
                            <Switch
                              size="lg"
                              id="encryption"
                              className="mx-4"
                              onChange={allowEncryption}
                            />
                            <p className="mt-1">Encryption</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-xl">No. of copies</p>
                          <input
                            type="number"
                            className="border border-black mt-2 w-2/3 px-3 py-1.5 rounded-xl"
                            onChange={(e) => {
                              setDealParameters({
                                ...dealParameters,
                                copies: e.target.value,
                              });
                            }}
                            value={dealParameters.copies}
                          ></input>
                        </div>
                        <div className="mt-4">
                          <p className="text-xl">Repair Threshold</p>
                          <input
                            type="number"
                            className="border border-black mt-2 w-2/3 px-3 py-1.5 rounded-xl"
                            placeholder="in multiples of 2880"
                            onChange={(e) => {
                              setDealParameters({
                                ...dealParameters,
                                repair_thresh: e.target.value,
                              });
                            }}
                            value={dealParameters.repair_thresh}
                          ></input>
                        </div>
                        <div className="mt-4">
                          <p className="text-xl">Renew Threshold</p>
                          <input
                            type="number"
                            placeholder="in multiples of 2880"
                            className="border border-black mt-2 w-2/3 px-3 py-1.5 rounded-xl"
                            onChange={(e) => {
                              setDealParameters({
                                ...dealParameters,
                                renew_thresh: e.target.value,
                              });
                            }}
                            value={dealParameters.renew_thresh}
                          ></input>
                        </div>
                      </div>
                      <div className="mx-auto flex justify-center mt-7">
                        <button
                          onClick={() => {
                            encryptionOn ? uploadFileEncrypted() : uploadFile();
                          }}
                          className="px-14 py-3 bg-blue-500 text-white text-xl rounded-xl"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificMiners;
