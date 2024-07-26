const express = require("express");
const bodyparser = require("body-parser");
const Razorpay = require("razorpay");
const cors = require("cors");
require("dotenv").config(); // // Load .env file

const app = express();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
console.log(process.env.RAZORPAY_KEY_ID); // Should output your Razorpay key ID

app.post("/order", async (req, res) => {
  try {
    const neworder = await instance.orders.create({
      amount: req.body.amount * 100,
      receipt: "CO_RP_" + Date.now(),
    });
    res.json({
      amount: neworder.amount,
      orderId: neworder.id,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/payments", async (req, res) => {
  try {
    const payments = await instance.payments.all();
    res.json(payments);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
