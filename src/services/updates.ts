import { supabase } from '@/lib/supabase';

export interface UpdateInfo {
  id: string;
  version: string;
  description: string;
  type: 'major' | 'minor' | 'patch';
  release_date: Date;
  changelog: string[];
  status: 'available' | 'installing' | 'installed' | 'failed';
  error?: string;
  requires_restart: boolean;
}

class UpdateService {
  // Verifica atualizações disponíveis
  async checkForUpdates(): Promise<UpdateInfo[]> {
    const currentVersion = process.env.VITE_APP_VERSION;
    
    const { data: updates } = await supabase
      .from('updates')
      .select('*')
      .gt('version', currentVersion)
      .order('version', { ascending: true });

    return (updates || []) as UpdateInfo[];
  }

  // Inicia atualização
  async startUpdate(updateId: string): Promise<void> {
    const update = await this.getUpdateInfo(updateId);
    if (!update) {
      throw new Error('Atualização não encontrada');
    }

    await this.updateStatus(updateId, 'installing');

    try {
      // 1. Faz backup antes da atualização
      await this.backupBeforeUpdate();

      // 2. Download dos arquivos de atualização
      const files = await this.downloadUpdateFiles(updateId);

      // 3. Valida arquivos
      await this.validateUpdateFiles(files);

      // 4. Aplica atualização
      await this.applyUpdate(files);

      // 5. Atualiza banco de dados se necessário
      await this.updateDatabase(update.version);

      // 6. Limpa cache
      await this.clearCache();

      await this.updateStatus(updateId, 'installed');

      // 7. Reinicia aplicação se necessário
      if (update.requires_restart) {
        await this.restartApplication();
      }
    } catch (error) {
      await this.updateStatus(updateId, 'failed', error.message);
      throw error;
    }
  }

  // Lista histórico de atualizações
  async getUpdateHistory(): Promise<UpdateInfo[]> {
    const { data: updates } = await supabase
      .from('updates')
      .select('*')
      .order('release_date', { ascending: false });

    return (updates || []) as UpdateInfo[];
  }

  // Agenda verificação automática
  async scheduleUpdateCheck(frequency: 'daily' | 'weekly'): Promise<void> {
    await supabase.from('update_schedules').insert({
      id: crypto.randomUUID(),
      frequency,
      next_check: this.calculateNextCheck(frequency),
      created_at: new Date(),
    });
  }

  // Métodos privados
  private async getUpdateInfo(updateId: string): Promise<UpdateInfo | null> {
    const { data } = await supabase
      .from('updates')
      .select('*')
      .eq('id', updateId)
      .single();
    
    return data as UpdateInfo;
  }

  private async updateStatus(
    updateId: string,
    status: UpdateInfo['status'],
    error?: string
  ): Promise<void> {
    await supabase
      .from('updates')
      .update({ status, error, updated_at: new Date() })
      .eq('id', updateId);
  }

  private calculateNextCheck(frequency: 'daily' | 'weekly'): Date {
    const now = new Date();
    
    if (frequency === 'daily') {
      now.setDate(now.getDate() + 1);
    } else {
      now.setDate(now.getDate() + 7);
    }

    return now;
  }

  private async backupBeforeUpdate(): Promise<void> {
    // Implementar backup antes da atualização
  }

  private async downloadUpdateFiles(updateId: string): Promise<Blob[]> {
    const { data: files } = await supabase.storage
      .from('updates')
      .list(updateId);

    const downloadPromises = files.map(file =>
      supabase.storage
        .from('updates')
        .download(`${updateId}/${file.name}`)
        .then(response => response.data)
    );

    return Promise.all(downloadPromises);
  }

  private async validateUpdateFiles(files: Blob[]): Promise<void> {
    // Implementar validação de arquivos
  }

  private async applyUpdate(files: Blob[]): Promise<void> {
    // Implementar aplicação da atualização
  }

  private async updateDatabase(version: string): Promise<void> {
    // Implementar atualização do banco de dados
  }

  private async clearCache(): Promise<void> {
    // Limpa cache do navegador
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }

    // Limpa cache do service worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
    }
  }

  private async restartApplication(): Promise<void> {
    // Implementar reinicialização da aplicação
    window.location.reload();
  }
}

export const updateService = new UpdateService(); 