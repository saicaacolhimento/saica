# Layout da Página Home

## 1. Header
- **Imagem de Fundo**: 
  - Arquivo: `headerImage` (header-kids.png)
  - Altura máxima: 570px
  - Largura: 100%
  - Objeto: cover

- **Logo SAICA**:
  - Posição: Centralizado
  - Distância do topo: 475px
  - Largura: 32px (w-32)
  - Transformação: Centralizado com translate

- **Formulário de Login**:
  - Posição: Absoluta
  - Distância do topo: 8px (top-2)
  - Distância da direita: 16px (right-4)
  - Layout: Flex com items-center e space-x-1
  
  - **Campo Usuário**:
    - Largura: 180px
    - Altura: 32px (h-8)
    - Fonte: text-xs (12px)
    - Placeholder: "usuário" em minúsculo
    - Borda: gray-300
    - Tipo: text
    - Padding interno padrão
    
  - **Campo Senha**:
    - Largura: 140px
    - Altura: 32px (h-8)
    - Fonte: text-xs (12px)
    - Placeholder: "senha" em minúsculo
    - Borda: gray-300
    - Tipo: password/text (toggle)
    - Container: relative para posicionar o ícone
    
  - **Botão Mostrar/Ocultar Senha**:
    - Posição: absolute
    - Distância da direita: 8px (right-2)
    - Alinhamento vertical: centralizado (top-1/2 -translate-y-1/2)
    - Ícone:
      - Tamanho: 16px (h-4 w-4)
      - Cor: gray-500
    
  - **Botão Login**:
    - Altura: 32px (h-8)
    - Largura: 32px (w-8)
    - Background: #2563eb (blue-600)
    - Hover: #1d4ed8 (blue-700)
    - Cor do texto: Branco
    - Border radius: 2px (rounded-sm)
    - Ícone seta: 12px (h-3 w-3)
    - Display: flex
    - Alinhamento: items-center justify-center
    
  - **Botão Ajuda**:
    - Altura: 24px (h-6)
    - Largura: 24px (w-6)
    - Background: gray-200
    - Hover: gray-300
    - Cor do texto: gray-600
    - Border radius: full (circular)
    - Fonte: text-xs
    - Display: flex
    - Alinhamento: items-center justify-center
    - Conteúdo: "?"

## 2. Barra de Título
- **Background**: `#6366F1` (Indigo)
- **Altura**: 80px
- **Margem superior**: 50px
- **Texto**:
  - Título: 2.5em, semibold
  - Subtítulo: 1.5em
  - Cor: Branco
  - Alinhamento: Centralizado

## 3. Conteúdo Principal
- **Container**:
  - Largura máxima: container
  - Padding horizontal: 4 (16px)
  - Padding vertical: 8 (32px)

- **Grid de 2 Colunas**:
  - Gap: 8 (32px)
  
  ### Coluna Esquerda
  - **Diagrama SAICA**:
    - Padding esquerdo: 20 (80px)
    - Largura máxima: 500px
    - Imagem responsiva

  ### Coluna Direita
  - **Card Informativo**:
    - Background: Branco
    - Sombra: shadow-lg
    - Border radius: lg
    - Padding: 6 (24px)
    - Largura máxima: 500px
    
    - **Título**:
      - Cor: #6366F1 (Indigo)
      - Tamanho: 2xl
      - Peso: Bold
      - Margem inferior: 4 (16px)
      - Alinhamento: Centralizado
    
    - **Texto**:
      - Cor: gray-600
      - Tamanho: lg
      - Espaçamento entre parágrafos: 4 (16px)
      - Margem inferior: 8 (32px)

## 4. Footer
- **Background**: gray-100
- **Padding vertical**: 8 (32px)
- **Texto**:
  - Cor: gray-600
  - Alinhamento: Centralizado
  - Container com padding horizontal: 4 (16px)

## 5. Cores
- **Principal**: #6366F1 (Indigo)
- **Texto**: 
  - Principal: gray-600
  - Títulos: #6366F1
- **Backgrounds**:
  - Principal: Branco
  - Footer: gray-100
  - Barra de título: #6366F1

## 6. Responsividade
- **Header**: Imagem responsiva com altura máxima
- **Grid**: Duas colunas em desktop, uma coluna em mobile
- **Containers**: Responsivos com padding adaptativo
- **Imagens**: Responsivas com larguras máximas definidas 

## 1. Header
- **Imagem de Fundo**: 
  - Arquivo: `headerImage` (header-kids.png)
  - Altura máxima: 570px
  - Largura: 100%
  - Objeto: cover

- **Logo SAICA**:
  - Posição: Centralizado
  - Distância do topo: 475px
  - Largura: 32px (w-32)
  - Transformação: Centralizado com translate

- **Formulário de Login**:
  - Posição: Absoluta
  - Distância do topo: 8px (top-2)
  - Distância da direita: 16px (right-4)
  - Layout: Flex com items-center e space-x-1
  
  - **Campo Usuário**:
    - Largura: 180px
    - Altura: 32px (h-8)
    - Fonte: text-xs (12px)
    - Placeholder: "usuário" em minúsculo
    - Borda: gray-300
    - Tipo: text
    - Padding interno padrão
    
  - **Campo Senha**:
    - Largura: 140px
    - Altura: 32px (h-8)
    - Fonte: text-xs (12px)
    - Placeholder: "senha" em minúsculo
    - Borda: gray-300
    - Tipo: password/text (toggle)
    - Container: relative para posicionar o ícone
    
  - **Botão Mostrar/Ocultar Senha**:
    - Posição: absolute
    - Distância da direita: 8px (right-2)
    - Alinhamento vertical: centralizado (top-1/2 -translate-y-1/2)
    - Ícone:
      - Tamanho: 16px (h-4 w-4)
      - Cor: gray-500
    
  - **Botão Login**:
    - Altura: 32px (h-8)
    - Largura: 32px (w-8)
    - Background: #2563eb (blue-600)
    - Hover: #1d4ed8 (blue-700)
    - Cor do texto: Branco
    - Border radius: 2px (rounded-sm)
    - Ícone seta: 12px (h-3 w-3)
    - Display: flex
    - Alinhamento: items-center justify-center
    
  - **Botão Ajuda**:
    - Altura: 24px (h-6)
    - Largura: 24px (w-6)
    - Background: gray-200
    - Hover: gray-300
    - Cor do texto: gray-600
    - Border radius: full (circular)
    - Fonte: text-xs
    - Display: flex
    - Alinhamento: items-center justify-center
    - Conteúdo: "?"

## 2. Barra de Título
- **Background**: `#6366F1` (Indigo)
- **Altura**: 80px
- **Margem superior**: 50px
- **Texto**:
  - Título: 2.5em, semibold
  - Subtítulo: 1.5em
  - Cor: Branco
  - Alinhamento: Centralizado

## 3. Conteúdo Principal
- **Container**:
  - Largura máxima: container
  - Padding horizontal: 4 (16px)
  - Padding vertical: 8 (32px)

- **Grid de 2 Colunas**:
  - Gap: 8 (32px)
  
  ### Coluna Esquerda
  - **Diagrama SAICA**:
    - Padding esquerdo: 20 (80px)
    - Largura máxima: 500px
    - Imagem responsiva

  ### Coluna Direita
  - **Card Informativo**:
    - Background: Branco
    - Sombra: shadow-lg
    - Border radius: lg
    - Padding: 6 (24px)
    - Largura máxima: 500px
    
    - **Título**:
      - Cor: #6366F1 (Indigo)
      - Tamanho: 2xl
      - Peso: Bold
      - Margem inferior: 4 (16px)
      - Alinhamento: Centralizado
    
    - **Texto**:
      - Cor: gray-600
      - Tamanho: lg
      - Espaçamento entre parágrafos: 4 (16px)
      - Margem inferior: 8 (32px)

## 4. Footer
- **Background**: gray-100
- **Padding vertical**: 8 (32px)
- **Texto**:
  - Cor: gray-600
  - Alinhamento: Centralizado
  - Container com padding horizontal: 4 (16px)

## 5. Cores
- **Principal**: #6366F1 (Indigo)
- **Texto**: 
  - Principal: gray-600
  - Títulos: #6366F1
- **Backgrounds**:
  - Principal: Branco
  - Footer: gray-100
  - Barra de título: #6366F1

## 6. Responsividade
- **Header**: Imagem responsiva com altura máxima
- **Grid**: Duas colunas em desktop, uma coluna em mobile
- **Containers**: Responsivos com padding adaptativo
- **Imagens**: Responsivas com larguras máximas definidas 