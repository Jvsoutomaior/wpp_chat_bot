import dotenv from 'dotenv';
import express from 'express';
import {webhook_setupRouter} from './routes/webhook_setup.mjs';
import APImetaRouter from './routes/APImeta.mjs';

dotenv.config();
const { PORT } = process.env;

const app = express();
app.use(express.json());

app.use("/", webhook_setupRouter);
app.use("/", APImetaRouter);

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
