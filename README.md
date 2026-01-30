# MeteoInfo - Plataforma de Informativos Meteorológicos

Aplicação web responsiva para exibir e gerenciar informativos meteorológicos com sistema de autenticação para administradores.

## Funcionalidades

### Área Pública
- Visualização de informativos meteorológicos por data
- Navegação por cards com preview das informações
- Modal detalhado ao clicar em um informativo
- Interface responsiva e moderna
- Nenhum login necessário

### Área Administrativa (Protegida)
- Login com Firebase Authentication
- Criar novos informativos meteorológicos
- Editar informativos existentes
- Excluir informativos
- Cada informativo contém:
  - Data
  - Descrição meteorológica
  - Link para imagem do mapa (Imgur)

## Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Vite
- **Estilização**: Tailwind CSS
- **Roteamento**: React Router DOM
- **Backend**: Firebase
  - Firestore (banco de dados)
  - Authentication (autenticação)
- **Ícones**: Lucide React

## Como Usar

### 1. Configurar o Firebase

O Firebase já está configurado no projeto. Para criar um usuário administrador:

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto "corsa-n"
3. Vá em "Authentication" > "Users"
4. Clique em "Add user"
5. Adicione email e senha para o administrador

### 2. Mapa de Chuvas – RS (opcional)

Para a camada de precipitação no mapa, crie um arquivo `.env` na raiz com:

```
VITE_OPENWEATHER_API_KEY=sua_chave_openweather
```

Use como referência o arquivo `.env.example`. A chave pode ser obtida em [OpenWeather](https://openweathermap.org/api).

### 3. Instalar Dependências

```bash
npm install
```

Dependências do mapa: `leaflet`, `react-leaflet` (já listadas no `package.json`).

### 4. Executar em Desenvolvimento

```bash
npm run dev
```

### 5. Build para Produção

```bash
npm run build
```

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Navbar.tsx      # Barra de navegação
│   ├── ProtectedRoute.tsx  # Proteção de rotas
│   ├── WeatherCard.tsx # Card de informativo
│   └── WeatherModal.tsx # Modal de detalhes
├── contexts/           # Contextos do React
│   └── AuthContext.tsx # Contexto de autenticação
├── pages/             # Páginas da aplicação
│   ├── Home.tsx       # Página pública
│   ├── Login.tsx      # Página de login
│   └── Admin.tsx      # Painel administrativo
├── config/            # Configurações
│   └── firebase.ts    # Configuração do Firebase
├── types/             # Tipos TypeScript
│   └── index.ts       # Interfaces e tipos
└── App.tsx            # Componente principal

```

## Rotas

- `/` - Página pública com lista de informativos
- `/mapa-chuvas-rs` - Mapa de Chuvas – RS (Leaflet + OpenWeather Precipitation Layer)
- `/forecast/:city` - Previsão diária por cidade
- `/login` - Página de login para administradores
- `/admin` - Painel administrativo (requer autenticação)

## Banco de Dados (Firestore)

### Coleção: `meteorologia`

Estrutura do documento:
```typescript
{
  id: string,              // ID automático
  data: string,            // Ex: "05/02/2026"
  descricao: string,       // Texto descritivo
  imagensUrl: string[],    // Array de links do Imgur
  createdAt: number        // Timestamp
}
```

## Como Gerenciar Informativos

1. Acesse `/login` e faça login com as credenciais de administrador
2. Você será redirecionado para `/admin`
3. Clique em "Novo Informativo" para criar
4. Preencha os campos:
   - Data (ex: 05/02/2026)
   - Descrição meteorológica
   - Links das imagens do Imgur (adicione quantas quiser)
5. Clique em "Adicionar outra imagem" para incluir múltiplas mapas
6. Use os botões de editar ou excluir nos informativos listados

### Gerenciando Múltiplas Imagens

Na área pública:
- O card exibe a primeira imagem do informativo
- Ao clicar, abre um modal com navegação entre imagens
- Use os botões de seta ou os pontos na base para navegar
- Indicador mostra qual imagem está sendo visualizada (ex: 2/5)

## Links de Imagem (Imgur)

Para adicionar imagens dos mapas meteorológicos:

1. Faça upload da imagem no [Imgur](https://imgur.com)
2. Copie o link direto da imagem (termina com .jpg, .png, etc.)
3. Cole no campo "Link da Imagem" ao criar/editar um informativo

## Design

A aplicação utiliza uma paleta de cores azul e branca, remetendo ao tema meteorológico, com:
- Gradientes suaves
- Sombras e transições modernas
- Layout responsivo para todos os dispositivos
- Ícones intuitivos do Lucide React
