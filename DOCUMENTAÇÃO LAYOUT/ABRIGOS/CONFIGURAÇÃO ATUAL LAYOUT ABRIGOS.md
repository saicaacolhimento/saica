# Configuração Atual do Layout de Abrigos

## 1. Container Principal
- **Classe**: `container mx-auto p-6`
- **Background**: Branco
- **Padding**: 24px (p-6)
- **Margem**: Automática nas laterais

## 2. Cabeçalho da Página
- **Layout**: Flex com justify-between e items-center
- **Margem inferior**: 24px (mb-6)
- **Título**:
  - Texto: "Abrigos"
  - Tamanho: 2xl (24px)
  - Peso: Bold
- **Botão Novo Abrigo**:
  - Texto: "Novo Abrigo"
  - Estilo: Primary (padrão do tema)
  - Altura: 40px

## 3. Modal de Cadastro
### 3.1. Container do Modal
- **Largura máxima**: 2xl (42rem)
- **Altura máxima**: 85vh
- **Overflow**: Auto
- **Padding**: 16px (p-4)

### 3.2. Cabeçalho do Modal
- **Título**: "Novo Abrigo"
- **Tamanho**: lg
- **Peso**: Semibold
- **Margem inferior**: 16px (mb-4)

### 3.3. Formulário
- **Classe principal**: `space-y-4`
- **Grid principal**: gap-3

#### A. Upload de Logo
- **Container**: `space-y-1`
- **Label**: "Logo do Abrigo" (text-sm)
- **Área de Upload**:
  - Dimensões: 128px x 128px (w-32 h-32)
  - Borda: Pontilhada (border-2 border-dashed)
  - Border radius: lg
  - Estado hover: border-gray-400
  - Ícone: 32px (h-8 w-8)
  - Cor do ícone: gray-400
  - Texto: "Clique para upload" (text-sm text-gray-500)

#### B. Informações Básicas (Grid 2 colunas)
1. **Nome do Abrigo**:
   - Label: text-sm
   - Input:
     - Altura: 32px (h-8)
     - Borda: 2px gray-400
     - Tipo: text
     - Required: true

2. **Capacidade**:
   - Label: text-sm
   - Input:
     - Altura: 32px (h-8)
     - Borda: 2px gray-400
     - Tipo: number
     - Min: 0
     - Required: true

#### C. Endereço
1. **Endereço Completo**:
   - Label: text-sm
   - Input: h-8, border-2 border-gray-400
   - Required: true

2. **Grid Cidade/Estado** (2 colunas):
   - Cidade:
     - Label: text-sm
     - Componente: Input com Autocomplete
     - Funcionalidades:
       - Busca automática após 3 caracteres
       - Lista dropdown com scroll
       - Máximo 10 resultados por busca
       - Filtragem por texto contido no nome da cidade
       - Preenchimento automático do estado
       - Estados de loading e "nenhuma cidade encontrada"
     - Estilo:
       - Input: h-8, border-2 border-gray-400
       - Dropdown: absolute, z-50, bg-white, border, rounded-md, shadow-lg
       - Lista: max-h-60, overflow-auto
       - Item da lista: px-2 py-1, text-sm, hover:bg-gray-100
     - Required: true
   - Estado:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true
     - ReadOnly: true (preenchido automaticamente ao selecionar cidade)
     - Valor: Sigla do estado (SP, RJ, etc)

3. **Grid CEP/Telefone** (2 colunas):
   - CEP:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true
   - Telefone:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

4. **Email**:
   - Label: text-sm
   - Input:
     - Tipo: email
     - Altura: 32px (h-8)
     - Borda: 2px gray-400
     - Required: true

#### D. Dados do Responsável
- **Container**: 
  - Background: gray-50
  - Padding: 12px (p-3)
  - Border radius: lg
- **Título**: text-sm font-medium text-gray-700
- **Campos**:
  1. Nome do Responsável:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true
  2. Telefone do Responsável:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true
  3. Email do Responsável:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Tipo: email
     - Required: true

#### E. Dados do Usuário Master
- **Container**: 
  - Background: gray-50
  - Padding: 12px (p-3)
  - Border radius: lg
- **Título**: text-sm font-medium text-gray-700
- **Campos**:
  1. Email do Usuário Master:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Tipo: email
     - Required: true
  
  2. Grid de Senhas (2 colunas):
     - Senha do Usuário Master:
       - Label: text-sm
       - Container: relative
       - Input:
         - Tipo: password/text (toggle)
         - Altura: h-8
         - Borda: border-2 border-gray-400
         - Padding direita: pr-10 (para o ícone)
         - Required: true
       - Botão de Visualização:
         - Posição: absolute, right-2, top-1/2, -translate-y-1/2
         - Ícone: Eye/EyeOff (16px)
         - Cores: text-gray-500, hover:text-gray-700
         - Tipo: button
     
     - Confirmação de Senha:
       - Label: text-sm
       - Container: relative
       - Input:
         - Tipo: password/text (toggle)
         - Altura: h-8
         - Borda: border-2
         - Cor da borda: border-gray-400 (normal) ou border-red-500 (quando senhas não coincidem)
         - Padding direita: pr-10 (para o ícone)
         - Required: true
       - Botão de Visualização:
         - Posição: absolute, right-2, top-1/2, -translate-y-1/2
         - Ícone: Eye/EyeOff (16px)
         - Cores: text-gray-500, hover:text-gray-700
         - Tipo: button
       - Mensagem de Erro:
         - Texto: "As senhas não coincidem"
         - Estilo: text-xs text-red-500
         - Visibilidade: Condicional (apenas quando as senhas não coincidem)
     
     - Validações:
       - Validação em tempo real ao digitar
       - Feedback visual imediato (borda vermelha)
       - Mensagem de erro dinâmica
       - Ambos os campos são obrigatórios
       - Senhas devem ser idênticas para validar

### 3.4. Botões do Modal
- **Container**: 
  - Flex com justify-end
  - Gap: 8px (space-x-2)
  - Padding top: 16px (pt-4)
  - Borda superior: border-t
- **Botões**:
  - Cancelar: variant="outline"
  - Criar: variant="default" (primary)

## 4. Barra de Busca
- **Margem inferior**: 16px (mb-4)
- **Input**:
  - Placeholder: "Buscar abrigos..."
  - Altura: 40px
  - Borda: gray-300

## 5. Tabela de Abrigos
### 5.1. Container
- **Background**: Branco
- **Border radius**: lg
- **Sombra**: shadow

### 5.2. Cabeçalho da Tabela
- **Colunas**:
  - Nome
  - Cidade
  - Estado
  - Capacidade
  - Ocupação
  - Status
  - Ações (alinhado à direita)

### 5.3. Corpo da Tabela
- **Células**:
  - Padding padrão
  - Status: Texto capitalizado
- **Botões de Ação**:
  - Layout: Flex com justify-end e space-x-2
  - Tamanho: small
  - Botões:
    - Ver: variant="outline"
    - Editar: variant="outline"
    - Excluir: variant="destructive"

## 6. Estados de Loading e Vazio
### Loading
- **Container**: container mx-auto px-4
- **Texto**: Centralizado, "Carregando..."

### Sem Resultados
- **Texto**: 
  - Centralizado
  - Cor: gray-500
  - Mensagem: "Nenhum abrigo encontrado." 