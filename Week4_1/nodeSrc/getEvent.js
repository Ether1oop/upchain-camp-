const { ethers } = require("ethers");

const ERC20ABI = require(`../deployments/abi/Etherloop_2612.json`)
const ERC20Addr = require(`../deployments/dev/Etherloop_2612.json`)

async function parseTransferEvent(event) {
    const TransferEvent = new ethers.utils.Interface(["event Transfer(address indexed from,address indexed to,uint256 value)"]);
    let decodedData = TransferEvent.parseLog(event);
    console.log("from:" + decodedData.args.from);
    console.log("to:" + decodedData.args.to);
    console.log("value:" + decodedData.args.value.toString());

}

async function main() {
    
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    
    let myerc20 = new ethers.Contract(ERC20Addr.address, ERC20ABI, provider)

    // 使用布隆过滤器查询收据树
    let filter = myerc20.filters.Transfer()
    filter.fromBlock = 1;
    filter.toBlock = 100;

    let events = await provider.getLogs(filter);
    for (let i = 0; i < events.length; i++) {
        parseTransferEvent(events[i]);
    }
}

main()
