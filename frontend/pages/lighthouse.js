import React, { useState } from "react";
import lighthouse, { upload } from "@lighthouse-web3/sdk";

const lighthouse = () => {
  const [file, setFile] = useState();
  const [dealParameters, setDealParameters] = useState({
    copies,
    repair_thresh,
    renew_thresh,
  });

  const uploadFile = async () => {
    // Sample JSON of deal parameters
    const dealParams = {
      num_copies: dealParameters.copies,
      repair_threshold: dealParameters.repair_thresh, // 2880 = 1 day
      renew_threshold: dealParameters.renew_thresh,
      miner: ["t017840"],
      network: "calibration",
      add_mock_data: 2,
    };

    // `false` indicates that we're uploading a single file.
    const response = await lighthouse.upload(file, apiKey, false, dealParams);
    console.log(response);
  };

  return (
    <div>
      <input
        value={file}
        onChange={(e) => setFile(e.target.files)}
        type="file"
      />
      <button onClick={() => uploadFile(file)}>Upload</button>
    </div>
  );
};

export default lighthouse;
