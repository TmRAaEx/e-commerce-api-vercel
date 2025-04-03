import express from "express";
import { 
  getCustomers, 
  getCustomerById, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer, 
  getCustomerByEmail,
  registerCustomer,
  loginCustomer} from "../controllers/customerController";
const router = express.Router();

router.get("/", getCustomers)
router.get("/email/:email", getCustomerByEmail)
router.get("/:id", getCustomerById)
router.post("/", createCustomer)
router.patch("/:id", updateCustomer)
router.delete("/:id", deleteCustomer)
router.post("/register", registerCustomer)
router.post("/login", loginCustomer)

export default router