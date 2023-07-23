"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const web3_1 = __importDefault(require("web3"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const provider = new web3_1.default.providers.HttpProvider("http://localhost:8545");
const web3 = new web3_1.default(provider);
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "_from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
const account = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const contract = new web3.eth.Contract(contractABI, contractAddress);
// Swagger
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ethereum Contract API for Test Task',
            version: '1.0.0',
        },
    },
    apis: ['./src/index.ts'],
};
const specs = (0, swagger_jsdoc_1.default)(options);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
/**
 * @openapi
 * /balance:
 *   get:
 *     summary: Get the balance of the account.
 *     responses:
 *       200:
 *         description: The balance of the account.
 */
app.get('/balance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //let balance = await contract.methods.balanceOf(account).call();
    //res.send(`Баланс: ${balance}`);
}));
/**
 * @openapi
 * /name:
 *   get:
 *     summary: Get the name of the contract.
 *     responses:
 *       200:
 *         description: The name of the contract.
 */
app.get('/name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let name = yield contract.methods.name().call();
    res.send(`Имя: ${name}`);
}));
/**
 * @openapi
 * /symbol:
 *   get:
 *     summary: Get the symbol of the contract.
 *     responses:
 *       200:
 *         description: The symbol of the contract.
 */
app.get('/symbol', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let symbol = yield contract.methods.symbol().call();
    res.send(`Символ: ${symbol}`);
}));
/**
 * @openapi
 * /totalSupply:
 *   get:
 *     summary: Get the total supply of tokens.
 *     responses:
 *       200:
 *         description: The total supply of tokens.
 */
app.get('/totalSupply', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let totalSupply = yield contract.methods.totalSupply().call();
    res.send(`Общее количество: ${totalSupply}`);
}));
/**
 * @openapi
 * /transfer:
 *   post:
 *     summary: Transfer tokens to a specified address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - amount
 *             properties:
 *               to:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: The transaction hash.
 *       500:
 *         description: An error occurred.
 */
app.post('/transfer', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const to = req.body.to;
    const amount = req.body.amount;
    // const gas = await contract.methods.transfer(to, amount).estimateGas();
    // contract.methods.transfer(to, amount).send({
    //   from: account,
    //   gas: gas
    // })
    // .on('transactionHash', function(hash){
    //   res.send(`Транзакция создана: ${hash}`);
    // })
    // .on('error', function(error){
    //   res.status(500).send(`Произошла ошибка: ${error.message}`);
    // });
}));
// contract.events.Transfer((error, event) => {
//   if (error) console.log(`Ошибка в событии Transfer: ${error}`);
//   else console.log(`Событие Transfer: ${JSON.stringify(event.returnValues)}`);
// });
app.listen(3000, () => console.log('Started on port 3000'));
