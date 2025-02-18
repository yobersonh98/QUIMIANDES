import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProductos = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const productos = await prisma.producto.findMany({
      where: {
        nombre: {
          contains: search,
        },
      },
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, tipo, unidadMedida, pesoVolumen, precioBase, proveedorDocumento } = req.body;
    const producto = await prisma.producto.create({
      data: {
        nombre,
        tipo,
        unidadMedida,
        pesoVolumen,
        precioBase,
        proveedorDocumento,
      },
    });
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};
