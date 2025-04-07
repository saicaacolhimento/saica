import { rest } from 'msw'
import { supabase } from '@/lib/supabase'

// Mock das chamadas ao Supabase
export const handlers = [
  // Configurações
  rest.get('/rest/v1/configuracoes', async (req, res, ctx) => {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('*')
      .order('categoria')

    if (error) {
      return res(ctx.status(400), ctx.json({ error: error.message }))
    }

    return res(ctx.json(data))
  }),

  rest.post('/rest/v1/configuracoes', async (req, res, ctx) => {
    const { data, error } = await supabase
      .from('configuracoes')
      .insert([req.body])
      .select()
      .single()

    if (error) {
      return res(ctx.status(400), ctx.json({ error: error.message }))
    }

    return res(ctx.json(data))
  }),

  rest.patch('/rest/v1/configuracoes', async (req, res, ctx) => {
    const { data, error } = await supabase
      .from('configuracoes')
      .update(req.body)
      .eq('id', req.body.id)
      .select()
      .single()

    if (error) {
      return res(ctx.status(400), ctx.json({ error: error.message }))
    }

    return res(ctx.json(data))
  }),

  rest.delete('/rest/v1/configuracoes', async (req, res, ctx) => {
    const { error } = await supabase
      .from('configuracoes')
      .delete()
      .eq('id', req.body.id)

    if (error) {
      return res(ctx.status(400), ctx.json({ error: error.message }))
    }

    return res(ctx.json({ success: true }))
  }),

  // Relatórios
  rest.get('/rest/v1/relatorios', async (req, res, ctx) => {
    const { data, error } = await supabase
      .from('relatorios')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return res(ctx.status(400), ctx.json({ error: error.message }))
    }

    return res(ctx.json(data))
  }),

  rest.post('/rest/v1/relatorios', async (req, res, ctx) => {
    const { data, error } = await supabase
      .from('relatorios')
      .insert([req.body])
      .select()
      .single()

    if (error) {
      return res(ctx.status(400), ctx.json({ error: error.message }))
    }

    return res(ctx.json(data))
  }),

  rest.patch('/rest/v1/relatorios', async (req, res, ctx) => {
    const { data, error } = await supabase
      .from('relatorios')
      .update(req.body)
      .eq('id', req.body.id)
      .select()
      .single()

    if (error) {
      return res(ctx.status(400), ctx.json({ error: error.message }))
    }

    return res(ctx.json(data))
  }),

  rest.delete('/rest/v1/relatorios', async (req, res, ctx) => {
    const { error } = await supabase
      .from('relatorios')
      .delete()
      .eq('id', req.body.id)

    if (error) {
      return res(ctx.status(400), ctx.json({ error: error.message }))
    }

    return res(ctx.json({ success: true }))
  }),

  // Templates de Relatório
  rest.get('/rest/v1/relatorio_templates', async (req, res, ctx) => {
    const { data, error } = await supabase
      .from('relatorio_templates')
      .select('*')
      .order('nome')

    if (error) {
      return res(ctx.status(400), ctx.json({ error: error.message }))
    }

    return res(ctx.json(data))
  }),

  rest.post('/rest/v1/relatorio_templates', async (req, res, ctx) => {
    const { data, error } = await supabase
      .from('relatorio_templates')
      .insert([req.body])
      .select()
      .single()

    if (error) {
      return res(ctx.status(400), ctx.json({ error: error.message }))
    }

    return res(ctx.json(data))
  }),

  rest.patch('/rest/v1/relatorio_templates', async (req, res, ctx) => {
    const { data, error } = await supabase
      .from('relatorio_templates')
      .update(req.body)
      .eq('id', req.body.id)
      .select()
      .single()

    if (error) {
      return res(ctx.status(400), ctx.json({ error: error.message }))
    }

    return res(ctx.json(data))
  }),

  rest.delete('/rest/v1/relatorio_templates', async (req, res, ctx) => {
    const { error } = await supabase
      .from('relatorio_templates')
      .delete()
      .eq('id', req.body.id)

    if (error) {
      return res(ctx.status(400), ctx.json({ error: error.message }))
    }

    return res(ctx.json({ success: true }))
  }),

  // Backups
  rest.get('/rest/v1/backups', async (req, res, ctx) => {
    const { data, error } = await supabase
      .from('backups')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return res(ctx.status(400), ctx.json({ error: error.message }))
    }

    return res(ctx.json(data))
  }),

  rest.post('/rest/v1/backups', async (req, res, ctx) => {
    const { data, error } = await supabase
      .from('backups')
      .insert([req.body])
      .select()
      .single()

    if (error) {
      return res(ctx.status(400), ctx.json({ error: error.message }))
    }

    return res(ctx.json(data))
  }),

  rest.patch('/rest/v1/backups', async (req, res, ctx) => {
    const { data, error } = await supabase
      .from('backups')
      .update(req.body)
      .eq('id', req.body.id)
      .select()
      .single()

    if (error) {
      return res(ctx.status(400), ctx.json({ error: error.message }))
    }

    return res(ctx.json(data))
  }),

  rest.delete('/rest/v1/backups', async (req, res, ctx) => {
    const { error } = await supabase
      .from('backups')
      .delete()
      .eq('id', req.body.id)

    if (error) {
      return res(ctx.status(400), ctx.json({ error: error.message }))
    }

    return res(ctx.json({ success: true }))
  })
] 