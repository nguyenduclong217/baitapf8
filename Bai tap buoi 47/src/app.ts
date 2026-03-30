import express from "express";
import router from "./routers/index.router";

const PORT = 3000;
const app = express();
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log("Sever running with Port");
});
