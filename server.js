import express from "express";
import cors from "cors";
import { addListing, getAllListings } from "./sql.js";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/api/listings", async (req, res) => {
  const listings = await getAllListings();
  res.json(listings);
});

app.post("/api/make_listing", async (req,res) => {
    let data = req.body;
    console.log(data);
    let insert_params = [
        data.id, 
        data.title,
        data.category,
        data.price,
        data.condition,
        data.seller,
        data.email,
        data.pickup,
        data.description,
        data.status,
        data.createdAt,
        data.isUserListing]
    await addListing(insert_params);
    res.send(data);
})

app.listen(3000);