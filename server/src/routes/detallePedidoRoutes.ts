import { Router } from "express";
import { getDetallesPedido, createDetallePedido } from "../controllers/detallePedidoController";

const router = Router();

router.get("/", getDetallesPedido);
router.post("/", createDetallePedido);

export default router;
