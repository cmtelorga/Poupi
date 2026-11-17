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
