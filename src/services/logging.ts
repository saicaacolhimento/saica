import { supabase } from '@/lib/supabase';

export interface LogEntry {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: Date;
  module: string;
  user_id?: string;
  metadata: Record<string, any>;
}

class LoggingService {
  // Log de informação
  async info(message: string, module: string, metadata: Record<string, any> = {}): Promise<void> {
    await this.log('info', message, module, metadata);
  }

  // Log de aviso
  async warn(message: string, module: string, metadata: Record<string, any> = {}): Promise<void> {
    await this.log('warn', message, module, metadata);
  }

  // Log de erro
  async error(message: string, module: string, metadata: Record<string, any> = {}): Promise<void> {
    await this.log('error', message, module, metadata);
  }

  // Log de debug
  async debug(message: string, module: string, metadata: Record<string, any> = {}): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      await this.log('debug', message, module, metadata);
    }
  }

  // Busca logs
  async getLogs(options: {
    level?: LogEntry['level'];
    module?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<LogEntry[]> {
    let query = supabase
      .from('logs')
      .select('*')
      .order('timestamp', { ascending: false });

    if (options.level) {
      query = query.eq('level', options.level);
    }

    if (options.module) {
      query = query.eq('module', options.module);
    }

    if (options.startDate) {
      query = query.gte('timestamp', options.startDate.toISOString());
    }

    if (options.endDate) {
      query = query.lte('timestamp', options.endDate.toISOString());
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data } = await query;
    return (data || []) as LogEntry[];
  }

  // Exporta logs
  async exportLogs(options: {
    format: 'csv' | 'json';
    startDate: Date;
    endDate: Date;
  }): Promise<Blob> {
    const logs = await this.getLogs({
      startDate: options.startDate,
      endDate: options.endDate,
    });

    if (options.format === 'csv') {
      return this.generateCSV(logs);
    } else {
      return this.generateJSON(logs);
    }
  }

  // Limpa logs antigos
  async cleanOldLogs(daysToKeep: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    await supabase
      .from('logs')
      .delete()
      .lt('timestamp', cutoffDate.toISOString());
  }

  // Métodos privados
  private async log(
    level: LogEntry['level'],
    message: string,
    module: string,
    metadata: Record<string, any>
  ): Promise<void> {
    const logEntry: LogEntry = {
      id: crypto.randomUUID(),
      level,
      message,
      timestamp: new Date(),
      module,
      user_id: await this.getCurrentUserId(),
      metadata,
    };

    await this.saveLog(logEntry);
  }

  private async saveLog(logEntry: LogEntry): Promise<void> {
    await supabase.from('logs').insert(logEntry);
  }

  private async getCurrentUserId(): Promise<string | undefined> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
  }

  private generateCSV(logs: LogEntry[]): Blob {
    const headers = ['id', 'level', 'message', 'timestamp', 'module', 'user_id', 'metadata'];
    const rows = logs.map(log => [
      log.id,
      log.level,
      log.message,
      log.timestamp,
      log.module,
      log.user_id || '',
      JSON.stringify(log.metadata),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    return new Blob([csv], { type: 'text/csv' });
  }

  private generateJSON(logs: LogEntry[]): Blob {
    return new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
  }
}

export const loggingService = new LoggingService(); 