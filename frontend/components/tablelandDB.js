import React from "react";
import { Database } from "@tableland/sdk";
import { ethers } from "ethers";
import { jsonFileAliases } from "@tableland/sdk/helpers";

const TablelandDB = () => {
  const getWallet = async () => {
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
      return signer;
    }
  };

  const nameMap = {};

  const createDB = async () => {
    try {
      const signer = await getWallet();
      const db = new Database({
        signer,
        aliases: {
          read: async function () {
            return nameMap;
          },
          write: async function (names) {
            for (const uuTableName in names) {
              nameMap[uuTableName] = names[uuTableName];
            }
          },
        },
      });
      //   const prefix = "my_table";
      const { meta: create } = await db
        .prepare(`CREATE TABLE main (id integer primary key, val text);`)
        .run();
      await create.txn?.wait();

      //   const { results } = await db.prepare(`SELECT * FROM main`).all();

      // The table's `name` is in the format `{prefix}_{chainId}_{tableId}`
      console.log(create.txn.name);
      console.log(results);
    } catch (error) {
      console.log(error);
    }
  };

  const readDB = async () => {
    const tableName = "my_table_001";

    const { results } = await db.prepare(`SELECT * FROM ${tableName};`).all();
    console.log(results);
  };

  const writeDB = async () => {
    const name = "my_table_001";
    const { meta: insert } = await db
      .prepare(`INSERT INTO ${name} (id, name) VALUES (?, ?);`)
      .bind(0, "Bobby Tables")
      .run();
    await insert.txn.wait();
    console.log(insert.txn.name);
  };

  return (
    <div>
      <button onClick={() => createDB()}>create</button>
      <button onClick={() => readDB()}>read</button>
      <button onClick={() => writeDB()}>write</button>
    </div>
  );
};

export default TablelandDB;
