import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AcolhimentoSectionProps {
  form: any;
  setForm: (fn: (f: any) => any) => void;
}

export function AcolhimentoSection({ form, setForm }: AcolhimentoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Label className="w-48 font-medium">Data de Entrada</Label>
          <Input
            type="date"
            value={form.data_entrada || ''}
            onChange={e => setForm(f => ({ ...f, data_entrada: e.target.value }))}
            className="w-64 border-2 border-gray-500 focus:border-saica-blue"
          />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <Label className="w-48 font-medium">Motivo do Acolhimento</Label>
          <Input
            value={form.motivo_acolhimento || ''}
            onChange={e => setForm(f => ({ ...f, motivo_acolhimento: e.target.value }))}
            className="w-64 border-2 border-gray-500 focus:border-saica-blue"
          />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <Label className="w-48 font-medium">Número de Acolhimentos</Label>
          <Input
            type="number"
            value={form.numero_acolhimentos || ''}
            onChange={e => setForm(f => ({ ...f, numero_acolhimentos: e.target.value }))}
            className="w-64 border-2 border-gray-500 focus:border-saica-blue"
          />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <Label className="w-48 font-medium">Instituições Anteriores</Label>
          <Input
            value={form.instituicoes_anteriores || ''}
            onChange={e => setForm(f => ({ ...f, instituicoes_anteriores: e.target.value }))}
            className="w-64 border-2 border-gray-500 focus:border-saica-blue"
          />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <Label className="w-48 font-medium">Processo Judicial</Label>
          <Input
            value={form.processo_judicial || ''}
            onChange={e => setForm(f => ({ ...f, processo_judicial: e.target.value }))}
            className="w-64 border-2 border-gray-500 focus:border-saica-blue"
          />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <Label className="w-48 font-medium">Motivo de Inativação</Label>
          <Input
            value={form.motivo_inativacao || ''}
            onChange={e => setForm(f => ({ ...f, motivo_inativacao: e.target.value }))}
            className="w-64 border-2 border-gray-500 focus:border-saica-blue"
          />
        </div>
      </div>
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Label className="w-48 font-medium">Técnico de Referência</Label>
          <Input
            value={form.tecnico_referencia || ''}
            onChange={e => setForm(f => ({ ...f, tecnico_referencia: e.target.value }))}
            className="w-64 border-2 border-gray-500 focus:border-saica-blue"
          />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <Label className="w-48 font-medium">CAPS Frequentado</Label>
          <Input
            value={form.caps_frequentado || ''}
            onChange={e => setForm(f => ({ ...f, caps_frequentado: e.target.value }))}
            className="w-64 border-2 border-gray-500 focus:border-saica-blue"
          />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <Label className="w-48 font-medium">CREAS</Label>
          <Input
            value={form.creas || ''}
            onChange={e => setForm(f => ({ ...f, creas: e.target.value }))}
            className="w-64 border-2 border-gray-500 focus:border-saica-blue"
          />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <Label className="w-48 font-medium">Técnico CREAS</Label>
          <Input
            value={form.tecnico_creas || ''}
            onChange={e => setForm(f => ({ ...f, tecnico_creas: e.target.value }))}
            className="w-64 border-2 border-gray-500 focus:border-saica-blue"
          />
        </div>
      </div>
    </div>
  );
} 