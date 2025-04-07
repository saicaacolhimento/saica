import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Search, FileText, Trash2, Download } from 'lucide-react'
import { useRelatorio } from '@/hooks/useRelatorio'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export const RelatorioList = () => {
  const navigate = useNavigate()
  const { getRelatorios, deleteRelatorio, gerarPDF, gerarExcel, gerarCSV } = useRelatorio()
  const [searchTerm, setSearchTerm] = useState('')
  const [relatorioToDelete, setRelatorioToDelete] = useState<string | null>(null)

  const { data: relatorios, isLoading } = getRelatorios()

  const filteredRelatorios = relatorios?.filter((relatorio) =>
    relatorio.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async () => {
    if (!relatorioToDelete) return

    try {
      await deleteRelatorio(relatorioToDelete)
      setRelatorioToDelete(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleGerarRelatorio = async (relatorio: any, formato: 'pdf' | 'excel' | 'csv') => {
    try {
      switch (formato) {
        case 'pdf':
          await gerarPDF(relatorio.id)
          break
        case 'excel':
          await gerarExcel(relatorio.id)
          break
        case 'csv':
          await gerarCSV(relatorio.id)
          break
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[300px]" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar relatórios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredRelatorios?.map((relatorio) => (
          <Card key={relatorio.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <h3 className="font-medium">{relatorio.titulo}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {relatorio.descricao}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{relatorio.tipo}</Badge>
                  <Badge variant="outline">{relatorio.formato}</Badge>
                  <Badge
                    variant={
                      relatorio.status === 'concluido'
                        ? 'success'
                        : relatorio.status === 'processando'
                        ? 'warning'
                        : relatorio.status === 'erro'
                        ? 'destructive'
                        : 'default'
                    }
                  >
                    {relatorio.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(relatorio.created_at), 'PPp', {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {relatorio.status === 'concluido' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleGerarRelatorio(relatorio, relatorio.formato)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/relatorios/${relatorio.id}`)}
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRelatorioToDelete(relatorio.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!relatorioToDelete} onOpenChange={() => setRelatorioToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir relatório</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 