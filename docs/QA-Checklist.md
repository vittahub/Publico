## Checklist de testes para QA — VittaHub

Use este checklist como base para smoke, regressão e testes exploratórios. Ajuste conforme novos requisitos surgirem.

### 1) Navegação e rotas

- [ ] Home carrega sem erros e exibe `Navbar` e `Footer`.
- [ ] Link/Logo na `Navbar` leva para Home.
- [ ] Link "Para Clínicas" navega para `ForClinicsPage`.
- [ ] Atualização manual da URL mantém o estado esperado das páginas principais.

### 2) Busca (SearchBar)

- [ ] Digitar termo e pressionar Enter navega para resultados.
- [ ] Clicar em botão de busca (se presente) navega para resultados.
- [ ] Busca ignora caixa (case-insensitive), acentos e espaços extras.
- [ ] Busca sem termo mostra orientação/estado apropriado.
- [ ] Alterar cidade no seletor persiste em localStorage e reflete na Home sem recarregar.

### 3) Resultados de busca

- [ ] Lista de `ClinicCard` é exibida quando há resultados.
- [ ] Estado vazio aparece quando não há resultados e orienta o usuário.
- [ ] Cada `ClinicCard` possui ação de abrir detalhe e navega corretamente.

### 4) Detalhe da clínica (ClinicPage)

- [ ] Abrir detalhe exibe informações corretas da clínica selecionada.
- [ ] URL contém o ID ou slug correspondente.
- [ ] ID inválido na URL exibe estado de "não encontrado".
- [ ] Existe meio de navegação de retorno (voltar) funcional.

### 5) Geolocalização e região selecionada

- [ ] Permissão aparece apenas quando necessário.
- [ ] Aceitando, app segue sem erros e seções baseadas em região funcionam.
- [ ] Negando, app continua utilizável; mostrar mensagens quando aplicável.
- [ ] Cidade escolhida manualmente sobrepõe o GPS e persiste ao navegar/voltar.

### 6) UI e responsividade

- [ ] Layout mobile (≤ 640px) renderiza sem quebras.
- [ ] Tablet (641–1024px) e desktop (≥ 1025px) mantêm hierarquia visual.
- [ ] Cards, carrosséis e seções destacadas mantêm espaçamentos coerentes.
- [ ] Em `ClinicPage`, coluna esquerda (card da clínica) permanece fixa sem ficar sob a navbar.

### 7) Acessibilidade

- [ ] Todos os elementos interativos são alcançáveis via teclado (Tab/Shift+Tab).
- [ ] Foco visível em links, botões e inputs.
- [ ] Imagens relevantes possuem `alt` significativo.
- [ ] Contraste atende a leitura confortável (check rápido via ferramenta de contraste).

### 8) Toasts e feedbacks

- [ ] Toasts aparecem nas situações previstas (ex.: erro, info).
- [ ] Toasts somem automaticamente ou podem ser dispensados pelo usuário.

### 9) Estados de erro e vazios

- [ ] Tela de resultados vazia quando termo não retorna itens.
- [ ] Detalhe "não encontrado" para ID inválido.
- [ ] Comportamento resiliente quando geolocalização falha/é negada.

### 10) Regressão/Smoke (rápido)

- [ ] Home carrega.
- [ ] Busca navega e lista algo (com termo válido do mock `clinics.js`).
- [ ] Abrir detalhe funciona.
- [ ] Navegação para "Para Clínicas" abre página.
- [ ] Nenhum erro no console durante os fluxos acima.
- [ ] LCP/INP aceitáveis em dev (inspeção rápida no Lighthouse/Performance).
