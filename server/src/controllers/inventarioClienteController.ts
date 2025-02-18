import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getInventariosCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const inventariosCliente = await prisma.inventarioCliente.findMany();
    res.json(inventariosCliente);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving client inventories" });
  }
};

export const createInventarioCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clienteDocumento, productoId, precioEspecial } = req.body;
    const inventarioCliente = await prisma.inventarioCliente.create({
      data: {
        clienteDocumento,
        productoId,
        precioEspecial,
      },
    });
    res.status(201).json(inventarioCliente);
  } catch (error) {
    res.status(500).json({ message: "Error creating client inventory" });
  }
};
