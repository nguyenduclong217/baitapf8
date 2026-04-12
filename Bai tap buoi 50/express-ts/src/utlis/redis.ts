import { createClient } from "redis";

export const redisClient = createClient({
  url: "redis://localhost:6380",
}).on("error", (err) => console.log("Redis client Error", err));
redisClient.connect();
