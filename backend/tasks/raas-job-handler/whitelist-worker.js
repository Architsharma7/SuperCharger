task("whitelist-worker", "Whitelists a new worker to the deal client")
    .addParam("contract", "The address of the deal client solidity")
    .addParam("cidcontract", "The address of the deal client solidity")
    .addParam("worker", "The address of the deal client solidity")
    .setAction(async (taskArgs) => {
        const worker = taskArgs.worker
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

        const transaction = await dealClient.whitelistWorker(worker)
        await transaction.wait()
        console.log("The Worker is now whitelisted")
    })
