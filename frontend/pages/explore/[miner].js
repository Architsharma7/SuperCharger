import React, { useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";

const SpecificMiners = () => {
  const router = useRouter();
  const [CID, Cid] = useState("");
  const [fileURL, setFileURL] = useState(null);
  const [userAccount, setUserAccount] = useState("");

  const decrypt = async () => {
    const cid = CID; //replace with your IPFS CID
    const { publicKey, signedMessage } = await encryptionSignature();
    const keyObject = await lighthouse.fetchEncryptionKey(
      cid,
      publicKey,
      signedMessage
    );

    const fileType = "image/jpeg";
    const decrypted = await lighthouse.decryptFile(
      cid,
      keyObject.data.key,
      fileType
    );
    console.log(decrypted);
    const url = URL.createObjectURL(decrypted);
    console.log(url);
    setFileURL(url);
  };

  const encryptionSignature = async () => {
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
      const address = await signer.getAddress();
      const messageRequested = (await lighthouse.getAuthMessage(address)).data
        .message;
      const signedMessage = await signer.signMessage(messageRequested);
      setUserAccount(accounts[0]);
      return {
        signedMessage: signedMessage,
        publicKey: address,
      };
    }
  };

  const revoke = async () => {
    const sig = await encryptionSignature();
    const ownerPublicKey = sig.publicKey;
    const addressToRevoke = [];
    const fileCID = CID;
    const ownerSignedMessage = sig.signedMessage;

    const response = await lighthouse.revokeFileAccess(
      ownerPublicKey,
      addressToRevoke,
      fileCID,
      ownerSignedMessage
    );
    console.log(response);
  };

  return (
    <div>
      <button className="mx-3" onClick={() => console.log(router.query.miner)}>
        get
      </button>
      <button onClick={() => revoke()}>Revoke</button>
      <button onClick={() => decrypt()}>decrypt</button>
      {fileURL ? (
        <a href={fileURL} target="_blank">
          viewFile
        </a>
      ) : null}
    </div>
  );
};

export default SpecificMiners;
