-- Crear secuencia para los pedidos principales
CREATE SEQUENCE IF NOT EXISTS pedido_seq START 1;

-- Función para generar el ID del pedido en formato PD-XXXX
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

-- Función para generar el ID del detalle de pedido basado en el ID del pedido principal
CREATE OR REPLACE FUNCTION generar_id_detalle_pedido(id_pedido text)
RETURNS text AS $$
DECLARE
    secuencia_actual bigint;
    nuevo_id text;
BEGIN
    -- Verificar si ya existen detalles para este pedido
    PERFORM setval('detalle_pedido_seq', 1, false);
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(id, LENGTH(id_pedido || '-') + 1) AS integer)), 0) + 1
    INTO secuencia_actual
    FROM "DetallePedido"
    WHERE "pedidoId" = id_pedido;
    
    nuevo_id := id_pedido || '-' || LPAD(secuencia_actual::text, 3, '0');
    RETURN nuevo_id;
END;
$$ LANGUAGE plpgsql;