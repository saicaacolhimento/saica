
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, AlertTriangle } from "lucide-react";

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-saica-blue mb-6">Painel de Controle</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total de Acolhidos</p>
                <p className="text-2xl font-bold">42</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-saica-blue" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Compromissos Hoje</p>
                <p className="text-2xl font-bold">7</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Relatórios Pendentes</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Alertas</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Compromissos</CardTitle>
            <CardDescription>Agenda para os próximos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start pb-4 border-b last:border-0 last:pb-0">
                  <div className="p-2 bg-blue-100 rounded-full mr-3">
                    <Calendar className="h-4 w-4 text-saica-blue" />
                  </div>
                  <div>
                    <h4 className="font-medium">Consulta Médica - Ana Silva</h4>
                    <p className="text-sm text-gray-500">Amanhã, 14:30 - Hospital Infantil</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas atualizações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start pb-4 border-b last:border-0 last:pb-0">
                  <div className="p-2 bg-gray-100 rounded-full mr-3">
                    <FileText className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Cadastro atualizado - Pedro Oliveira</h4>
                    <p className="text-sm text-gray-500">Hoje, 10:25 - por Maria Costa (Assistente Social)</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
