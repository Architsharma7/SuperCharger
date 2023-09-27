# GOSDA

Miners to use , that picks up deals instantly
// t017819
// t017387
// t017840
// t01491

// CIDS
QmWXLTq5muTs42ZK6qHExZekGK18yiUwtW8h2LgPjJvY3h
QmZALav6b4Nrv1qtvYwsuuzmqr7z1YR7PcfQrVBpyeeRA5
QmVqymS7pGjHifKqrJWUnAQNEEjVJNWpQ9MB9TYyJ4264T
QmTH7SVCm21LXZ7ZSDmpbE3Bs7mQmnZX7jUd8g23k4CyaX

// deposit some funds
yarn hardhat deposit-raas-funds --cid QmTH7SVCm21LXZ7ZSDmpbE3Bs7mQmnZX7jUd8g23k4CyaX --contract 0x812d210891726613C0b29e645D56C2ad80c635FF --cidcontract 0xd598c49C533F0840b8013d212D400c4ff25d06B7

// whitelisting worker
yarn hardhat whitelist-worker --contract 0x812d210891726613C0b29e645D56C2ad80c635FF --cidcontract 0xd598c49C533F0840b8013d212D400c4ff25d06B7 --worker 0x62C43323447899acb61C18181e34168903E033Bf

// get raas deal info
yarn hardhat get-raas-deal --cid QmWXLTq5muTs42ZK6qHExZekGK18yiUwtW8h2LgPjJvY3h --contract 0xC37175181265D75ed04f28f3c027cC5fAceF5dAd --cidcontract 0xbD869bCa73c7b3eC32a12ac9eD448e671BeCBFaa
