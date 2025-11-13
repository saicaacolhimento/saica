import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function definirSenhaMaster() {
  console.log('========================================');
  console.log('   DEFINIR SENHA DO MASTER ADMIN');
  console.log('========================================\n');
  
  const email = 'saicaacolhimento2025@gmail.com';
  const novaSenha = process.argv[2] || 'Beniciocaus3131@2025';
  
  console.log(`Email: ${email}`);
  console.log(`Nova senha: ${novaSenha.substring(0, 5)}...`);
  console.log('');
  
  // Buscar usuário
  console.log('1. Buscando usuário no Auth...');
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Erro ao listar usuários:', listError);
    return;
  }
  
  const masterUser = users.users.find(u => u.email === email);
  
  if (!masterUser) {
    console.error('❌ Usuário não encontrado no Auth!');
    console.log('\n💡 Execute primeiro o script de criação do usuário master');
    return;
  }
  
  console.log('✅ Usuário encontrado');
  console.log(`   ID: ${masterUser.id}`);
  console.log(`   Email: ${masterUser.email}`);
  console.log(`   Criado em: ${masterUser.created_at}\n`);
  
  // Atualizar senha
  console.log('2. Atualizando senha...');
  
  const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
    masterUser.id,
    {
      password: novaSenha
    }
  );
  
  if (updateError) {
    console.error('❌ Erro ao atualizar senha:', updateError);
    return;
  }
  
  console.log('✅ Senha atualizada com sucesso!');
  console.log(`   Email: ${updateData.user.email}`);
  console.log(`   ID: ${updateData.user.id}\n`);
  
  console.log('========================================');
  console.log('   SENHA CONFIGURADA!');
  console.log('========================================');
  console.log(`Email: ${email}`);
  console.log(`Senha: ${novaSenha}`);
  console.log('\n✅ Agora você pode fazer login na aplicação!\n');
}

definirSenhaMaster().catch(console.error);


