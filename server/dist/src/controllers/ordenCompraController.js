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
exports.createOrdenCompra = exports.getOrdenesCompra = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getOrdenesCompra = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ordenesCompra = yield prisma.ordenCompra.findMany();
        res.json(ordenesCompra);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving purchase orders" });
    }
});
exports.getOrdenesCompra = getOrdenesCompra;
const createOrdenCompra = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pedidoId, numeroOrden, fechaRequerimiento, tiempoEntrega, pesoDespachado, remision } = req.body;
        const ordenCompra = yield prisma.ordenCompra.create({
            data: {
                pedidoId,
                numeroOrden,
                fechaRequerimiento,
                tiempoEntrega,
                pesoDespachado,
                remision,
            },
        });
        res.status(201).json(ordenCompra);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating purchase order" });
    }
});
exports.createOrdenCompra = createOrdenCompra;
