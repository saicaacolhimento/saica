-- Create master_admin table
CREATE TABLE IF NOT EXISTS master_admin (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_sign_in_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked'))
);

-- Create RLS policies
ALTER TABLE master_admin ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master admin can view their own record" ON master_admin
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Master admin can update their own record" ON master_admin
    FOR UPDATE
    USING (auth.uid() = id);

-- Create function to handle master admin authentication
CREATE OR REPLACE FUNCTION handle_master_admin_auth()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email = 'saicaacolhimento2025@gmail.com' THEN
        INSERT INTO master_admin (id, email, nome)
        VALUES (NEW.id, NEW.email, 'Administrador Master')
        ON CONFLICT (id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_master_admin_auth(); 