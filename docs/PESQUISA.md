# Base científica do Poupi

Este documento separa o que a pesquisa **sustenta bem**, o que é **plausível mas pouco testado** e o que **não conseguimos confirmar**. Educação financeira infantil é uma área com muita opinião e pouco ensaio controlado. Ser honesto sobre isso é parte do produto.

Legenda de força da evidência: 🟢 forte · 🟡 moderada / correlacional · 🟠 princípio sólido, aplicação pouco testada · 🔴 não confirmado

---

## 1. Os pais são o principal "professor" 🟡

- **Gudmunson & Danes (2011)**, *Journal of Family and Economic Issues*: revisão que propõe o modelo de **socialização financeira familiar**. A família transmite atitudes, hábitos e conhecimento, tanto de forma explícita (conversas) quanto implícita (exemplo).
- **Shim, Barber, Card, Xiao & Serido (2010)**, *Journal of Youth and Adolescence*: em universitários, a influência dos pais sobre o comportamento financeiro foi maior que a do trabalho e da educação formal.

**No app:** o "Papo da semana" ligado a cada lição e a **Jornada dos Pais**. O app é o pretexto; a conversa é o ensino.

## 2. Não pagar pela ajuda em casa 🟢 (em laboratório)

- **Warneken & Tomasello (2008)**, *Developmental Psychology*: crianças de 20 meses que recebiam recompensa material por ajudar passaram a ajudar **menos** depois, em comparação com as que recebiam só elogio ou nada.
- **Deci, Koestner & Ryan (1999)**, *Psychological Bulletin*, meta-análise com 128 estudos: recompensas tangíveis **esperadas** e condicionadas à tarefa reduzem a motivação intrínseca.
- **Nuance:** o efeito de "superjustificação" é mais forte em atividades que a criança já gostaria de fazer. Tarefas chatas não têm muita motivação intrínseca a perder. Por isso o argumento mais forte aqui é o de Warneken & Tomasello sobre o **ajudar**, e o argumento prático: pagar tudo transforma a casa em negociação e dá à criança uma saída ("não preciso de dinheiro, não vou arrumar").

**No app:** tarefas da família não dão dinheiro nem estrelas, só um "obrigado" dos pais. **Trabalhos extras** opcionais são pagos e ensinam que trabalho gera renda.

## 3. Mesada fixa e previsível 🟡

- Estudos sobre mesada **isolada** têm resultados mistos: receber mesada, por si só, não garante melhor comportamento financeiro. O que aparece com mais consistência é mesada **acompanhada de conversa e autonomia** para decidir (ver item 1).
- **Kidd, Palmeri & Aslin (2013)**, *Cognition*: no "teste do marshmallow", crianças esperaram cerca de **4 vezes mais** quando o adulto tinha cumprido promessas antes. Ou seja, a capacidade de esperar depende de **confiar no ambiente**.
- **Watts, Duncan & Quan (2018)**, *Psychological Science*: a replicação do teste do marshmallow encontrou efeitos bem menores que os originais ao considerar o contexto familiar.

**No app:** a mesada cai sozinha, sempre no mesmo dia, e paga até as semanas em que o app ficou fechado. Os pedidos ficam visíveis até serem respondidos.

## 4. Hábitos começam cedo 🟡

- **Whitebread & Bingham (2013)**, Universidade de Cambridge, relatório para o Money Advice Service (Reino Unido): muitas atitudes e hábitos relacionados a dinheiro, como planejar e adiar gratificação, já estão presentes por volta dos **7 anos**.
- Formação de hábito: **Lally et al. (2010)**, *European Journal of Social Psychology* (UCL, **não Duke**): média de 66 dias para automatizar um comportamento, com variação enorme (18 a 254 dias).

**No app:** rotina **semanal** (mesada, potes, uma lição, missões). A ideia é o hábito, não decorar conceitos.

## 5. Educação "na hora da decisão" > aula 🟢

- **Fernandes, Lynch & Netemeyer (2014)**, *Management Science*, meta-análise com 201 estudos: intervenções de educação financeira explicam cerca de **0,1%** da variação no comportamento, e o efeito **decai com o tempo**. Os autores recomendam educação **just-in-time**, perto da decisão.
- **Kaiser & Menkhoff (2017)**, *World Bank Economic Review*: efeitos maiores quando o ensino coincide com um momento de decisão.

**No app:** o pedido de gasto mostra, na hora, quantas semanas do pote aquilo custa; a lista de desejos pede um tempo de espera proporcional ao preço (1, 3 ou 7 dias, configurável); o simulador de juros aparece onde está o dinheiro. As lições têm 2–3 min e saem **uma por semana**.

## 6. Contabilidade mental e "nudges" 🟠

- **Thaler (1999)**, *Mental Accounting Matters*, *Journal of Behavioral Decision Making*: pessoas tratam dinheiro de forma diferente conforme o "rótulo". **Thaler & Sunstein (2008)**, *Nudge*: o **padrão** escolhido define muito do comportamento.
- O **método dos 3 potes** é amplamente usado por educadores financeiros, mas **não encontramos um ensaio controlado do método em si**. O princípio (separar e rotular) é sólido; o formato exato é uma escolha de design.

**No app:** toda renda se divide sozinha (50/40/10, ajustável). Poupar é o padrão. "Pensar até amanhã" tem o mesmo destaque visual que "Pedir".

## 7. Juros compostos precisam ser vistos 🟢 (em adultos)

- **Stango & Zinman (2009)**, *Journal of Finance*: adultos subestimam sistematicamente o crescimento exponencial ("viés do crescimento exponencial"), o que se associa a mais dívida e menos poupança.

**No app:** o "bônus da família" é de 1% ao mês por padrão (configurável; famílias que já usavam 3% mantêm o valor, com aviso). O simulador mostra também quanto renderia "num banco de verdade" (referência em `src/domain/config.js`). A fazendinha transforma o saldo em árvores e os juros em frutas. Há também o simulador "e se eu deixar guardado?".

## 8. Generosidade faz bem 🟡

- **Aknin, Hamlin & Dunn (2012)**, *PLoS ONE*: crianças com menos de 2 anos mostraram mais felicidade ao **dar** petiscos do que ao receber, e mais ainda quando davam dos próprios.
- **Dunn, Aknin & Norton (2008)**, *Science*: gastar com outros aumentou o bem-estar de adultos.

**No app:** o pote Doar com causas que a criança escolhe; a doação é entregue junto com os pais.

## 9. Elogiar o processo 🟡

- **Mueller & Dweck (1998)**, *Journal of Personality and Social Psychology*: crianças elogiadas pela inteligência evitaram desafios e persistiram menos após falhar do que as elogiadas pelo esforço. Replicações posteriores mostram efeitos menores, na mesma direção.

**No app:** mensagens celebram ações ("você pensou antes", "você guardou"), nunca rótulos. Errar o quiz não revela a resposta nem pune: a criança tenta outra opção.

## 10. Gamificação sem vício 🟢 / 🟡

- **Teoria da Autodeterminação**, Ryan & Deci (2000), *American Psychologist*: motivação saudável apoia **autonomia**, **competência** e **pertencimento**.
- **Zendle & Cairns (2018)**, *PLoS ONE*: gastos com *loot boxes* associados a sintomas de jogo problemático (correlacional).
- **Csikszentmihalyi (flow)**: progressão clara e desafio adequado mantêm engajamento → níveis e trilha visíveis.
- **Gee (2003)**, *What Video Games Have to Teach Us About Learning and Literacy*: "identidade projetiva" → avatar personalizável.
- **Efeito Zeigarnik:** a ideia de que tarefas incompletas são mais lembradas tem **replicação inconsistente**. Mais robusta é a tendência de **retomar** tarefas interrompidas (efeito Ovsiankina). Usamos isso de leve, com 3 missões semanais abertas, sem cobrança diária.

**No app:** uma única moeda de jogo (estrelas), ganha **aprendendo e decidindo**; missões **semanais**; sequência em **semanas** que tolera a semana em andamento; loja com preço fixo e visível; **nenhum** sorteio, caixa-surpresa, oferta relâmpago ou ranking entre irmãos.

## 11. Concreto antes do abstrato (Piaget) 🟠

Crianças de 6–7 anos estão saindo do estágio pré-operatório e entrando no operatório concreto: conceitos abstratos (juros, custo de oportunidade) precisam de **representação física**.

**No app (modo até 7 anos):** potes de vidro que enchem, moedas tocáveis em vez de teclado, fazendinha, áudio 🔊, respostas com emoji, menos texto.

---

## O que estava no briefing e não confirmamos 🔴

| Afirmação | Situação |
|---|---|
| "University of Minnesota (2021)": mesada vinculada a tarefas | Não localizamos esse estudo. Mesmo que exista, a evidência acima (itens 2 e 3) recomenda o contrário para tarefas de contribuição. |
| "Cambridge 2020" | O relatório conhecido é de **2013** (Whitebread & Bingham). |
| "66 dias, Duke University" | O estudo é de **Lally et al. (2010), UCL**, com grande variação individual. |
| "Nunito aumenta a legibilidade em 23%" | Sem fonte localizada. Nunito foi mantida por ser arredondada e amigável, não por esse número. |
| "Streaks estilo Duolingo" | Mantidos em versão **semanal e gentil**, porque sequências diárias com risco de perda são exatamente a mecânica de pressão que o próprio briefing proíbe. |

> Antes de usar qualquer referência em material de venda, confira a fonte original. As citações acima vêm do conhecimento do assistente que montou o projeto e devem ser verificadas.

---

## Atualização de nov/2026

Revisão feita a partir de uma pesquisa com meta-análises, dados do PISA 2022, normas brasileiras e levantamento de concorrentes. O que mudou no app e por quê. **Fato verificado**, **inferência** e **especulação** estão separados.

| Decisão | Evidência | Nível | O que mudou |
|---|---|---|---|
| Juros de 3% a.m. (≈ 42,6% a.a., cerca de 3× a Selic de 13,75% a.a. citada na pesquisa) | Stango & Zinman (2009) para o viés exponencial; as taxas de mercado vêm de fontes de notícias e devem ser reconferidas | Moderada | Padrão de 1% para famílias novas; rótulo "bônus da família"; aviso quando > 1,5%; "cartão de realidade" no simulador |
| Sequências que zeram | Aversão à perda (princípio); evidência em crianças é mista | Fraca a moderada | Sequência elástica: uma semana sem atividade não zera; sem mensagens de perda |
| Espera fixa de 1 dia | Mischel (hot/cool); Kidd et al. (2013): a espera só funciona com adultos confiáveis. **Não há estudo de "24 h" em crianças.** | Fraca a moderada | Espera por faixa de preço (em mesadas), editável; mínimo 1 dia |
| Prêmio por ajudar/doar | Deci, Koestner & Ryan (1999); Warneken & Tomasello (2008) | Moderada | Auditado: nenhuma tarefa de casa nem doação dá estrelas (agora com teste). Reflexão ("como você se sentiu?") sem nota e sem prêmio |
| Conquista "Recebeu 5 obrigados" | O "obrigado" é feedback verbal dos pais por ajudar em casa (o código mostra isso); feedback verbal positivo não reduz a motivação (Deci et al., 1999) | Moderada | **Mantida.** A pesquisa externa sugeria remover, por entender que premiava a generosidade, mas ela mede agradecimento dos pais. Decisão do dono do produto, revisável |
| Lições espaçadas | Cepeda et al. (2006); Roediger & Karpicke (2006) | Forte (espaçamento) | Trilha de 12 para 17 lições e 1 pergunta de revisão (recuperação) antes de cada lição nova |
| Conteúdo faltante | Currículos de educação financeira (OCDE/PISA etc.) | Moderada | Novas lições: troco, planejar a semana, inflação, dinheiro em jogos, golpes. (Preciso×quero, preços e propaganda já existiam) |
| Pós-compra | Reflexão e aprendizado com decisões | Fraca (indireta) | "Valeu a pena?" 7 dias depois de gastar, sem nota |
| Socialização dos pais | Gudmunson & Danes (2011); Drever et al. (2015) | Moderada | Resumo semanal compartilhável, com conversa sugerida e dica de modelagem |
| Privacidade de menores | LGPD art. 14; ECA Digital (Lei 15.211/2025, em vigor desde 17/03/2026) | Normativa | Consentimento do responsável no primeiro uso; política dentro do app e em `privacidade.html`; bloqueio de PIN; backup criptografado |

**Limites e contradições conhecidos**
- Efeitos de programas de educação financeira são pequenos no comportamento e decaem com o tempo (Fernandes, Lynch & Netemeyer, 2014; Kaiser et al., 2022). Nenhum app de mesada tem ensaio randomizado publicado, e o Poupi também não: a Fase 1.5 do roadmap deve medir uso e comportamento.
- Quase toda a base sobre potes, espera e "eu futuro" vem de adultos; a extrapolação para 6–10 anos é razoável, mas não demonstrada.
- Um incentivo forte (juros altos) pode gerar mais poupança no curto prazo; o ajuste preserva a opção (campo configurável), mas muda o padrão.
- A pesquisa externa tinha afirmações de mercado não verificadas na fonte primária (listadas em `docs/BENCHMARK.md`).
- A regulamentação técnica do ECA Digital estava em andamento; revisar em 2027 e validar com advogado.
