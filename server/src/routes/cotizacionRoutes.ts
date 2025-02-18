import { Router } from "express";
import { getCotizaciones, createCotizacion } from "../controllers/cotizacionController";

const router = Router();

router.get("/", getCotizaciones);
router.post("/", createCotizacion);

export default router;
