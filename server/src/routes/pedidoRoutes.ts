import { Router } from "express";
import { getPedidos, createPedido } from "../controllers/pedidoController";

const router = Router();

router.get("/", getPedidos);
router.post("/", createPedido);

export default router;
