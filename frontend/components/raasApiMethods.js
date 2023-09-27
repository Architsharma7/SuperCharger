import axios from "axios";
import { RAAS_HANDLER_ABI, RAAS_HANDLER_ADDRESS } from "../constants/contracts";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { parseEther, stringToBytes } from "viem";

const BACKEND_API_URL = "http://localhost:1337/api";

const registerRaasJob = async (
  _cid,
  _endDate,
  _Copies,
  _aggregator,
  _epoch
) => {
  try {
    const formData = new FormData();
    formData.append("cid", _cid);
    formData.append("endDate", _endDate);
    formData.append("aggregator", _aggregator);
    formData.append("replicationTarget", _Copies);
    formData.append("epochs", _epoch);

    const response = await axios.post(
      `${BACKEND_API_URL}/register_job`,
      formData
    );

    console.log(response.data); // total data
    // console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const getPODSIdetails = async (lighthouse_cid) => {
  let response = await axios.get(
    "https://api.lighthouse.storage/api/lighthouse/get_proof",
    {
      params: {
        cid: lighthouse_cid,
        network: "testnet", 
      },
    }
  );
  return response.data
};

const depositFunds = async (cid, value) => {
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const walletClient = useWalletClient();

  const data = await publicClient.simulateContract({
    account,
    address: RAAS_HANDLER_ADDRESS,
    abi: RAAS_HANDLER_ABI,
    functionName: "depositFunds",
    args: [stringToBytes(cid)],
    value: parseEther(value),
  });
  if (!walletClient) {
    return;
  }
  const tx = await walletClient.writeContract(data.request);
  console.log("Transaction Sent");
  const transaction = await publicClient.waitForTransactionReceipt({
    hash: tx,
  });
  console.log(transaction);
};

const getRaasDealInfo = async (cid) => {
  const { address: account } = useAccount();
  const publicClient = usePublicClient();

  const data = await publicClient.readContract({
    account,
    address: RAAS_HANDLER_ADDRESS,
    abi: RAAS_HANDLER_ABI,
    functionName: "getRaasData",
    args: [stringToBytes(cid)],
  });
  console.log(data.result);
};

const getDealStatus = async (_cid) => {
  try {
    const options = {
      method: "GET",
      url: `${BACKEND_API_URL}/deal_status`,
      params: { CID: _cid },
    };

    const response = await axios.request(options);

    console.log(response.data); // total data
    // console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export { getDealStatus, registerRaasJob, getRaasDealInfo, depositFunds, getPODSIdetails };
