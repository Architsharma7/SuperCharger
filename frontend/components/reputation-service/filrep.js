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
      url: "https://api.filrep.io/api/v1/miners",
      params: { offset: 0, limit: 10 },
    };

    const response = await axios.request(options);

    console.log(response.data); // total data
    console.log(response.data.miners); // total data

    // console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export { getMiners };
