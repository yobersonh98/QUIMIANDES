import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
/* ROUTE IMPORTS */

import clienteRoutes from "./routes/clienteRoutes";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());

app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(  {origin: '*'}));

/* ROUTES */
// app.use("/dashboard", dashboardRoutes); // http://localhost:8000/dashboard
app.use("/client", clienteRoutes); // http://localhost:8000/client
// app.use("/users", userRoutes); // http://localhost:8000/users
// app.use("/expenses", expenseRoutes); // http://localhost:8000/expenses

/* SERVER */
const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});