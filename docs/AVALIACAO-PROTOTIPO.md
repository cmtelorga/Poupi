# Avaliação do protótipo anterior ("Poupi 3.0", arquivo HTML único)

Resumo do que foi encontrado e de como foi tratado nesta versão.

## Erros que quebravam o objetivo pedagógico

| Problema no protótipo | Correção |
|---|---|
| Marcar tarefa como feita **não pagava nada** | Tarefas da família agora são intencionalmente **não pagas**; trabalhos extras pagam após aprovação |
| Missão "completar 2 tarefas" **nunca avançava** | Missões semanais baseadas em ações rastreadas (lição, banco, desejo) |
| Mesada semanal **nunca era paga** | Pagamento automático no dia configurado, inclusive das semanas atrasadas |
| **Saldo e potes dessincronizavam** (depósito, plantio, gastos) | Livro-caixa único: total = potes + banco |
| **Nível nunca subia**; barra de XP passava de 100% | Nível calculado das estrelas ganhas |
| **Juros infinitos** (botão sem limite) | Juros automáticos, uma vez por mês |
| Fazendinha: dinheiro sumia; "regar" dava XP infinito | Fazenda derivada do saldo do banco; frutas = juros |
| Pai podia deixar o saldo **negativo** | Todas as regras validam saldo |
| Pagava R$ 1 por **escovar os dentes** | Removido: higiene e ajuda em casa não são transações |

## Requisitos do briefing que não eram atendidos

- Não era PWA (sem manifest, service worker e ícones) → agora é, e funciona offline.
- A interface era igual para 6 e 10 anos → agora há dois modos.
- Loja de recompensas e metas existiam nos dados, mas não na tela → metas, lista de desejos e loja implementadas.
- Ranking por XP sempre favorecia o mais velho → substituído pelo "Time da família".
- Lições podiam ser feitas todas de uma vez e a tela errada aparecia depois do acerto → uma por semana, fluxo corrigido.

## Problemas técnicos e de segurança

- CDNs sem versão fixa e Babel no navegador → build com Vite e dependências fixas.
- Datas em UTC (o dia virava às 21h; datas exibidas com um dia a menos) → datas locais.
- Dinheiro em ponto flutuante → centavos inteiros.
- IDs duplicados (`'h'+Date.now()` dentro de um loop) → IDs únicos.
- Qualquer criança entrava no painel dos pais; "resetar dados" na tela inicial → PIN dos pais; "Apagar tudo" protegido.
- Nome completo e número de cartão com aparência real → só primeiro nome, cartão simbólico.
- `maximum-scale=1` (bloqueio de zoom) → removido.
- O app abria com dados falsos (inclusive conquistas não ganhas) → primeiro uso limpo + modo demonstração separado.
