import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  }
}));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }

  req.user = user;
  next();
}

app.post('/admin/criar-usuario', authMiddleware, async (req, res) => {
  try {
    const { email, password, nome, role, cargo, empresa_id } = req.body;

    const { data: user, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (signUpError) throw signUpError;

    const now = new Date().toISOString();
    const { data: usuario, error: insertError } = await supabase
      .from('usuarios')
      .insert([{
        id: user.user.id,
        email,
        nome,
        role,
        status: 'active',
        cargo,
        empresa_id,
        created_at: now,
        updated_at: now,
      }])
      .select()
      .single();
    if (insertError) throw insertError;

    res.json({ userId: user.user.id, usuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/admin/atualizar-usuario/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, password, role, cargo, empresa_id } = req.body;

    if (email) {
      const { error: emailError } = await supabase.auth.admin.updateUserById(id, { email });
      if (emailError) throw emailError;
    }

    if (password) {
      const { error: passwordError } = await supabase.auth.admin.updateUserById(id, { password });
      if (passwordError) throw passwordError;
    }

    const updates = {};
    if (nome !== undefined) updates.nome = nome;
    if (email !== undefined) updates.email = email;
    if (role !== undefined) updates.role = role;
    if (cargo !== undefined) updates.cargo = cargo;
    if (empresa_id !== undefined) updates.empresa_id = empresa_id;
    updates.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('usuarios')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/admin/alterar-senha', authMiddleware, async (req, res) => {
  try {
    const { userId, novaSenha } = req.body;
    if (!userId || !novaSenha) {
      return res.status(400).json({ error: 'userId e novaSenha são obrigatórios' });
    }

    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      password: novaSenha,
    });
    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
