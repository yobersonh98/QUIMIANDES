import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProveedores = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const proveedores = await prisma.proveedor.findMany({
      where: {
        nombre: {
          contains: search,
        },
      },
    });
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving providers" });
  }
};

export const createProveedor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { documento, tipoDocumento, nombre, direccion } = req.body;
    const proveedor = await prisma.proveedor.create({
      data: {
        documento,
        tipoDocumento,
        nombre,
        direccion,
      },
    });
    res.status(201).json(proveedor);
  } catch (error) {
    res.status(500).json({ message: "Error creating provider" });
  }
};
