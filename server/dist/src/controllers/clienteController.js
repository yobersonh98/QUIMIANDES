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
exports.createCliente = exports.getClienteByDocumento = exports.getClientes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const clientes = yield prisma.cliente.findMany({
            where: {
                nombre: search ? { contains: search, mode: "insensitive" } : undefined,
            },
            include: {
                inventarios: {
                    include: {
                        producto: true, // Incluimos los detalles del producto en el inventario del cliente
                    },
                },
                pedidos: {
                    include: {
                        productos: true, // Incluye los detalles de los productos pedidos
                    },
                },
                cotizaciones: {
                    include: {
                        detalles: {
                            include: {
                                producto: true, // Incluye los productos dentro de los detalles de la cotización
                            },
                        },
                    },
                },
            },
        });
        res.json(clientes);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error recuperando clients" });
    }
});
exports.getClientes = getClientes;
const getClienteByDocumento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { documento } = req.params;
        const cliente = yield prisma.cliente.findUnique({
            where: { documento },
            include: {
                inventarios: {
                    include: {
                        producto: true,
                    },
                },
                pedidos: {
                    include: {
                        productos: true,
                    },
                },
                cotizaciones: {
                    include: {
                        detalles: {
                            include: {
                                producto: true,
                            },
                        },
                    },
                },
            },
        });
        if (!cliente) {
            res.status(404).json({ message: "Cliente no encontrado" });
            return;
        }
        res.json(cliente);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo cliente" });
    }
});
exports.getClienteByDocumento = getClienteByDocumento;
const createCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const { documento, tipoDocumento, nombre, direccion, zonaBarrio, inventarios = [], pedidos = [], cotizaciones = [], } = req.body;
        // 1️⃣ Verificar si el cliente ya existe
        const existingCliente = yield prisma.cliente.findUnique({
            where: { documento },
        });
        if (existingCliente) {
            res.status(400).json({ message: "El cliente ya existe" });
        }
        // 2️⃣ Validar que los productos en inventarios existan
        if (inventarios.length > 0) {
            const productosIds = inventarios.map((inv) => inv.productoId);
            const productosExistentes = yield prisma.producto.findMany({
                where: { id: { in: productosIds } },
                select: { id: true },
            });
            const productosValidos = new Set(productosExistentes.map((p) => p.id));
            const inventariosValidados = inventarios.filter((inv) => productosValidos.has(inv.productoId));
            if (inventarios.length !== inventariosValidados.length) {
                res.status(400).json({ message: "Algunos productos en inventario no existen" });
            }
        }
        // 3️⃣ Construir el objeto de cliente con más campos opcionales
        const clienteData = {
            documento,
            tipoDocumento,
            nombre,
            direccion,
            zonaBarrio,
        };
        if (inventarios.length > 0) {
            clienteData.inventarios = { create: inventarios };
        }
        if (pedidos.length > 0) {
            clienteData.pedidos = {
                create: pedidos.map((pedido) => {
                    var _a;
                    return ({
                        fechaRequerimiento: new Date(pedido.fechaRequerimiento),
                        estado: pedido.estado,
                        observaciones: pedido.observaciones,
                        fechaEntrega: pedido.fechaEntrega ? new Date(pedido.fechaEntrega) : null,
                        pesoDespachado: (_a = pedido.pesoDespachado) !== null && _a !== void 0 ? _a : null,
                    });
                }),
            };
        }
        if (cotizaciones.length > 0) {
            clienteData.cotizaciones = {
                create: cotizaciones.map((cot) => ({
                    fecha: new Date(),
                    total: cot.total,
                })),
            };
        }
        // 4️⃣ Crear el cliente en la base de datos
        const cliente = yield prisma.cliente.create({
            data: clienteData,
            include: {
                inventarios: true,
                pedidos: true,
                cotizaciones: true,
            },
        });
        res.status(201).json({ message: "Cliente creado exitosamente", cliente });
    }
    catch (error) {
        console.error("Error creando cliente:", error);
        res.status(500).json({ message: "Error creando cliente", error: error.message });
    }
});
exports.createCliente = createCliente;
