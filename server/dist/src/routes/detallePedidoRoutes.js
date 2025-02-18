"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const detallePedidoController_1 = require("../controllers/detallePedidoController");
const router = (0, express_1.Router)();
router.get("/", detallePedidoController_1.getDetallesPedido);
router.post("/", detallePedidoController_1.createDetallePedido);
exports.default = router;
