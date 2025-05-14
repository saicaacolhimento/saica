import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { empresaPermissionService } from '../../services/empresaPermissions';
import type { EmpresaPermission, EmpresaType } from '@/types/permissions';

export default function PermissoesEmpresa() {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<EmpresaPermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<EmpresaType>('abrigo');

  // Buscar permissões
  useEffect(() => {
    async function fetchPermissions() {
      setLoading(true);
      try {
        const data = await empresaPermissionService.getEmpresaPermissions();
        setPermissions(data);
      } catch (error) {
        toast({
          title: 'Erro ao carregar permissões',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchPermissions();
  }, []);

  // Atualizar permissões
  const handleUpdatePermission = async (
    type: EmpresaType,
    section: keyof EmpresaPermission['permissions'],
    action: string,
    checked: boolean
  ) => {
    try {
      const currentPermission = permissions.find(p => p.empresa_type === type);
      if (!currentPermission) return;

      const updatedPermissions = {
        ...currentPermission.permissions,
        [section]: {
          ...currentPermission.permissions[section],
          [action]: checked,
        },
      };

      await empresaPermissionService.updateEmpresaPermission(type, {
        permissions: updatedPermissions,
      });

      // Atualizar estado local
      setPermissions(prev =>
        prev.map(p =>
          p.empresa_type === type
            ? { ...p, permissions: updatedPermissions }
            : p
        )
      );

      toast({
        title: 'Permissões atualizadas',
        description: 'As permissões foram atualizadas com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar permissões',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configuração de Permissões por Tipo de Empresa</h1>

      <div className="mb-6">
        <Select
          value={selectedType}
          onValueChange={(value: EmpresaType) => setSelectedType(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="abrigo">Abrigo</SelectItem>
            <SelectItem value="caps">CAPS</SelectItem>
            <SelectItem value="creas">CREAS</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Módulo</TableHead>
              <TableHead>Visualizar</TableHead>
              <TableHead>Criar</TableHead>
              <TableHead>Editar</TableHead>
              <TableHead>Excluir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(permissions.find(p => p.empresa_type === selectedType)?.permissions || {}).map(([section, actions]) => (
              <TableRow key={section}>
                <TableCell className="font-medium capitalize">{section}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={actions.view}
                    onCheckedChange={(checked) =>
                      handleUpdatePermission(selectedType, section as any, 'view', checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={actions.create}
                    onCheckedChange={(checked) =>
                      handleUpdatePermission(selectedType, section as any, 'create', checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={actions.edit}
                    onCheckedChange={(checked) =>
                      handleUpdatePermission(selectedType, section as any, 'edit', checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={actions.delete}
                    onCheckedChange={(checked) =>
                      handleUpdatePermission(selectedType, section as any, 'delete', checked as boolean)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 