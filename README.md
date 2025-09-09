## VittaHub

Aplicação SPA construída com React + Vite para descoberta, comparação e agendamento de clínicas e especialistas.

### Requisitos

- Node 18+
- npm 9+

### Instalação e execução

```bash
npm install
npm run dev
```

Ambiente de desenvolvimento será iniciado em `http://localhost:5173`.

### Build para produção

```bash
npm run build
npm run preview
```

### Principais funcionalidades

- Busca por clínicas e especialidades com sugestões.
- Seção “Clínicas mais bem avaliadas perto de você” com base na localização selecionada (ou GPS).
- Página de detalhe da clínica com lista de profissionais e avaliações.
- Modal de agendamento com etapas: especialista → procedimento → horário → pagamento → confirmação.
- Persistência da cidade selecionada em `localStorage` (mantém preferência ao navegar/voltar).

### Estrutura principal

- `index.html` → monta `#root` e carrega `src/main.jsx`.
- `src/main.jsx` → configura `BrowserRouter` e renderiza `App`.
- `src/App.jsx` → define rotas e layout global (Navbar/Toaster).
- `src/pages/*` → páginas: Home, Resultados, Detalhe da Clínica, Para Clínicas.
- `src/components/*` → componentes de domínio (Navbar, SearchBar, ClinicCard, ClinicCarousel, AppointmentModal, etc.).
- `src/ui/*` → UI genérica (Button, Input, Card, Toast, etc.).
- `src/constants/clinics.js` → dados mockados de clínicas.
- `src/hooks/useGeolocation.js` → utilitário de GPS com reverse geocoding (Nominatim) e normalização de estado.

### Padrões de código

- React com componentes funcionais e hooks.
- Tailwind utility-first para estilização.
- Componentes genéricos em `src/ui` e de domínio em `src/components`.
- Nomes descritivos e curtos para props; evite abreviações ambíguas.

### Acessibilidade

- Foco visível, navegação por teclado e `alt` em imagens relevantes.
- Contraste adequado e estados vazios informativos.

### QA e documentação

- Guia de funcionalidades: `docs/QA-Guia.md`.
- Checklist de testes: `docs/QA-Checklist.md`.

### Roadmap curto

- Integração com backend e autenticação.
- Perfil do especialista (CRM, experiência, agenda completa).
- Filtros avançados por convênio/planos e preço.
# Publico
