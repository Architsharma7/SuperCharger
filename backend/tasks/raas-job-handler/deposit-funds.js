task("deposit-raas-funds", "Whitelists a new worker to the deal client")
    .addParam("contract", "The address of the deal client solidity")
    .addParam("cidcontract", "The address of the deal client solidity")
    .addParam("cid", "The CID of the file for which deposit is initialised")
    // .addParam("depositamount", "The address of the deal client solidity")
    .setAction(async (taskArgs) => {
        const cid = taskArgs.cid
        const contractAddr = taskArgs.contract
        const CIDcontractAddr = taskArgs.cidcontract
        // const depositAmount = taskArgs.depositAmount

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
        // const amountInWei = ethers.utils.parseEther(`${depositAmount}`)
        console.log("Depositing funds for the CID worth")
        const transaction = await dealClient.depositFunds(ethers.utils.toUtf8Bytes(cid), {
            value: ethers.utils.parseEther("2"),
        })
        await transaction.wait()
        console.log("The Funds are now deposited in the contract")
    })
