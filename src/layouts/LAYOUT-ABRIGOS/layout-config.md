# Configuração Detalhada do Layout - Listagem de Abrigos

## Exemplos Visuais (Prints)

### Listagem de Abrigos
![Listagem de Abrigos](../../../../prints/listagem-abrigos.png)

### Modal de Novo Abrigo (Topo)
![Modal Novo Abrigo - Topo](../../../../prints/modal-novo-abrigo-topo.png)

### Modal de Novo Abrigo (Parte Inferior)
![Modal Novo Abrigo - Inferior](../../../../prints/modal-novo-abrigo-inferior.png)

## Estrutura Geral
- **Container principal:**
  - Margem interna: `p-6` (24px)
  - Fundo: branco (`bg-white`)
  - Borda arredondada: `rounded-lg`
  - Sombra: `shadow`

## Tabela de Abrigos
- **Cabeçalho da tabela:**
  - Fonte: `font-semibold`, cor `text-gray-800`
  - Tamanho da fonte: padrão Tailwind (aprox. 1rem)
  - Alinhamento:
    - Nome: esquerda, sem quebra de linha (`whitespace-nowrap`)
    - CNPJ: centralizado, sem quebra de linha (`text-center whitespace-nowrap`)
    - Cidade: centralizado (`text-center`)
    - Estado: centralizado (`text-center`)
    - Capacidade: centralizado (`text-center`)
    - Ocupação: centralizado (`text-center`)
    - Status: esquerda
    - Ações: direita (`text-right`)
- **Linhas da tabela:**
  - Altura mínima: padrão Tailwind
  - Separação entre linhas: borda inferior sutil
  - Hover: sem destaque especial

## Colunas e Campos
- **Nome:**
  - Exibe logo à esquerda (círculo 32x32px, `w-8 h-8`), seguido do nome do abrigo
  - Fonte: padrão, cor `text-gray-900`
  - Espaçamento entre logo e nome: `gap-2`
  - Sem quebra de linha (`whitespace-nowrap`)
- **CNPJ:**
  - Centralizado, sem quebra de linha
  - Fonte: padrão, cor `text-gray-900`
- **Cidade:**
  - Centralizado
  - Fonte: padrão, cor `text-gray-900`
- **Estado:**
  - Centralizado
  - Fonte: padrão, cor `text-gray-900`
- **Capacidade:**
  - Centralizado
  - Fonte: padrão, cor `text-gray-900`
- **Ocupação:**
  - Centralizado
  - Fonte: padrão, cor `text-gray-900`
- **Status:**
  - Esquerda
  - Fonte: padrão, cor `text-gray-900`, capitalizado
- **Ações:**
  - Direita
  - Botões: "Ver", "Editar" (outline, pequenos), "Excluir" (vermelho, ícone de lixeira)
  - Espaçamento entre botões: `space-x-2`

## Botões
- **Ver/Editar:**
  - Estilo: `variant="outline"`, tamanho pequeno (`size="sm"`)
  - Cor: texto padrão, borda cinza
  - Hover: fundo cinza claro
- **Excluir:**
  - Estilo: `variant="destructive"`, tamanho pequeno
  - Cor: fundo vermelho (`bg-red-600`), texto branco
  - Ícone: lixeira (`Trash2`)
  - Hover: vermelho mais escuro

## Inputs e Filtros
- **Campo de busca:**
  - Posição: acima da tabela
  - Largura: 100%
  - Estilo: borda cinza clara, cantos arredondados
  - Placeholder: "Buscar abrigos..."

## Cores
- **Fundo principal:** `#fff` (branco)
- **Texto principal:** `#1E293B` (cinza escuro)
- **Texto secundário:** `#6B7280` (cinza médio)
- **Bordas:** `#E5E7EB` (cinza claro)
- **Botão excluir:** `#EF4444` (vermelho)
- **Botão hover:** `#DC2626` (vermelho escuro)

## Fontes
- **Fonte padrão:** Tailwind (provavelmente Inter, Roboto ou Sans-Serif)
- **Tamanho base:** 1rem (16px)
- **Peso:** normal, exceto cabeçalho (semibold)

## Responsividade
- Layout responsivo, mas a tabela pode ter rolagem horizontal em telas pequenas.

## Funções e Interações
- **Botão "Ver":** abre detalhes do abrigo
- **Botão "Editar":** abre tela de edição
- **Botão "Excluir":** abre modal de confirmação
- **Campo de busca:** filtra abrigos pelo nome
- **Logo:** se não houver, mostra círculo com inicial do nome

---

> **Este arquivo serve como referência para desenvolvedores e designers manterem a consistência visual e funcional do layout de abrigos.** 