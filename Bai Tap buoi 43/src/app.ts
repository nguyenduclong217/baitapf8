import express, { Request, Response } from "express";
import router from "./routers/auth.routes";

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(router);

app.get("/", (req: Request, res: Response) => {
  res.json({});
});

app.listen(PORT, () => {
  console.log(`Server running with Port :${PORT}`);
});
