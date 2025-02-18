"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDetallePedido = exports.getDetallesPedido = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getDetallesPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const detallesPedido = yield prisma.detallePedido.findMany();
        res.json(detallesPedido);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving order details" });
    }
});
exports.getDetallesPedido = getDetallesPedido;
const createDetallePedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pedidoId, productoId, unidades, cantidad, total } = req.body;
        const detallePedido = yield prisma.detallePedido.create({
            data: {
                pedidoId,
                productoId,
                unidades,
                cantidad,
                total,
            },
        });
        res.status(201).json(detallePedido);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating order detail" });
    }
});
exports.createDetallePedido = createDetallePedido;
