import express from 'express';
import bodyParser from 'body-parser';
import customersRouter from './routes/customer.routes.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use('/customers', customersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
