"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pedidoController_1 = require("../controllers/pedidoController");
const router = (0, express_1.Router)();
router.get("/", pedidoController_1.getPedidos);
router.post("/", pedidoController_1.createPedido);
exports.default = router;
