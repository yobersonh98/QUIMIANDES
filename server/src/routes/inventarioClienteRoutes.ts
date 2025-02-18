import { Router } from "express";
import { getInventariosCliente, createInventarioCliente } from "../controllers/inventarioClienteController";

const router = Router();

router.get("/", getInventariosCliente);
router.post("/", createInventarioCliente);

export default router;
