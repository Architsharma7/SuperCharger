import { DB, filrep } from "@dataprograms/repdao-polybase";
import { useEffect, useState } from "react";

import { PolybaseError } from "@polybase/client";
import { CollectionNames } from "@dataprograms/repdao-polybase";

const RepDao = () => {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [mergedData, setMergedData] = useState([]);

  const getSP = async () => {
    for (const collectionName of collectionName) {
      let response;
      try {
        response = await DB.collection(collectionName).limit(1).get();
        console.log(`Data for polybase collection ${collectionName}`);
        console.log(response.data[0].data);
      } catch (e) {
        if (e instanceof PolybaseError) {
          console.error(
            `Polybase error: ${e.code} ${e.message} when retrieving ${collectionName}.`
          );
          continue;
        }
        throw e;
      }
    }
  };

  useEffect(() => {
    getfilerep();
    getfilfox();
  }, []);

  const getfilerep = async () => {
    try {
      const doc = await DB.collection("filrep").limit().get(); // 2 is n
      let finalData = [];
      await doc.data.forEach((e) => {
        finalData.push(e.data);
      });
      console.log(finalData);
      setData1(finalData);
    } catch (error) {
      console.log(error);
    }
  };

  const getfilfox = async () => {
    try {
      const doc = await DB.collection("filfox").limit().get(); // 2 is n
      let finalData = [];
      await doc.data.forEach((e) => {
        finalData.push(e.data);
      });
      console.log(finalData);
      setData2(finalData);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    const mergedData = data1.map((item1) => {
      const item2 = data2.find((item2) => item2.id === item1.id);

      // Merge the two objects based on ID
      return {
        ...item1,
        ...item2,
      };
    });

    setMergedData(mergedData);
    console.log(mergedData);
  };

  return (
    <div>
      <button onClick={() => getData()}>get</button>
      <button></button>
    </div>
  );
};

export default RepDao;
