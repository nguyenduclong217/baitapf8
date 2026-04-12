import express from "express";
import "dotenv/config";
import indexRouter from "./routers/index.router";
const PORT = 3000;

const app = express();
app.use(express.json()); // phai co moi lay duoc body
app.use(indexRouter);

app.listen(PORT, () => {
  console.log(`Server running with Port :${PORT}`);
});
