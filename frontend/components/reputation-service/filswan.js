import axios from "axios";

const getMiners = async () => {
  try {
    // let response = await axios.get("https://api.filrep.io/api/v1/miners", {
    //   params: {
    //     offset: 0,
    //     limit: 10,
    //   },
    // });
    const options = {
      method: "GET",
      url: "https://api.filswan.com/miners",
      params: { offset: 0, limit: 10 },
    };
    const data = await axios.request(options);

    console.log(response.data.data); // total data
    console.log(response.data.miner); // total data

    // console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export { getMiners };
