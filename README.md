# b2b-test-task

## Starting test network with docker
Build and run docker container with hardhat test network
```docker compose -f "hardhat-testnet/docker-compose.yml" up -d --build```

JSON-RPC server started at `http://localhost:8545/`

Created accounts available in docker logs
```docker logs --tail 1000 -f hardhat-testnet-node```

## Deploying contract
Switch to contract directory
```cd contract```

Install dependencies
```npm install```

Copy first 3 contract addresses from docker logs and paste them to `hardhat.config.ts` in `networks.b2bNet.accounts`

Compile contract
```npx hardhat compile```

Run tests
```npx hardhat test```

Deploy contract
```npx hardhat run --network b2bNet scripts/deploy.ts```

## Running test-task on web3.js
Switch to test-task directory
```cd test-task```

Install dependencies
```npm install```

Copy example.env to .env and:
- modify path to ABI file in `CONTRACT_PATH` variable
- paste contract address from docker logs to `CONTRACT_ADDRESS` variable

Run tests
```npm run test```

Run dev mode
```npm run dev``` swagger  on `http://localhost:3000/api-docs/` in browser

Build and run
```npm run build && npm run start```