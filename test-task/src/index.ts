import express, { Request, Response } from 'express';
import Web3 from 'web3';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Contract Config
export const provider = new Web3.providers.WebsocketProvider(
  process.env.WEBSOCKET_PROVIDER || 'ws://localhost:8545'
);
const web3 = new Web3(provider);

const contractConfig = JSON.parse(
  fs.readFileSync(process.env.CONTRACT_PATH || 'Token.json').toString()
);
const contractABI = contractConfig.abi;

const contractAddress: string = process.env.CONTRACT_ADDRESS!;
const account: string = process.env.ACCOUNT!;

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Express & Swagger config
export const app = express();
app.use(express.json());

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

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


// API Routes
/**
 * @openapi
 * /balance:
 *   get:
 *     summary: Get the balance of the account.
 *     responses:
 *       200:
 *         description: The balance of the account.
 */
app.get('/balance', async (req: Request, res: Response) => {
  try {
    let balance = await (contract.methods.balanceOf as any)(account).call({
      from: account,
    });
    res.send({ balance: balance.toString() });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

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
app.post('/transfer', async (req: Request, res: Response) => {
  const to = req.body.to;
  const amount = req.body.amount;

  if (!to || !amount) return res.status(500).send({ error: 'Invalid params' });

  try {
    const gas = await (contract.methods.transfer as any)(
      to,
      amount
    ).estimateGas();

    (contract.methods.transfer as any)(to, amount)
      .send({
        from: account,
        gas: gas,
      })
      .on('transactionHash', function (hash: string) {
        res.send({ transactionHash: hash });
      })
      .on('error', function (error: Error) {
        res.status(500).send({ error: error.message });
      });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

export const server = app.listen(3000, () =>
  console.log('Started on port 3000')
);


// Event listeners for Transfer events
contract.events.Transfer().on('data', function (event) {
  console.log(event.returnValues);
});

// Start app and show contract info
const init = async () => {
  const symbol = await contract.methods.symbol().call();
  console.log(`symbol: ${symbol}`);
  const name = await contract.methods.name().call();
  console.log(`name: ${name}`);
};

init();
