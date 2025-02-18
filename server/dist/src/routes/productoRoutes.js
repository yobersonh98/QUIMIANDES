"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productoController_1 = require("../controllers/productoController");
const router = (0, express_1.Router)();
router.get("/", productoController_1.getProductos);
router.post("/", productoController_1.createProducto);
exports.default = router;
