"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ordenCompraController_1 = require("../controllers/ordenCompraController");
const router = (0, express_1.Router)();
router.get("/", ordenCompraController_1.getOrdenesCompra);
router.post("/", ordenCompraController_1.createOrdenCompra);
exports.default = router;
