# Sistema Kanban - Gerenciador de Tarefas

Um sistema completo de gerenciamento de tarefas estilo Kanban com dashboard.

## Funcionalidades

### Quadro Kanban
- 4 colunas: A Fazer, Em Progresso, Atrasado, Concluído
- Drag-and-drop entre colunas
- Limites de WIP (Work in Progress) por coluna
- Detecção automática de tarefas atrasadas
- Data de conclusão preenchida automaticamente

### Dashboard
- Estatísticas em tempo real
- Gráficos de distribuição por status
- Taxas de conclusão diárias e semanais
- Tempo médio até conclusão
- Desempenho por responsável

### Filtros e Busca
- Filtro por status
- Filtro por responsável
- Busca global em título/descrição
- Ordenação por data de criação ou data limite

### Responsividade
- Layout adaptativo para desktop, tablet e mobile
- Menu lateral responsivo
- Interface touch-friendly

### Persistência
- Dados salvos no localStorage
- Status mantido entre sessões
- Verificação periódica de tarefas atrasadas

## Limitações
- A aplicação é apenas no front-end, limitando-se ao consumo de dados contidos em "./src/services/mockData.ts".

## Como Executar

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Instalação
- npm install
- npm run dev