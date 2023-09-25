import { DB, filfox } from "@dataprograms/repdao-polybase";

const getMiners = async () => {
  try {
    const doc = await DB.collection("filfox")
      .where("epoch", "<", 2849899)
      .sort("epoch", "desc")
      .limit(2)
      .get(); // 2 is n

    doc.data.forEach((e) => {
      console.log(e.data);
    });
  } catch (error) {
    console.log(error);
  }
};

export { getMiners };
