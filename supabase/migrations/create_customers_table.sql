-- SOLUCIÓN RÁPIDA: Crear tabla customers sin foreign key constraint
-- Esto permite que funcione inmediatamente sin modificar businesses

-- Primero, elimina la tabla antigua si existe
DROP TABLE IF EXISTS customers CASCADE;

-- Crea la nueva tabla SIN foreign key constraint
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id TEXT NOT NULL, -- Cambiado a TEXT para coincidir con businesses.id
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    stamps INTEGER DEFAULT 0,
    visits INTEGER DEFAULT 0,
    last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active',
    tier TEXT DEFAULT 'Bronze',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para consultas rápidas
CREATE INDEX idx_customers_business_id ON customers(business_id);
CREATE INDEX idx_customers_last_visit ON customers(last_visit DESC);

-- Habilitar RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Política RLS permisiva (temporal)
CREATE POLICY "Users can manage their business customers"
    ON customers FOR ALL
    USING (true)
    WITH CHECK (true);
