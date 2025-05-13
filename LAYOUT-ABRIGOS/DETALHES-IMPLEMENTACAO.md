# Layout e Implementação — Abrigos

## 1. Cadastro/Edição de Abrigos
- Formulário com todos os campos obrigatórios: nome, CNPJ, endereço, cidade, estado, CEP, telefone, email, capacidade, logo, responsável (nome, telefone, email), usuário master (email, senha, confirmação).
- Upload de logo com preview, botão de remover (ícone X), centralizado no topo do formulário.
- Validação de CNPJ, capacidade (0-999), senhas iguais.
- Autocomplete de cidades/estados.
- Status do abrigo: apenas "Ativo" e "Inativo".
- Permissão: apenas usuário autenticado pode criar/editar.

## 2. Listagem de Abrigos
- Tabela com colunas: Nome, CNPJ, Cidade, Estado, Capacidade, Ocupação, Status, Ações.
- Coluna "Ações" centralizada, botões de ver, editar, excluir.
- Filtros avançados: nome, cidade, estado, status (ativo/inativo).
- Campo de busca principal filtra apenas pelo nome do abrigo.
- Layout responsivo, colunas centralizadas, sem quebras de linha.

## 3. Visualização de Abrigo (Ver)
- Exibe todos os dados do abrigo, inclusive CNPJ, responsável, logo centralizada.
- Layout preparado para impressão:
  - Botão "Imprimir Ficha".
  - Apenas a ficha aparece na impressão (menus, header, sidebar ocultos).
  - Ficha centralizada, largura máxima 700px, margens removidas.
  - Logo centralizada, informações agrupadas e alinhadas.
  - CSS de impressão customizado para visual limpo e profissional.

## 4. Exclusão de Abrigos
- Modal de confirmação antes de excluir.
- Exclusão só permitida para o criador/admin.
- Mensagens de sucesso/erro com toast.

## 5. Policies e Permissões (Supabase)
- Policies de SELECT, UPDATE, DELETE, INSERT restritas ao criador/admin.
- Campo `created_by` nunca pode ser NULL.
- Policies revisadas para evitar deslogar ou bloqueios indevidos.

## 6. Usabilidade e Detalhes Visuais
- Todos os títulos de coluna centralizados.
- Botão de remover logo com ícone X pequeno, posicionado na lateral da imagem.
- Layout dos formulários e tabelas consistente com o restante do sistema.
- Mensagens de erro e sucesso claras.

## 7. Prints e Exemplos
- (Incluir prints das telas de cadastro, listagem, edição, visualização e impressão)

## 8. Observações Técnicas
- Supabase client configurado com persistência de sessão.
- Debug detalhado com logs em todas as operações críticas.
- CSS de impressão com @media print, @page, centralização e ocultação de elementos não essenciais.

---

**Este documento serve como referência para manutenção, evolução e padronização do módulo de abrigos do sistema.** 