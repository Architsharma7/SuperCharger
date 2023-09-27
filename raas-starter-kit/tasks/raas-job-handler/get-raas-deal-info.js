task("get-raas-deal", "Fetches the RAAS deal data")
    .addParam("contract", "The address of the deal client solidity")
    .addParam("cidcontract", "The address of the deal client solidity")
    .addParam("cid", "The CID of the file for which deposit is initialised")
    .setAction(async (taskArgs) => {
        const cid = taskArgs.cid
        const contractAddr = taskArgs.contract
        const CIDcontractAddr = taskArgs.cidcontract

        //create a new wallet instance
        const wallet = new ethers.Wallet(network.config.accounts[0], ethers.provider)

        //create a DealClient contract factory
        const DealClient = await ethers.getContractFactory(
            "RassJobHandler",
            {
                libraries: {
                    Cid: CIDcontractAddr,
                },
            },
            wallet
        )
        //create a DealClient contract instance
        //this is what you will call to interact with the deployed contract
        const dealClient = await DealClient.attach(contractAddr)

        const response = await dealClient.getRaasData(ethers.utils.toUtf8Bytes(cid))

        console.log("Raas Deal info", response)
    })
