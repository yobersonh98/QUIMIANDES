-- Crear secuencia para los pedidos principales (sin límite práctico)
CREATE SEQUENCE IF NOT EXISTS pedido_seq START 1;

-- Función para generar el ID del pedido en formato PD-XXXXXX (6 dígitos)
CREATE OR REPLACE FUNCTION generar_id_pedido()
RETURNS text AS $$
DECLARE
    nuevo_id text;
BEGIN
    nuevo_id := 'PD-' || LPAD(nextval('pedido_seq')::text, 6, '0');
    RETURN nuevo_id;
END;
$$ LANGUAGE plpgsql;

-- Crear secuencia para los detalles de pedido
CREATE SEQUENCE IF NOT EXISTS detalle_pedido_seq START 1;

-- Generar ID del detalle como PD-000001-01, etc.
CREATE OR REPLACE FUNCTION generar_id_detalle_pedido(id_pedido text)
RETURNS text AS $$
DECLARE
    secuencia_actual integer;
    nuevo_id text;
BEGIN
    -- Obtener el siguiente número de detalle basado en los existentes
    SELECT COALESCE(MAX(CAST(SUBSTRING(id, LENGTH(id_pedido || '-') + 1) AS integer)), 0) + 1
    INTO secuencia_actual
    FROM "DetallePedido"
    WHERE "pedidoId" = id_pedido;

    nuevo_id := id_pedido || '-' || LPAD(secuencia_actual::text, 2, '0');
    RETURN nuevo_id;
END;
$$ LANGUAGE plpgsql;


-- Crear secuencia para entregas
CREATE SEQUENCE IF NOT EXISTS entrega_seq START 1;

-- Función para generar ID de entrega en formato ET-XXXXXX
CREATE OR REPLACE FUNCTION generar_id_entrega()
RETURNS text AS $$
DECLARE
    nuevo_id text;
BEGIN
    nuevo_id := 'ET-' || LPAD(nextval('entrega_seq')::text, 6, '0');
    RETURN nuevo_id;
END;
$$ LANGUAGE plpgsql;
