import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useConfiguracao } from '@/hooks/useConfiguracao'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'

const formSchema = z.object({
  chave: z.string().min(1, 'A chave é obrigatória'),
  valor: z.string().min(1, 'O valor é obrigatório'),
  descricao: z.string().min(1, 'A descrição é obrigatória'),
  tipo: z.enum(['texto', 'numero', 'booleano', 'json', 'senha']),
  categoria: z.enum(['geral', 'email', 'sms', 'whatsapp', 'backup', 'seguranca']),
  obrigatorio: z.boolean(),
})

export const ConfiguracaoEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getConfiguracaoById, updateConfiguracao } = useConfiguracao()
  const [isLoading, setIsLoading] = useState(false)

  const { data: configuracao, isLoading: isLoadingConfiguracao } = getConfiguracaoById(id || '')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chave: '',
      valor: '',
      descricao: '',
      tipo: 'texto',
      categoria: 'geral',
      obrigatorio: false,
    },
  })

  useEffect(() => {
    if (configuracao) {
      form.reset({
        chave: configuracao.chave,
        valor: configuracao.valor,
        descricao: configuracao.descricao,
        tipo: configuracao.tipo,
        categoria: configuracao.categoria,
        obrigatorio: configuracao.obrigatorio,
      })
    }
  }, [configuracao, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!id) return

    setIsLoading(true)
    try {
      await updateConfiguracao({ id, data: values })
      navigate('/configuracoes')
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingConfiguracao) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Editar Configuração</h2>
        <p className="text-muted-foreground">
          Edite os detalhes da configuração abaixo.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="chave"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chave</FormLabel>
                <FormControl>
                  <Input placeholder="Digite a chave" {...field} />
                </FormControl>
                <FormDescription>
                  A chave única que identifica esta configuração.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o valor" {...field} />
                </FormControl>
                <FormDescription>
                  O valor da configuração.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Digite a descrição"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Uma descrição detalhada da configuração.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="texto">Texto</SelectItem>
                    <SelectItem value="numero">Número</SelectItem>
                    <SelectItem value="booleano">Booleano</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="senha">Senha</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  O tipo de dado da configuração.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="geral">Geral</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="backup">Backup</SelectItem>
                    <SelectItem value="seguranca">Segurança</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  A categoria da configuração.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="obrigatorio"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Obrigatório</FormLabel>
                  <FormDescription>
                    Se esta configuração é obrigatória.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/configuracoes')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 