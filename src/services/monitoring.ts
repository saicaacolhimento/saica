import { supabase } from '@/lib/supabase';

export interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  response_time: number;
  active_users: number;
  error_count: number;
  timestamp: Date;
}

export interface ErrorLog {
  id: string;
  message: string;
  stack_trace: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  user_id?: string;
  context: Record<string, any>;
}

export interface PerformanceMetrics {
  page_load_time: number;
  first_contentful_paint: number;
  largest_contentful_paint: number;
  first_input_delay: number;
  cumulative_layout_shift: number;
  timestamp: Date;
  page_url: string;
}

class MonitoringService {
  // Coleta métricas do sistema
  async collectSystemMetrics(): Promise<void> {
    const metrics: SystemMetrics = {
      cpu_usage: this.getCPUUsage(),
      memory_usage: this.getMemoryUsage(),
      disk_usage: this.getDiskUsage(),
      response_time: await this.measureResponseTime(),
      active_users: await this.getActiveUsers(),
      error_count: await this.getErrorCount(),
      timestamp: new Date(),
    };

    await this.saveMetrics(metrics);
  }

  // Registra erros
  async logError(error: Error, severity: ErrorLog['severity'], context: Record<string, any> = {}): Promise<void> {
    const errorLog: ErrorLog = {
      id: crypto.randomUUID(),
      message: error.message,
      stack_trace: error.stack || '',
      severity,
      timestamp: new Date(),
      user_id: await this.getCurrentUserId(),
      context,
    };

    await this.saveErrorLog(errorLog);
    
    if (severity === 'critical') {
      await this.notifyAdmins(errorLog);
    }
  }

  // Coleta métricas de performance
  async collectPerformanceMetrics(pageUrl: string): Promise<void> {
    const metrics: PerformanceMetrics = {
      page_load_time: performance.now(),
      first_contentful_paint: this.getFCP(),
      largest_contentful_paint: this.getLCP(),
      first_input_delay: this.getFID(),
      cumulative_layout_shift: this.getCLS(),
      timestamp: new Date(),
      page_url: pageUrl,
    };

    await this.savePerformanceMetrics(metrics);
  }

  // Métodos privados de utilidade
  private async saveMetrics(metrics: SystemMetrics): Promise<void> {
    await supabase.from('system_metrics').insert(metrics);
  }

  private async saveErrorLog(errorLog: ErrorLog): Promise<void> {
    await supabase.from('error_logs').insert(errorLog);
  }

  private async savePerformanceMetrics(metrics: PerformanceMetrics): Promise<void> {
    await supabase.from('performance_metrics').insert(metrics);
  }

  private async getCurrentUserId(): Promise<string | undefined> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
  }

  private getCPUUsage(): number {
    // Implementação real dependeria de métricas do servidor
    return Math.random() * 100;
  }

  private getMemoryUsage(): number {
    return performance.memory?.usedJSHeapSize || 0;
  }

  private getDiskUsage(): number {
    // Implementação real dependeria de métricas do servidor
    return Math.random() * 100;
  }

  private async measureResponseTime(): Promise<number> {
    const start = performance.now();
    await supabase.from('health_check').select('*').limit(1);
    return performance.now() - start;
  }

  private async getActiveUsers(): Promise<number> {
    const { count } = await supabase
      .from('active_sessions')
      .select('*', { count: 'exact' });
    return count || 0;
  }

  private async getErrorCount(): Promise<number> {
    const { count } = await supabase
      .from('error_logs')
      .select('*', { count: 'exact' })
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    return count || 0;
  }

  private getFCP(): number {
    // Implementação usando Web Vitals
    return 0;
  }

  private getLCP(): number {
    // Implementação usando Web Vitals
    return 0;
  }

  private getFID(): number {
    // Implementação usando Web Vitals
    return 0;
  }

  private getCLS(): number {
    // Implementação usando Web Vitals
    return 0;
  }

  private async notifyAdmins(errorLog: ErrorLog): Promise<void> {
    const { data: admins } = await supabase
      .from('users')
      .select('email')
      .eq('role', 'admin');

    if (admins) {
      // Implementar notificação via email/SMS
    }
  }
}

export const monitoringService = new MonitoringService(); 