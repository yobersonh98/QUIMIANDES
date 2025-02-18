import { Router } from "express";
import { getOrdenesCompra, createOrdenCompra } from "../controllers/ordenCompraController";

const router = Router();

router.get("/", getOrdenesCompra);
router.post("/", createOrdenCompra);

export default router;
