# Roadmap

## Fase 1: validação em família (agora)

- [x] App completo, offline, instalável, sem servidor
- [ ] Usar por 4–6 semanas com as crianças
- [ ] Anotar toda semana: o que elas abriram sozinhas? O que ignoraram? Em que o app gerou conversa?
- [ ] Ajustar valores de mesada, percentuais dos potes e taxa de juros

**Sinais de que está funcionando:** a criança mais velha abre sozinha; a mais nova pede para "ver a fazendinha"; aparecem conversas espontâneas sobre preços e esperar.

## Fase 1.5: teste com 5–10 famílias conhecidas

- Coletar retorno qualitativo (entrevista de 15 min).
- Medir: % de semanas com lição feita, % de papos registrados, pedidos de gasto × desejos abandonados.
- Ajustar o conteúdo das lições com base nas dúvidas reais.

## Fase 2: produto (SaaS)

1. **Sincronização entre aparelhos** (pais e filhos em celulares diferentes): backend com login dos pais (ex.: Supabase), regras de acesso por família (row-level security) e perfis de criança sem e-mail nem login próprio.
2. **Conformidade legal antes de qualquer cadastro:**
   - **LGPD, art. 14**: consentimento específico e em destaque de um dos pais; melhor interesse da criança; coleta mínima.
   - **ECA Digital (Lei 15.211/2025)**: regras para produtos digitais usados por crianças (supervisão parental, proibição de loot boxes, limites a perfilamento). Validar com advogado.
   - Política de privacidade clara, exclusão de conta e de dados, sem SDKs de anúncio ou analytics de terceiros na área infantil.
3. **Notificações gentis** (só para os pais, ex.: "a Bia fez um pedido").
4. **Mais conteúdo**: trilhas de 11–14 anos, lições sazonais (Natal, volta às aulas, Dia das Crianças).
5. **Modelo de negócio sugerido**: freemium. Grátis para 1 criança com o núcleo do app; assinatura familiar (várias crianças, sincronização, trilhas extras, relatórios para os pais). Possível versão para escolas.
6. **Dinheiro real (opcional, muito depois)**: só por meio de parceiro regulado (banco ou BaaS autorizado pelo Banco Central). O modelo "banco da família" funciona muito bem sem isso.
7. **Lojas de aplicativos**: empacotar com Capacitor se fizer sentido para distribuição.

## Riscos a monitorar

- O `localStorage` pode ser apagado pelo sistema (principalmente iOS, após semanas sem uso). Por isso o backup existe, e por isso a sincronização é prioridade na fase 2.
- O engajamento pode cair depois da novidade. Use os dados da fase 1.5 antes de investir em mais gamificação.
- Conteúdo pedagógico: buscar revisão de um(a) educador(a) ou psicólogo(a) infantil antes de vender.

## Pendências da revisão de nov/2026 (não implementadas ainda)

**Maior lacuna frente aos apps brasileiros:** sincronização entre dois responsáveis e aparelhos (Fase 2, exige backend com login dos pais e criptografia ponta a ponta opcional).

- **"Onde está meu dinheiro":** marcar cada pote como cofrinho físico, conta no banco ou "com os pais" e fazer uma conferência semanal sem punição ("conte seu cofrinho"). Ponte entre o livro-caixa e o dinheiro real, importante a partir dos 9–10 anos.
- **Promessa cumprida:** registrar se o pedido que nasceu de um desejo foi atendido pelos pais (Kidd et al., 2013).
- **Convite para avós/padrinhos** registrarem presentes por link, sem login e sem dados da criança.
- **Modo escola:** trilha mapeada à BNCC e painel agregado para professores (canal que a Tindin adotou).
- **Publicação nas lojas** (Google Play via TWA; iOS) com classificação etária correta.
- **Guia neutro "como abrir a primeira conta do seu filho"** (sem afiliação oculta).
- **Avaliação de impacto** pré/pós opcional e anônima (conhecimento + 3 comportamentos).
- **Conteúdo:** revisar as lições com um(a) educador(a) ou psicólogo(a) infantil; meta de 30–40 lições em 3 níveis (6–7, 8–9, 10).
- **Layout em tela larga:** centralizar a coluna do app no desktop (hoje o cabeçalho ocupa a largura toda).
- **Monetização (hipótese a validar):** freemium por família (1 criança grátis; plano família com sincronização, trilha completa e relatórios). Faixa de preço plausível de R$ 7,90 a R$ 14,90 por mês ou R$ 59 a R$ 99 por ano, inferida de concorrentes; não validada. Nunca anúncios, venda de dados nem compras para a criança.
- **Concorrentes para testar na prática:** Dinx (lançado em 2026), Tindin, Powpay, nextJoy e contas infantis de Nubank, Inter e C6. Detalhes e ressalvas em `docs/BENCHMARK.md`.
