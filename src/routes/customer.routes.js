import express from "express";
import {
  getCustomers,
  getCustomerById,
  getUniqueCities,
  addCustomer,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.get("/", getCustomers);

// Get single customer data by id
router.get("/:id", getCustomerById);

// List all unique cities with number of customers from a particular city
router.get("/cities/unique", getUniqueCities);

// Add a customer with validations
router.post("/", addCustomer);

export default router;
