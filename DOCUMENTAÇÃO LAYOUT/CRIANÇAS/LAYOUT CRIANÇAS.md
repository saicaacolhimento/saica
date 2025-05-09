# Layout da Página de Crianças

## 1. Container Principal
- **Classe**: `container mx-auto p-6`
- **Background**: Branco
- **Padding**: 24px (p-6)
- **Margem**: Automática nas laterais

## 2. Cabeçalho da Página
- **Layout**: Flex com justify-between e items-center
- **Margem inferior**: 24px (mb-6)
- **Título**:
  - Texto: "Crianças"
  - Tamanho: 2xl (24px)
  - Peso: Bold
- **Botão Nova Criança**:
  - Texto: "Nova Criança"
  - Estilo: Primary (padrão do tema)
  - Altura: 40px

## 3. Modal de Cadastro
### 3.1. Container do Modal
- **Largura máxima**: 2xl (42rem)
- **Altura máxima**: 85vh
- **Overflow**: Auto
- **Padding**: 16px (p-4)

### 3.2. Cabeçalho do Modal
- **Título**: "Nova Criança"
- **Tamanho**: lg
- **Peso**: Semibold
- **Margem inferior**: 16px (mb-4)

### 3.3. Formulário
- **Classe principal**: `space-y-4`
- **Grid principal**: gap-3

#### A. Informações Pessoais
- **Container**: `space-y-4`
- **Grid 2 colunas**:
  1. **Nome Completo**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true
  
  2. **Data de Nascimento**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Tipo: date
     - Required: true

  3. **Sexo**:
     - Label: text-sm
     - Select: h-8, border-2 border-gray-400
     - Opções: Masculino, Feminino
     - Required: true

  4. **Cor/Raça**:
     - Label: text-sm
     - Select: h-8, border-2 border-gray-400
     - Opções: Branca, Preta, Parda, Amarela, Indígena
     - Required: true

  5. **Naturalidade**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

  6. **Nacionalidade**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

#### B. Documentação
- **Container**: 
  - Background: gray-50
  - Padding: 12px (p-3)
  - Border radius: lg
- **Grid 2 colunas**:
  1. **RG**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

  2. **CPF**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Máscara: 000.000.000-00
     - Required: true

  3. **Certidão de Nascimento**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

  4. **Certidão de Casamento**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: false

#### C. Informações de Saúde
- **Container**: 
  - Background: gray-50
  - Padding: 12px (p-3)
  - Border radius: lg
- **Grid 2 colunas**:
  1. **Tipo Sanguíneo**:
     - Label: text-sm
     - Select: h-8, border-2 border-gray-400
     - Opções: A+, A-, B+, B-, AB+, AB-, O+, O-
     - Required: true

  2. **Alergias**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: false

  3. **Medicamentos**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: false

  4. **Deficiências**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: false

#### D. Informações Escolares
- **Container**: 
  - Background: gray-50
  - Padding: 12px (p-3)
  - Border radius: lg
- **Grid 2 colunas**:
  1. **Escola**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

  2. **Série**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

  3. **Turno**:
     - Label: text-sm
     - Select: h-8, border-2 border-gray-400
     - Opções: Manhã, Tarde, Noite
     - Required: true

  4. **Transporte Escolar**:
     - Label: text-sm
     - Select: h-8, border-2 border-gray-400
     - Opções: Sim, Não
     - Required: true

#### E. Informações Familiares
- **Container**: 
  - Background: gray-50
  - Padding: 12px (p-3)
  - Border radius: lg
- **Grid 2 colunas**:
  1. **Nome da Mãe**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

  2. **Nome do Pai**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: false

  3. **Telefone de Contato**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

  4. **Endereço Familiar**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

#### F. Informações de Acolhimento
- **Container**: 
  - Background: gray-50
  - Padding: 12px (p-3)
  - Border radius: lg
- **Grid 2 colunas**:
  1. **Data de Entrada**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Tipo: date
     - Required: true

  2. **Motivo do Acolhimento**:
     - Label: text-sm
     - Textarea: min-h-[80px]
     - Required: true

  3. **Medida de Proteção**:
     - Label: text-sm
     - Select: h-8, border-2 border-gray-400
     - Opções: Guarda, Tutela, Adoção
     - Required: true

  4. **Vara da Infância**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

### 3.4. Botões do Modal
- **Container**: 
  - Flex com justify-end
  - Gap: 8px (space-x-2)
  - Padding top: 16px (pt-4)
  - Borda superior: border-t
- **Botões**:
  - Cancelar: variant="outline"
  - Salvar: variant="default" (primary)

## 4. Barra de Busca
- **Margem inferior**: 16px (mb-4)
- **Input**:
  - Placeholder: "Buscar crianças..."
  - Altura: 40px
  - Borda: gray-300

## 5. Tabela de Crianças
### 5.1. Container
- **Background**: Branco
- **Border radius**: lg
- **Sombra**: shadow

### 5.2. Cabeçalho da Tabela
- **Colunas**:
  - Nome
  - Data de Nascimento
  - Sexo
  - Escola
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
  - Mensagem: "Nenhuma criança encontrada." 

## 1. Container Principal
- **Classe**: `container mx-auto p-6`
- **Background**: Branco
- **Padding**: 24px (p-6)
- **Margem**: Automática nas laterais

## 2. Cabeçalho da Página
- **Layout**: Flex com justify-between e items-center
- **Margem inferior**: 24px (mb-6)
- **Título**:
  - Texto: "Crianças"
  - Tamanho: 2xl (24px)
  - Peso: Bold
- **Botão Nova Criança**:
  - Texto: "Nova Criança"
  - Estilo: Primary (padrão do tema)
  - Altura: 40px

## 3. Modal de Cadastro
### 3.1. Container do Modal
- **Largura máxima**: 2xl (42rem)
- **Altura máxima**: 85vh
- **Overflow**: Auto
- **Padding**: 16px (p-4)

### 3.2. Cabeçalho do Modal
- **Título**: "Nova Criança"
- **Tamanho**: lg
- **Peso**: Semibold
- **Margem inferior**: 16px (mb-4)

### 3.3. Formulário
- **Classe principal**: `space-y-4`
- **Grid principal**: gap-3

#### A. Informações Pessoais
- **Container**: `space-y-4`
- **Grid 2 colunas**:
  1. **Nome Completo**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true
  
  2. **Data de Nascimento**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Tipo: date
     - Required: true

  3. **Sexo**:
     - Label: text-sm
     - Select: h-8, border-2 border-gray-400
     - Opções: Masculino, Feminino
     - Required: true

  4. **Cor/Raça**:
     - Label: text-sm
     - Select: h-8, border-2 border-gray-400
     - Opções: Branca, Preta, Parda, Amarela, Indígena
     - Required: true

  5. **Naturalidade**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

  6. **Nacionalidade**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

#### B. Documentação
- **Container**: 
  - Background: gray-50
  - Padding: 12px (p-3)
  - Border radius: lg
- **Grid 2 colunas**:
  1. **RG**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

  2. **CPF**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Máscara: 000.000.000-00
     - Required: true

  3. **Certidão de Nascimento**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

  4. **Certidão de Casamento**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: false

#### C. Informações de Saúde
- **Container**: 
  - Background: gray-50
  - Padding: 12px (p-3)
  - Border radius: lg
- **Grid 2 colunas**:
  1. **Tipo Sanguíneo**:
     - Label: text-sm
     - Select: h-8, border-2 border-gray-400
     - Opções: A+, A-, B+, B-, AB+, AB-, O+, O-
     - Required: true

  2. **Alergias**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: false

  3. **Medicamentos**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: false

  4. **Deficiências**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: false

#### D. Informações Escolares
- **Container**: 
  - Background: gray-50
  - Padding: 12px (p-3)
  - Border radius: lg
- **Grid 2 colunas**:
  1. **Escola**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

  2. **Série**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

  3. **Turno**:
     - Label: text-sm
     - Select: h-8, border-2 border-gray-400
     - Opções: Manhã, Tarde, Noite
     - Required: true

  4. **Transporte Escolar**:
     - Label: text-sm
     - Select: h-8, border-2 border-gray-400
     - Opções: Sim, Não
     - Required: true

#### E. Informações Familiares
- **Container**: 
  - Background: gray-50
  - Padding: 12px (p-3)
  - Border radius: lg
- **Grid 2 colunas**:
  1. **Nome da Mãe**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

  2. **Nome do Pai**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: false

  3. **Telefone de Contato**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

  4. **Endereço Familiar**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

#### F. Informações de Acolhimento
- **Container**: 
  - Background: gray-50
  - Padding: 12px (p-3)
  - Border radius: lg
- **Grid 2 colunas**:
  1. **Data de Entrada**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Tipo: date
     - Required: true

  2. **Motivo do Acolhimento**:
     - Label: text-sm
     - Textarea: min-h-[80px]
     - Required: true

  3. **Medida de Proteção**:
     - Label: text-sm
     - Select: h-8, border-2 border-gray-400
     - Opções: Guarda, Tutela, Adoção
     - Required: true

  4. **Vara da Infância**:
     - Label: text-sm
     - Input: h-8, border-2 border-gray-400
     - Required: true

### 3.4. Botões do Modal
- **Container**: 
  - Flex com justify-end
  - Gap: 8px (space-x-2)
  - Padding top: 16px (pt-4)
  - Borda superior: border-t
- **Botões**:
  - Cancelar: variant="outline"
  - Salvar: variant="default" (primary)

## 4. Barra de Busca
- **Margem inferior**: 16px (mb-4)
- **Input**:
  - Placeholder: "Buscar crianças..."
  - Altura: 40px
  - Borda: gray-300

## 5. Tabela de Crianças
### 5.1. Container
- **Background**: Branco
- **Border radius**: lg
- **Sombra**: shadow

### 5.2. Cabeçalho da Tabela
- **Colunas**:
  - Nome
  - Data de Nascimento
  - Sexo
  - Escola
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
  - Mensagem: "Nenhuma criança encontrada." 