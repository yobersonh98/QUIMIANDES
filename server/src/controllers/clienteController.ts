import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getClientes = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();

    const clientes = await prisma.cliente.findMany({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error recuperando clients" });
  }
};

export const getClienteByDocumento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { documento } = req.params;

    const cliente = await prisma.cliente.findUnique({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo cliente" });
  }
};


export const createCliente = async (req: Request, res: Response): Promise<void> => {
  console.log(req.body);
  try {
    const {
      documento,
      tipoDocumento,
      nombre,
      direccion,
      zonaBarrio,
      inventarios = [],
      pedidos = [],
      cotizaciones = [],
    }: {
      documento: string;
      tipoDocumento: string;
      nombre: string;
      direccion: string;
      zonaBarrio?: string;
      inventarios: { productoId: string; precioEspecial: number }[];
      pedidos: { fechaRequerimiento: string; estado: string; observaciones?: string; fechaEntrega?: string; pesoDespachado?: number }[];
      cotizaciones: { total: number }[];
    } = req.body;

    // 1️⃣ Verificar si el cliente ya existe
    const existingCliente = await prisma.cliente.findUnique({
      where: { documento },
    });

    if (existingCliente) {
      res.status(400).json({ message: "El cliente ya existe" });
    }

    // 2️⃣ Validar que los productos en inventarios existan
    if (inventarios.length > 0) {
      const productosIds = inventarios.map((inv) => inv.productoId);
      const productosExistentes = await prisma.producto.findMany({
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
    const clienteData: any = {
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
        create: pedidos.map((pedido) => ({
          fechaRequerimiento: new Date(pedido.fechaRequerimiento),
          estado: pedido.estado,
          observaciones: pedido.observaciones,
          fechaEntrega: pedido.fechaEntrega ? new Date(pedido.fechaEntrega) : null,
          pesoDespachado: pedido.pesoDespachado ?? null,
        })),
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
    const cliente = await prisma.cliente.create({
      data: clienteData,
      include: {
        inventarios: true,
        pedidos: true,
        cotizaciones: true,
      },
    });

    res.status(201).json({ message: "Cliente creado exitosamente", cliente });
  } catch (error: any) {
    console.error("Error creando cliente:", error);
    res.status(500).json({ message: "Error creando cliente", error: error.message });
  }
};


