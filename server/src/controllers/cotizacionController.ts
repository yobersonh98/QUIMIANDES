import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCotizaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const cotizaciones = await prisma.cotizacion.findMany();
    res.json(cotizaciones);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving quotations" });
  }
};

export const createCotizacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clienteDocumento, total } = req.body;
    const cotizacion = await prisma.cotizacion.create({
      data: {
        clienteDocumento,
        total,
      },
    });
    res.status(201).json(cotizacion);
  } catch (error) {
    res.status(500).json({ message: "Error creating quotation" });
  }
};
