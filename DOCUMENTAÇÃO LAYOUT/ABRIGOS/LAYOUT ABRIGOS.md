# Layout da Página de Abrigos

## 1. Container Principal
- **Classe**: `container mx-auto p-6`
- **Background**: Branco
- **Padding**: 24px (p-6)
- **Margem**: Automática nas laterais

## 2. Cabeçalho
- **Layout**: Flex com justify-between e items-center
- **Margem inferior**: 24px (mb-6)
- **Título**:
  - Texto: "Abrigos"
  - Tamanho: 2xl (24px)
  - Peso: Bold
- **Botão Novo Abrigo**:
  - Texto: "Novo Abrigo"
  - Cor: Padrão do tema
  - Altura: 40px

## 3. Barra de Busca
- **Margem inferior**: 16px (mb-4)
- **Input**:
  - Placeholder: "Buscar abrigos..."
  - Altura: 40px
  - Borda: gray-300

## 4. Tabela de Abrigos
- **Container**: 
  - Background: Branco
  - Borda arredondada: lg
  - Sombra: shadow

- **Cabeçalho da Tabela**:
  - Colunas:
    - Nome
    - Cidade
    - Estado
    - Capacidade
    - Ocupação
    - Status
    - Ações (alinhado à direita)

- **Corpo da Tabela**:
  - Células:
    - Altura: 40px
    - Padding vertical: 12px
    - Padding horizontal: 16px
  - Status: Texto capitalizado
  - Botões de ação:
    - Layout: Flex com justify-end e space-x-2
    - Botões:
      - Ver: Outline, small
      - Editar: Outline, small
      - Excluir: Destructive, small

## 5. Modal de Novo Abrigo
- **Dimensões**:
  - Largura máxima: 2xl (42rem)
  - Altura máxima: 85vh
  - Overflow: Auto
  - Padding: 16px

- **Cabeçalho do Modal**:
  - Título: "Novo Abrigo"
  - Tamanho: lg
  - Peso: Semibold
  - Margem inferior: 16px

- **Formulário**:
  - Layout: Grid com gap de 12px
  - Seções:
    ### Informações Básicas
    - Logo do Abrigo:
      - Input tipo file
      - Preview da imagem
    - Grid de 2 colunas:
      - Nome do Abrigo (w-full)
      - Capacidade (número)
    
    ### Endereço
    - Endereço (w-full)
    - Grid de 2 colunas:
      - Cidade
      - Estado
    - Grid de 2 colunas:
      - CEP
      - Telefone
    - Email (w-full)
    
    ### Dados do Responsável
    - Background: gray-50
    - Padding: 12px
    - Border radius: lg
    - Campos:
      - Nome do Responsável
      - Telefone do Responsável
      - Email do Responsável
    
    ### Dados do Usuário Master
    - Background: gray-50
    - Padding: 12px
    - Border radius: lg
    - Campos:
      - Email do Usuário Master
      - Senha do Usuário Master
    
    ### Informações Adicionais
    - Descrição (w-full)
    - Observações (w-full)

- **Botões do Modal**:
  - Container: 
    - Flex com justify-end
    - Gap: 8px
    - Padding top: 16px
    - Borda superior
  - Botões:
    - Cancelar: Outline
    - Criar: Primary

## 6. Estilos Comuns
- **Inputs**:
  - Altura: 32px (h-8)
  - Borda: 2px gray-400
  - Border radius: Padrão
  - Padding: Padrão

- **Labels**:
  - Tamanho: sm (14px)
  - Margem inferior: 4px
  - Cor: gray-700

- **Mensagens**:
  - Texto centralizado
  - Cor: gray-500

## 7. Estados
- **Loading**:
  - Texto centralizado: "Carregando..."
  - Container com padding horizontal

- **Sem Resultados**:
  - Texto centralizado
  - Cor: gray-500
  - Mensagem: "Nenhum abrigo encontrado." 