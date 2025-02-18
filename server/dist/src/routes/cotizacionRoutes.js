"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cotizacionController_1 = require("../controllers/cotizacionController");
const router = (0, express_1.Router)();
router.get("/", cotizacionController_1.getCotizaciones);
router.post("/", cotizacionController_1.createCotizacion);
exports.default = router;
