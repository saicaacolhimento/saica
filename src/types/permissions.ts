export type EmpresaType = 'abrigo' | 'caps' | 'creas' | 'outro';

export interface EmpresaPermission {
  id: string;
  empresa_type: EmpresaType;
  permissions: {
    acolhidos: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    usuarios: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    agendamentos: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    documentos: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    relatorios: {
      view: boolean;
      export: boolean;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface CreateEmpresaPermissionData {
  empresa_type: EmpresaType;
  permissions: EmpresaPermission['permissions'];
} 