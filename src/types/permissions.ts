import { UserRole } from './auth'

export type PermissionType = 'read' | 'write' | 'delete' | 'admin'

export interface Permission {
  id: string
  role: UserRole
  table: string
  field: string
  permission_type: PermissionType
  created_at: string
  updated_at: string
}

export interface CreatePermissionData {
  role: UserRole
  table: string
  field: string
  permission_type: PermissionType
}

export interface UpdatePermissionData {
  role?: UserRole
  table?: string
  field?: string
  permission_type?: PermissionType
}

export interface PermissionMatrix {
  [role: string]: {
    [table: string]: {
      [field: string]: PermissionType[]
    }
  }
}

export interface UserPermission {
  user_id: string
  role: UserRole
  permissions: Permission[]
  created_at: string
  updated_at: string
}

export interface CreateUserPermissionData {
  user_id: string
  role: UserRole
  permissions: Permission[]
}

export interface UpdateUserPermissionData {
  role?: UserRole
  permissions?: Permission[]
}

export interface ShelterPermission {
  shelter_id: string
  role: UserRole
  permissions: Permission[]
  created_at: string
  updated_at: string
}

export interface CreateShelterPermissionData {
  shelter_id: string
  role: UserRole
  permissions: Permission[]
}

export interface UpdateShelterPermissionData {
  role?: UserRole
  permissions?: Permission[]
}

export interface OrgaoPermission {
  orgao_id: string
  role: UserRole
  permissions: Permission[]
  created_at: string
  updated_at: string
}

export interface CreateOrgaoPermissionData {
  orgao_id: string
  role: UserRole
  permissions: Permission[]
}

export interface UpdateOrgaoPermissionData {
  role?: UserRole
  permissions?: Permission[]
} 

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