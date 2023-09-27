# SuperCharger

## What is it?

SuperCharger is an SP Explorer to supercharge the data onboarding based on reputation & green score and incentivise RAAS workers to create an immutable, Permanent & unbreakable storage.

[Demo Video](https://youtu.be/_cahlJdfd-0)

[Presentation](https://pitch.com/public/e76d811b-535a-4a75-8349-54431c77904d)

## What was the motivation behind it?

1. Proposing deals to Specific SPs on the basis of their Reputation and Green Score is not yet implemented but it can benefit both SPs & User to create a better Storage Ecosystem
2. Registering Job for Renew , Repair & Replication services is not User friendly and un-interactive , with no dashboard for management of this important service.
3. RAAS Workers are not yet incentivised for the service , due to which permanent , immutable & unbreakable storage can't be established.

## What is the Solution?

We built SuperCharger keeping in mind these problems and here is what we came up with:

1. An explorer : Reputation is a crucial factor when selecting a service provider. It reflects the trustworthiness and reliability of the SP. Our explorer ranks SPs based on  the reputation and Green Scores to find the most reputed SP for your deals with sustainable green storage , encouraging SPs to ensure best data availability, at the same time put effort to make rich green environment. 

2. Retrieval and Uploading : Users get to upload data with customisations  like encryption and define deal params like renew , repair and replications thresholds & propose deals directly to the SP of their choice . Retrieval is brought by the Saturn CDN to ensure fastest retrieval.

3. RAAS Job Manager : Interactive UI & dashboard to manage your RAAS deals in once click  along with detailed overview of past deals made along with geo data. Raas Jobs are registered via the backend server , and then the workers are incentivised  for performing them.

4. Dashboard: An interactive dashboard for users to see and control their data uploaded to IPFS.

## 🔩 Project Structure

[Frontend](https://github.com/Architsharma7/SuperCharger/tree/main/frontend) - Built on Next.js with Viem, Wagmi 

[Backend](https://github.com/Architsharma7/SuperCharger/tree/main/backend) - bootstrapped with raas-starter-kit

[Contracts](https://github.com/Architsharma7/SuperCharger/tree/main/contracts) - Written in Solidity

## The Tech Behind it

1. Filecoin : We use our custom [RaasJobHandler](https://github.com/Architsharma7/SuperCharger/blob/main/contracts/RassJobHandler.sol) Contract based on `IAggregatorOracle` for Deal Making and Incentivizing the storage providers, along with proposing RAAS deals. At first a job is registered by calling `submit` function to register this CID in contract , then some deposit has to be added by the user. The `SubmitAggregatorRequest` events are tracked backend Raas Node , to perform further actions. Raas workers call their respective functions e.g.`submitRepairRequest` which verifies the workers and performs payout for the same. There are various reward rates for these jobs namely , RENEW = 0.05 FIL , REPAIR = 0.02 FIL , REPLICATION = 0.01 FIL.
Deployed on Calibration Testnet at [0x812d210891726613C0b29e645D56C2ad80c635FF](https://calibration.filfox.info/en/address/0x812d210891726613C0b29e645D56C2ad80c635FF)

2. LightHouse: We use Lighthouse SDK for uploading, encrypting, and applying Access Controls. Deals are made on the FVM chain with lighthouse and get details of PODSI as a proof. It was also used in the backend code by the RaasWorkers to perform deals. 

3. Saturn: We use the Saturn CDN service for the fast retrieval of user data directly via the service worker we have attached to our application. [Usage Ref](https://github.com/Architsharma7/SuperCharger/blob/main/frontend/public/saturn-sw.js)

4. SP Reputation WG :  We use Reputation WG to fetch filReap & geo_location data to provide right data to our end users and improving discoverability for SPs , [Usage Ref](https://github.com/Architsharma7/SuperCharger/blob/main/frontend/components/reputation-service/repDAO.js) 

5. Flow of the Contract
<img width="793" alt="Screenshot 2023-09-27 at 11 30 31 PM" src="https://github.com/Architsharma7/SuperCharger/assets/90101251/e001c6da-93d5-4d41-9ec4-119615b070f0">

## Images

<img width="1431" alt="Screenshot 2023-09-27 at 10 41 57 PM" src="https://github.com/Architsharma7/SuperCharger/assets/91938348/0742c3ef-0910-48b1-9980-f765983fdd5f">
<img width="1510" alt="Screenshot 2023-09-28 at 12 19 26 AM" src="https://github.com/Architsharma7/SuperCharger/assets/91938348/553050fe-a67b-4b41-856f-96de85a6e724">
<img width="1510" alt="Screenshot 2023-09-28 at 12 19 57 AM" src="https://github.com/Architsharma7/SuperCharger/assets/91938348/3f785532-fe52-496c-abc8-5ef3d1c543af">
<img width="1510" alt="Screenshot 2023-09-28 at 12 17 55 AM" src="https://github.com/Architsharma7/SuperCharger/assets/91938348/d04122b5-8a3d-460d-a0d6-ff5fd9253dde">

## Some Links for Demo

RAAS Job Performance histoy : https://calibration.filfox.info/en/address/0x812d210891726613C0b29e645D56C2ad80c635FF?t=1

File Uploaded : https://gateway.lighthouse.storage/ipfs/QmWXLTq5muTs42ZK6qHExZekGK18yiUwtW8h2LgPjJvY3h

Demo CIDs : QmWXLTq5muTs42ZK6qHExZekGK18yiUwtW8h2LgPjJvY3h


