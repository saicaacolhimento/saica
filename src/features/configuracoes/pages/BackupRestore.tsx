import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Download, Upload, Trash2, RefreshCw } from 'lucide-react'
import { useConfiguracao } from '@/hooks/useConfiguracao'
import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const BackupRestore = () => {
  const { getBackups, deleteBackup, gerarBackup, restaurarBackup } = useConfiguracao()
  const [backupToDelete, setBackupToDelete] = useState<string | null>(null)
  const [backupToRestore, setBackupToRestore] = useState<string | null>(null)
  const [tipoBackup, setTipoBackup] = useState<'completo' | 'parcial'>('completo')

  const { data: backups, isLoading } = getBackups()

  const handleDelete = async () => {
    if (!backupToDelete) return

    try {
      await deleteBackup(backupToDelete)
      setBackupToDelete(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleRestore = async () => {
    if (!backupToRestore) return

    try {
      await restaurarBackup(backupToRestore)
      setBackupToRestore(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleGerarBackup = async () => {
    try {
      await gerarBackup(tipoBackup)
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[200px]" />
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
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Backup e Restauração</h2>
        <p className="text-muted-foreground">
          Gerencie os backups do sistema e restaure dados quando necessário.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Select
          value={tipoBackup}
          onValueChange={(value: 'completo' | 'parcial') => setTipoBackup(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tipo de backup" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="completo">Completo</SelectItem>
            <SelectItem value="parcial">Parcial</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleGerarBackup}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Gerar Backup
        </Button>
      </div>

      <div className="grid gap-4">
        {backups?.map((backup) => (
          <Card key={backup.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">
                    Backup {backup.tipo === 'completo' ? 'Completo' : 'Parcial'}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(backup.data), 'PPp', {
                    locale: ptBR,
                  })}
                </p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      backup.status === 'concluido'
                        ? 'success'
                        : backup.status === 'processando'
                        ? 'warning'
                        : backup.status === 'erro'
                        ? 'destructive'
                        : 'default'
                    }
                  >
                    {backup.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {backup.status === 'concluido' && backup.url_download && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(backup.url_download, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setBackupToRestore(backup.id)}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setBackupToDelete(backup.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!backupToDelete} onOpenChange={() => setBackupToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir backup</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este backup? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!backupToRestore} onOpenChange={() => setBackupToRestore(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurar backup</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja restaurar este backup? Esta ação irá sobrescrever os dados atuais.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore}>Restaurar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 