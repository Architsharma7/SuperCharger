import axios from "axios";
import { useState } from "react";

const getMinersUsingFilRep = async () => {
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

    // console.log(response.data); // total data
    // console.log(response.data.miners); // total data

    return response.data.data

    // console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const getMinersUsingFilSwan = async () => {
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
      const response = await axios.request(options);
  
    //   console.log(response.data.data); // total data
    //   console.log(response.data.miner); // total data

    return response.data.data
  
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

const getData = async() => {

    const filrepData = await getMinersUsingFilRep()
    const filswanData = await getMinersUsingFilSwan()

    console.log(filrepData, filswanData);
}

export {getData}