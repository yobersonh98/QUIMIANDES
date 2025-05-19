-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "contactoPagos" TEXT,
ADD COLUMN     "contactoPrincipal" TEXT,
ADD COLUMN     "telefonoPagos" TEXT;

-- AlterTable
ALTER TABLE "LugarEntrega" ADD COLUMN     "telefonoEntregas" TEXT,
ALTER COLUMN "contacto" DROP NOT NULL;
