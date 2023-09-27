import axios from "axios";

const BACKEND_API_URL = "https://calibration.lighthouse.storage/api";

const registerRaasJobWithLighthouse = async (
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

const getDealStatusFromLighthouse = async (_cid) => {
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

export {};
