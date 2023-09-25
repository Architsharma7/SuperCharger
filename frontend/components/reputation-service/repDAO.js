import { DB, filrep } from "@dataprograms/repdao-polybase";

const getMiners = async () => {
  try {
    const doc = await DB.collection("filrep").limit(10).get(); // 2 is n
    let finalData = [];
    await doc.data.forEach((e) => {
      finalData.push(e.data);
    });
    console.log(finalData);
    return finalData;
  } catch (error) {
    console.log(error);
  }
};

export { getMiners };
