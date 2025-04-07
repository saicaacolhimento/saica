import { Router } from 'express'
import { supabase } from '@/lib/supabase'

const router = Router()

// Limpa o banco de dados
router.post('/clean-database', async (req, res) => {
  try {
    // Deleta todos os registros das tabelas
    await Promise.all([
      supabase.from('configuracoes').delete().neq('id', ''),
      supabase.from('relatorios').delete().neq('id', ''),
      supabase.from('relatorio_templates').delete().neq('id', ''),
      supabase.from('backups').delete().neq('id', ''),
      supabase.from('usuarios').delete().neq('id', '')
    ])

    res.json({ success: true })
  } catch (error) {
    console.error('Erro ao limpar banco de dados:', error)
    res.status(500).json({ error: 'Erro ao limpar banco de dados' })
  }
})

// Cria um usuário de teste
router.post('/create-user', async (req, res) => {
  try {
    const { email, password, role } = req.body

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ email, senha: password, role }])
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error)
    res.status(500).json({ error: 'Erro ao criar usuário de teste' })
  }
})

// Cria uma configuração de teste
router.post('/create-config', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('configuracoes')
      .insert([req.body])
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error('Erro ao criar configuração de teste:', error)
    res.status(500).json({ error: 'Erro ao criar configuração de teste' })
  }
})

// Cria um relatório de teste
router.post('/create-report', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('relatorios')
      .insert([req.body])
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error('Erro ao criar relatório de teste:', error)
    res.status(500).json({ error: 'Erro ao criar relatório de teste' })
  }
})

// Cria um template de relatório de teste
router.post('/create-template', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('relatorio_templates')
      .insert([req.body])
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error('Erro ao criar template de teste:', error)
    res.status(500).json({ error: 'Erro ao criar template de teste' })
  }
})

// Cria um backup de teste
router.post('/create-backup', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('backups')
      .insert([req.body])
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error('Erro ao criar backup de teste:', error)
    res.status(500).json({ error: 'Erro ao criar backup de teste' })
  }
})

export default router 