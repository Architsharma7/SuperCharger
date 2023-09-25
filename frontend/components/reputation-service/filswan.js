import axios from "axios";

const getMiners = async () => {
  try {
    const options = {
      method: "GET",
      url: "https://api.filswan.com/miners",
      params: { offset: 0, limit: 20 },
      sort_by: "score",
      order : "desc",
    };
    const response = await axios.request(options);

    const data = response.data.data.miner
  
    console.log(data); // total data

    return data

  } catch (error) {
    console.log(error);
  }
};

export { getMiners };
