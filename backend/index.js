import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.post('/admin/criar-usuario', async (req, res) => {
  try {
    const { email, password, nome, role, cargo, empresa_id } = req.body;
    // Cria usuário no Auth
    const { data: user, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (signUpError) throw signUpError;
    // Insere na tabela usuarios
    const now = new Date().toISOString();
    const { data: usuario, error: insertError } = await supabase
      .from('usuarios')
      .insert([
        {
          id: user.user.id,
          email,
          nome,
          role,
          status: 'active',
          cargo,
          empresa_id,
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single();
    if (insertError) throw insertError;
    res.json({ userId: user.user.id, usuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/admin/alterar-senha', async (req, res) => {
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