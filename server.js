import express from "express";
import cors from "cors";
import { getAllListings } from "./sql.js";

const app = express();
app.use(cors());
app.get("/api/listings", async (req, res) => {
  const listings = await getAllListings();
  res.json(listings);
});

app.listen(3000);