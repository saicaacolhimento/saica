-- Adicionar campos faltantes na tabela acolhidos
-- Campos que estão no formulário mas não existem no banco

ALTER TABLE public.acolhidos
ADD COLUMN IF NOT EXISTS cras TEXT,
ADD COLUMN IF NOT EXISTS tecnico_cras TEXT,
ADD COLUMN IF NOT EXISTS historico_escolar TEXT,
ADD COLUMN IF NOT EXISTS laudo_medico TEXT,
ADD COLUMN IF NOT EXISTS receita_remedio TEXT,
ADD COLUMN IF NOT EXISTS nome_pai TEXT,
ADD COLUMN IF NOT EXISTS possui_irmaos BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS numero_irmaos INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS nomes_irmaos TEXT,
ADD COLUMN IF NOT EXISTS endereco_familia TEXT,
ADD COLUMN IF NOT EXISTS telefone_familia TEXT,
ADD COLUMN IF NOT EXISTS diagnostico_medico TEXT,
ADD COLUMN IF NOT EXISTS uso_medicacao TEXT,
ADD COLUMN IF NOT EXISTS uso_drogas TEXT,
ADD COLUMN IF NOT EXISTS escola_atual TEXT,
ADD COLUMN IF NOT EXISTS telefone_escola TEXT;

-- Comentários para documentação
COMMENT ON COLUMN public.acolhidos.cras IS 'CRAS frequentado pelo acolhido';
COMMENT ON COLUMN public.acolhidos.tecnico_cras IS 'Nome do técnico do CRAS';
COMMENT ON COLUMN public.acolhidos.historico_escolar IS 'Histórico escolar do acolhido';
COMMENT ON COLUMN public.acolhidos.laudo_medico IS 'Laudo médico do acolhido';
COMMENT ON COLUMN public.acolhidos.receita_remedio IS 'Receita de remédios';
COMMENT ON COLUMN public.acolhidos.nome_pai IS 'Nome do pai do acolhido';
COMMENT ON COLUMN public.acolhidos.possui_irmaos IS 'Indica se o acolhido possui irmãos';
COMMENT ON COLUMN public.acolhidos.numero_irmaos IS 'Número de irmãos do acolhido';
COMMENT ON COLUMN public.acolhidos.nomes_irmaos IS 'Nomes dos irmãos do acolhido';
COMMENT ON COLUMN public.acolhidos.endereco_familia IS 'Endereço da família do acolhido';
COMMENT ON COLUMN public.acolhidos.telefone_familia IS 'Telefone da família do acolhido';
COMMENT ON COLUMN public.acolhidos.diagnostico_medico IS 'Diagnóstico médico do acolhido';
COMMENT ON COLUMN public.acolhidos.uso_medicacao IS 'Informações sobre uso de medicação';
COMMENT ON COLUMN public.acolhidos.uso_drogas IS 'Informações sobre uso de drogas';
COMMENT ON COLUMN public.acolhidos.escola_atual IS 'Escola atual do acolhido';
COMMENT ON COLUMN public.acolhidos.telefone_escola IS 'Telefone da escola atual';

