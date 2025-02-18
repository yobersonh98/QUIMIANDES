import { Router } from "express";
import { getEntregas, createEntrega } from "../controllers/entregaController";

const router = Router();

router.get("/", getEntregas);
router.post("/", createEntrega);

export default router;
