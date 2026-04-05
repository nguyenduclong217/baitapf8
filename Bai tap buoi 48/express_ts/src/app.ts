import express from "express";
import router from "./routes/index.route";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  res.json({});
});

app.listen(PORT, () => {
  console.log(`Server runnng with Port: ${PORT}`);
});
