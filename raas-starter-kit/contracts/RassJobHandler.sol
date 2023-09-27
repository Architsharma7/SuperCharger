// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./interfaces/IAggregatorOracle.sol";
import "./data-segment/Proof.sol";

// the contract will have a record of all the registered workers
// who can submit gradual requests for the replication , renewal and repair
// User when submitting storing the data for the first time , is supposed to call submit only once ,
// Where they will also send some payment according to the rates
// REPLITCATION_RATES : 0.5 FIL for each Copy , max 1.5 FIL
// RENEW_RATES : 1 FIL for 1 hr before | 120 epoch ,
// REPAIR_RATES : 1 FIL for 1 day | 2880 epochs
// For performing these jobs by calling their respective functions they are incentivised for each call
// If they want to edit the deal params , new Job has to be registered

// Delta that implements the AggregatorOracle interface
// name should be deal handler
contract RassJobHandler is IAggregatorOracle, Proof {
    uint256 private transactionId;
    mapping(uint256 => bytes) private txIdToCid;
    mapping(bytes => Deal[]) private cidToDeals;

    enum RaasJobStatus {
        IS_NOT_REGISTERED,
        IS_REGISTERED,
        IS_COMPLETED
    }

    struct RassJobData {
        RaasJobStatus jobStatus;
        uint totalRepairJobsDone;
        uint totalRenewJobsDone;
        uint totalReplicationJobsDone;
        uint totalAmountSpent;
        uint totalAmountDeposited;
    }

    mapping(address => bool) private isRaasWorker;
    mapping(bytes => uint) private raasJobDeposit;
    mapping(bytes => RassJobData) private rassJobDatas;
    address public owner;

    uint public constant RENEW_JOB_AMOUNT = 0.05 * 1 ether;
    uint public constant REPAIR_JOB_AMOUNT = 0.02 * 1 ether;
    uint public constant REPLICATION_JOB_AMOUNT = 0.01 * 1 ether;

    constructor() {
        owner = msg.sender;
        transactionId = 0;
    }

    modifier onlyWorker() {
        require(isRaasWorker[msg.sender], "ONLY ALLOWED WORKER");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY OWNER");
        _;
    }

    modifier onlyRegisteredCID(bytes memory _cid) {
        require(
            rassJobDatas[_cid].jobStatus != RaasJobStatus.IS_NOT_REGISTERED,
            "JOB NOT REGISTERED"
        );
        _;
    }

    function whitelistWorker(address _worker) external onlyOwner {
        isRaasWorker[_worker] = true;
    }

    function disableWorker(address _worker) external onlyOwner {
        isRaasWorker[_worker] = false;
    }

    function depositFunds(bytes memory _cid) public payable {
        uint depositAmount = msg.value;
        raasJobDeposit[_cid] += depositAmount;
        rassJobDatas[_cid].totalAmountDeposited += depositAmount;
    }

    function sendFundsToWorkers(bytes memory _cid, address _worker, uint _amount) internal {
        require(_amount < raasJobDeposit[_cid], "LOW DEPOSIT BALANCE");
        raasJobDeposit[_cid] -= _amount;
        (bool status, ) = _worker.call{value: _amount}("");
        require(status, "FUNDS TRANSFER FAILED");
        rassJobDatas[_cid].totalAmountSpent += _amount;
    }

    function submit(bytes memory _cid) external returns (uint256) {
        // no twice CID registerations are allowed
        require(
            rassJobDatas[_cid].jobStatus == RaasJobStatus.IS_NOT_REGISTERED,
            "JOB ALREADY REGISTERED"
        );

        rassJobDatas[_cid] = RassJobData(
            RaasJobStatus.IS_REGISTERED,
            0,
            0,
            0,
            0,
            raasJobDeposit[_cid]
        );

        // Increment the transaction ID
        transactionId++;

        // Save _cid
        txIdToCid[transactionId] = _cid;

        // Emit the event
        emit SubmitAggregatorRequest(transactionId, _cid);
        return transactionId;
    }

    // this will track the replication req timing , and send some reward
    function submitReplicationRequest(
        bytes memory _cid
    ) external onlyWorker onlyRegisteredCID(_cid) returns (uint256 txId) {
        address worker = msg.sender;
        transactionId++;

        // Save _cid
        txIdToCid[transactionId] = _cid;

        // pay out to the worker
        sendFundsToWorkers(_cid, worker, REPLICATION_JOB_AMOUNT);

        // Add job to data
        rassJobDatas[_cid].totalReplicationJobsDone += 1;

        // Emit the event
        emit SubmitAggregatorRequest(transactionId, _cid);

        return transactionId;
    }

    function submitRenewRequest(
        bytes memory _cid
    ) external onlyWorker onlyRegisteredCID(_cid) returns (uint256 txId) {
        address worker = msg.sender;

        transactionId++;

        // Save _cid
        txIdToCid[transactionId] = _cid;

        // pay out to the worker
        sendFundsToWorkers(_cid, worker, RENEW_JOB_AMOUNT);

        // Add job to data
        rassJobDatas[_cid].totalRenewJobsDone += 1;

        // Emit the event
        emit SubmitAggregatorRequest(transactionId, _cid);
        return transactionId;
    }

    function submitRepairRequest(
        bytes memory _cid
    ) external onlyWorker onlyRegisteredCID(_cid) returns (uint256 txId) {
        address worker = msg.sender;

        transactionId++;

        // Save _cid
        txIdToCid[transactionId] = _cid;

        // pay out to the worker
        sendFundsToWorkers(_cid, worker, REPAIR_JOB_AMOUNT);

        // Add job to data
        rassJobDatas[_cid].totalRepairJobsDone += 1;

        // Emit the event
        emit SubmitAggregatorRequest(transactionId, _cid);
        return transactionId;
    }

    function complete(
        uint256 _id,
        uint64 _dealId,
        uint64 _minerId,
        InclusionProof memory _proof,
        InclusionVerifierData memory _verifierData
    ) external returns (InclusionAuxData memory) {
        require(_id <= transactionId, "Delta.complete: invalid tx id");
        // Emit the event
        emit CompleteAggregatorRequest(_id, _dealId);

        // save the _dealId if it is not already saved
        bytes memory cid = txIdToCid[_id];
        require(rassJobDatas[cid].jobStatus == RaasJobStatus.IS_REGISTERED, "JOB NOT REGISTERED");

        for (uint256 i = 0; i < cidToDeals[cid].length; i++) {
            if (cidToDeals[cid][i].dealId == _dealId) {
                return this.computeExpectedAuxData(_proof, _verifierData);
            }
        }

        Deal memory deal = Deal(_dealId, _minerId);
        cidToDeals[cid].push(deal);
        rassJobDatas[cid].jobStatus == RaasJobStatus.IS_COMPLETED;

        // Perform validation logic
        // return this.computeExpectedAuxDataWithDeal(_dealId, _proof, _verifierData);
        return this.computeExpectedAuxData(_proof, _verifierData);
    }

    function getRaasData(bytes memory _cid) public view returns (RassJobData memory) {
        return rassJobDatas[_cid];
    }

    // allDealIds should return all the deal ids created by the aggregator
    function getAllDeals(bytes memory _cid) external view returns (Deal[] memory) {
        return cidToDeals[_cid];
    }

    function getAllCIDs() external view returns (bytes[] memory) {
        bytes[] memory cids;
        for (uint256 i = 0; i < transactionId; i++) {
            cids[i] = txIdToCid[i];
        }
        return cids;
    }

    // getActiveDeals should return all the _cid's active dealIds
    function getActiveDeals(bytes memory _cid) external returns (Deal[] memory) {
        // get all the deal ids for the cid
        Deal[] memory activeDealIds;
        activeDealIds = this.getAllDeals(_cid);

        for (uint256 i = 0; i < activeDealIds.length; i++) {
            uint64 dealID = activeDealIds[i].dealId;
            // get the deal's expiration epoch
            MarketTypes.GetDealActivationReturn memory dealActivationStatus = MarketAPI
                .getDealActivation(dealID);

            if (dealActivationStatus.terminated > 0 || dealActivationStatus.activated == -1) {
                delete activeDealIds[i];
            }
        }

        return activeDealIds;
    }

    // getExpiringDeals should return all the deals' dealIds if they are expiring within `epochs`
    function getExpiringDeals(bytes memory _cid, uint64 epochs) external returns (Deal[] memory) {
        // the logic is similar to the above, but use this api call:
        // https://github.com/Zondax/filecoin-solidity/blob/master/contracts/v0.8/MarketAPI.sol#LL110C9-L110C9
        Deal[] memory expiringDealIds;
        expiringDealIds = this.getAllDeals(_cid);

        for (uint256 i = 0; i < expiringDealIds.length; i++) {
            uint64 dealId = expiringDealIds[i].dealId;
            // get the deal's expiration epoch
            MarketTypes.GetDealTermReturn memory dealTerm = MarketAPI.getDealTerm(dealId);

            if (block.timestamp < uint64(dealTerm.end) - epochs) {
                delete expiringDealIds[i];
            }
        }

        return expiringDealIds;
    }
}
