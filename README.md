# Lux Companions - Site de Anúncios para Acompanhantes de Luxo

Projeto completo desenvolvido com Next.js 15, TypeScript e Prisma ORM, seguindo o padrão MVC adaptado para a stack moderna.

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js 15 com App Router
- **Linguagem**: TypeScript 5
- **Styling**: Tailwind CSS com shadcn/ui
- **Banco de Dados**: SQLite com Prisma ORM
- **Autenticação**: Sistema próprio com bcryptjs
- **Componentes**: shadcn/ui (New York style)

## 📁 Estrutura do Projeto

```
/src
  /app                    # Controllers e Views (Next.js App Router)
    /api                  # Backend APIs
      /auth              # Autenticação de usuários
      /anuncios          # CRUD de anúncios
      /admin             # APIs administrativas
    /anunciante          # Área do anunciante
      /login             # Login do anunciante
      /cadastro          # Cadastro do anunciante
      /painel            # Painel de controle
      /criar-anuncio     # Formulário de criação
    /admin               # Área administrativa
      /login             # Login do admin
      /dashboard         # Dashboard admin
      /usuarios          # Gerenciar usuários
      /anuncios          # Gerenciar anúncios
    /anuncio/[id]        # Detalhes do anúncio
    /page.tsx            # Home pública
  /components            # Componentes reutilizáveis
    /ui                  # Componentes shadcn/ui
    /layout              # Layout components
    /forms               # Formulários
    /cards               # Cards
  /lib                   # Models e utilitários
    /db.ts               # Configuração do Prisma
    /utils.ts            # Utilitários
  /types                 # Definições TypeScript
/prisma                  # Schema e seeds
/public                  # Assets estáticos
```

## 🗄️ Banco de Dados

### Schema (Prisma)

- **User**: Usuários anunciantes
- **Anuncio**: Anúncios dos usuários
- **Admin**: Administradores do sistema

### Acesso Padrão

**Administrador:**
- Usuário: `admin`
- Senha: `admin123`

**Usuários de Teste:**
- Email: `usuario1@exemplo.com` / Senha: `senha123`
- Email: `usuario2@exemplo.com` / Senha: `senha123`

## 🎨 Design e Interface

### Tema
- **Cores**: Dark + Dourado (luxo)
- **Paleta**: 
  - Background: gradient gray-900 → gray-800 → black
  - Primary: yellow-500/600 (dourado)
  - Admin: red-500/600
  - Success: green-500/600
  - Warning: orange-500/600

### Componentes
- Cards com bordas arredondadas
- Layout responsivo (mobile-first)
- Gradientes e efeitos hover
- Ícones Lucide React

## 🔐 Funcionalidades de Segurança

- ✅ Senhas com `password_hash` (bcryptjs)
- ✅ Proteção contra SQL Injection (PDO prepared statements)
- ✅ Proteção contra XSS (htmlspecialchars)
- ✅ Validação de inputs no frontend e backend
- ✅ Sistema de autenticação próprio

## 🌐 Funcionalidades Implementadas

### Área Pública
- ✅ Home com destaques premium
- ✅ Sistema de busca
- ✅ Nuvem de tags (fake)
- ✅ Listagem de anúncios em grid
- ✅ Página de detalhes do anúncio
- ✅ Botão de contato WhatsApp

### Área do Anunciante
- ✅ Login e cadastro
- ✅ Painel de controle
- ✅ Criar anúncio com upload de fotos
- ✅ Editar status do anúncio
- ✅ Excluir anúncio
- ✅ Dashboard com estatísticas

### Área Administrativa
- ✅ Login administrativo
- ✅ Dashboard completo
- ✅ Gerenciar usuários
- ✅ Gerenciar anúncios
- ✅ Aprovar/reprovar anúncios
- ✅ Estatísticas do sistema

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

1. **Clonar o projeto**
```bash
git clone <repositório>
cd lux-companions
```

2. **Instalar dependências**
```bash
npm install
```

3. **Configurar banco de dados**
```bash
# Fazer push do schema
npm run db:push

# Popular com dados iniciais
npx tsx prisma/seed.ts
```

4. **Iniciar servidor de desenvolvimento**
```bash
npm run dev
```

5. **Acessar a aplicação**
- Site: http://localhost:3000
- Área do Anunciante: http://localhost:3000/anunciante/login
- Área Admin: http://localhost:3000/admin/login

## 📱 Navegação

### URLs Principais

- **Home**: `/`
- **Detalhes Anúncio**: `/anuncio/[id]`
- **Login Anunciante**: `/anunciante/login`
- **Cadastro Anunciante**: `/anunciante/cadastro`
- **Painel Anunciante**: `/anunciante/painel`
- **Criar Anúncio**: `/anunciante/criar-anuncio`
- **Login Admin**: `/admin/login`
- **Dashboard Admin**: `/admin/dashboard`
- **Gerenciar Usuários**: `/admin/usuarios`
- **Gerenciar Anúncios**: `/admin/anuncios`

## 🔄 Fluxo de Uso

### Para Visitantes
1. Acessa a home e vê os anúncios em destaque
2. Usa a busca ou nuvem de tags para filtrar
3. Clica em um anúncio para ver detalhes
4. Usa o botão WhatsApp para contato

### Para Anunciantes
1. Faz cadastro na plataforma
2. Acessa o painel de controle
3. Cria seus anúncios com fotos
4. Gerencia status (ativo/inativo)
5. Edita ou remove anúncios

### Para Administradores
1. Faz login no painel admin
2. Visualiza dashboard com estatísticas
3. Aprova/reprova anúncios pendentes
4. Gerencia usuários (ban/delete)
5. Monitora atividade do sistema

## 🎯 Características Técnicas

### Performance
- ✅ Lazy loading de imagens
- ✅ Otimização de bundle
- ✅ Responsive design
- ✅ Componentes otimizados

### SEO
- ✅ Meta tags adequadas
- ✅ URLs amigáveis
- ✅ Estrutura semântica HTML5

### Acessibilidade
- ✅ Navegação por teclado
- ✅ ARIA labels
- ✅ Contraste adequado

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Iniciar servidor dev
npm run build        # Build para produção
npm run start        # Iniciar servidor prod

# Banco de dados
npm run db:push      # Aplicar schema
npm run db:studio    # Abrir Prisma Studio

# Código
npm run lint         # Verificar código
npm run type-check   # Verificar tipos
```

## 📝 Observações

### Upload de Imagens
Atualmente implementado com preview local. Em produção, configurar serviço de armazenamento (AWS S3, Cloudinary, etc).

### Validações
- Formatos aceitos: JPG, PNG, WebP
- Tamanho máximo: 5MB por imagem
- Máximo 3 imagens por anúncio

### Segurança
- Todas as senhas são hasheadas com bcrypt
- Validação server-side em todos os endpoints
- Proteção contra ataques comuns

## 🚀 Deploy

### Variáveis de Ambiente
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="sua-chave-secreta"
```

### Para Produção
1. Configurar banco de dados PostgreSQL/MySQL
2. Configurar serviço de upload de imagens
3. Configurar domínio e SSL
4. Ajustar variáveis de ambiente

---

**Desenvolvido com ❤️ usando Next.js 15 + TypeScript + Prisma**