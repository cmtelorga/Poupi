/**
 * JORNADA DOS PAIS — 12 lições curtas de psicologia financeira e parentalidade.
 *
 * Por que existe: o principal fator na educação financeira da criança são
 * os pais (Gudmunson & Danes, 2011; Shim et al., 2010). Um app sozinho
 * ensina pouco; um app que ENSINA OS PAIS a conversar ensina muito.
 *
 * Cada lição tem:
 *   body      — a ideia, em linguagem simples
 *   evidence  — de onde vem, com honestidade sobre a força da evidência
 *   inApp     — "por que o Poupi funciona assim" (liga teoria a design)
 *   challenge — uma ação prática para a semana (vale XP quando feita)
 *   quiz      — uma pergunta de fixação
 *
 * Gamificação dos pais: XP por lição, desafio e "papo da semana"; níveis com
 * títulos. Sem cobrança diária e sem notificações insistentes.
 */
export const PARENT_LEVELS = ['Curioso', 'Aprendiz', 'Parceiro', 'Mentor', 'Guia da família', 'Referência'];

export const PARENT_LESSONS = [
  {
    id: 'p-exemplo', emoji: '🪞', title: 'Você é o maior professor', minutes: 2,
    body: 'Crianças aprendem dinheiro principalmente observando e conversando com a família — muito mais do que em aulas ou apps. Como você reage a uma conta, a uma promoção ou a um imprevisto vira modelo.',
    evidence: 'Gudmunson & Danes (2011) revisaram a literatura de "socialização financeira" e colocam a família como agente central. Shim et al. (2010) encontraram influência dos pais maior que a de trabalho e escola em jovens universitários. Evidência: consistente, mas majoritariamente correlacional.',
    inApp: 'Por isso cada lição da criança vem com um "papo da semana" para você. O app é o pretexto; a conversa é o ensino.',
    challenge: 'Esta semana, pense em voz alta numa compra sua ("vou esperar a promoção?", "isso cabe no mês?") na frente das crianças.',
    quiz: { q: 'Segundo a pesquisa, quem mais influencia como a criança lida com dinheiro?', options: ['A escola', 'Os pais e a família', 'Os apps'], correct: 1 },
  },
  {
    id: 'p-cedo', emoji: '🌱', title: 'Começar cedo importa', minutes: 2,
    body: 'Hábitos ligados a dinheiro — como esperar, planejar e controlar impulsos — começam a se formar antes dos 10 anos. Não é sobre fazer contas difíceis, é sobre rotinas e atitudes.',
    evidence: 'Whitebread & Bingham (Universidade de Cambridge, 2013), relatório para o Money Advice Service do Reino Unido: muitos hábitos e atitudes financeiras já estão presentes por volta dos 7 anos. Evidência: revisão qualificada, não um experimento único.',
    inApp: 'O Poupi foca em rotina semanal (mesada, potes, uma lição) e não em decorar conceitos.',
    challenge: 'Escolha um dia fixo para a mesada e combine com as crianças. Configure no app.',
    quiz: { q: 'O foco com crianças de 6–10 anos deve ser…', options: ['Contas complexas', 'Hábitos e atitudes', 'Investimentos reais'], correct: 1 },
  },
  {
    id: 'p-mesada', emoji: '📅', title: 'Mesada é ferramenta, não salário', minutes: 3,
    body: 'Sem dinheiro previsível não há decisões para praticar. A mesada fixa existe para a criança errar e acertar com pouco. Se ela depende de tarefas, numa semana "ruim" ela simplesmente não aprende nada.',
    evidence: 'Estudos sobre mesada por si só mostram efeitos mistos — o que faz diferença é a mesada COMBINADA com conversa e autonomia para decidir (Gudmunson & Danes, 2011). O jornalista Ron Lieber ("The Opposite of Spoiled") populariza a separação mesada × tarefas. Evidência: moderada.',
    inApp: 'A mesada no Poupi cai sozinha, no dia combinado, independentemente das tarefas.',
    challenge: 'Explique às crianças que a mesada é "para aprender a cuidar de dinheiro" e não pagamento por ajudar em casa.',
    quiz: { q: 'Para que serve a mesada fixa?', options: ['Pagar as tarefas', 'Dar dinheiro previsível para praticar decisões', 'Premiar boas notas'], correct: 1 },
  },
  {
    id: 'p-tarefas', emoji: '🧹', title: 'Não pague para ajudar em casa', minutes: 3,
    body: 'Pagar por toda tarefa doméstica transforma a casa em negociação ("quanto você me paga?") e cria uma saída ("essa semana não quero dinheiro, não vou arrumar"). Ajudar a família deve ser parte de pertencer a ela.',
    evidence: 'Warneken & Tomasello (2008): crianças pequenas recompensadas por ajudar passaram a ajudar MENOS depois que a recompensa parou. Meta-análise de Deci, Koestner & Ryan (1999): recompensas tangíveis esperadas reduzem a motivação interna. Nuance honesta: o efeito é mais forte em atividades que a criança já gostaria de fazer. Evidência: forte em laboratório.',
    inApp: 'Tarefas da família não valem dinheiro nem estrelas — valem um "obrigado" seu. Trabalhos EXTRAS e opcionais (lavar o carro, por exemplo) são pagos: ensinam que trabalho gera renda.',
    challenge: 'Mande pelo menos 3 "obrigados" pelo app esta semana — específicos, dizendo o que ajudou.',
    quiz: { q: 'Qual o risco de pagar toda tarefa de casa?', options: ['Nenhum', 'A ajuda vira negociação e pode diminuir sem pagamento', 'A criança fica rica'], correct: 1 },
  },
  {
    id: 'p-esperar', emoji: '⏳', title: 'Esperar se aprende com adultos confiáveis', minutes: 3,
    body: 'O famoso "teste do marshmallow" sugeria que esperar era um traço da criança. Estudos mais novos mostram que depende muito do ambiente: criança espera quando confia que a recompensa virá.',
    evidence: 'Kidd, Palmeri & Aslin (2013): crianças esperaram cerca de 4 vezes mais quando o adulto havia cumprido promessas antes. Watts, Duncan & Quan (2018) replicaram o teste original e o efeito encolheu bastante ao considerar contexto familiar. Evidência: forte.',
    inApp: 'Mesada sempre no dia certo (automática), pedidos respondidos e a "lista de desejos" com espera de 1 dia.',
    challenge: 'Responda todos os pedidos das crianças no app em até 1 dia. Cumpra cada combinado desta semana.',
    quiz: { q: 'O que mais ajuda a criança a conseguir esperar?', options: ['Nascer paciente', 'Confiar que o adulto cumpre o que promete', 'Ficar de castigo'], correct: 1 },
  },
  {
    id: 'p-potes', emoji: '🫙', title: 'Potes: contabilidade mental a favor', minutes: 2,
    body: 'Adultos tratam dinheiro de forma diferente conforme o "rótulo" (dinheiro de férias, de contas…). Em vez de lutar contra isso, os 3 potes usam esse viés a favor: o dinheiro do sonho fica fora do alcance do impulso.',
    evidence: 'Richard Thaler, "Mental Accounting Matters" (1999), base do seu Nobel de 2017. Os 3 potes são uma prática difundida por educadores financeiros; não há um grande ensaio clínico do método em si. Evidência: princípio sólido, método específico pouco testado.',
    inApp: 'Toda entrada se divide sozinha (padrão 50/40/10, ajustável). Poupar é o padrão — não depende de força de vontade.',
    challenge: 'Ajuste os percentuais dos potes com cada criança, explicando o porquê.',
    quiz: { q: 'Por que a divisão é automática?', options: ['Para poupar virar o padrão, sem depender de força de vontade', 'Para esconder dinheiro', 'Por exigência legal'], correct: 0 },
  },
  {
    id: 'p-juros', emoji: '📈', title: 'Ninguém entende juros compostos de cabeça', minutes: 2,
    body: 'Até adultos subestimam como juros sobre juros crescem — o "viés do crescimento exponencial". Isso afeta tanto poupar quanto se endividar. Ver acontecer, mês a mês, ensina mais que a fórmula.',
    evidence: 'Stango & Zinman (2009) documentaram o viés do crescimento exponencial em adultos e sua relação com mais dívida e menos poupança. Evidência: forte em adultos.',
    inApp: 'O banco da família rende 3% ao mês (configurável). É alto de propósito: com valores pequenos, juros "realistas" seriam invisíveis. Na fazendinha, as frutas são os juros.',
    challenge: 'Mostre o histórico de juros e conversem: "o que acontece se ninguém mexer nisso por um ano?"',
    quiz: { q: 'Por que a taxa do banco do Poupi é mais alta que a real?', options: ['Erro do app', 'Para o efeito dos juros ficar visível com pouco dinheiro', 'Para dar lucro'], correct: 1 },
  },
  {
    id: 'p-elogio', emoji: '👏', title: 'Elogie a estratégia, não a criança', minutes: 2,
    body: '"Você é muito esperto com dinheiro" soa bem, mas pode deixar a criança com medo de errar. "Você esperou um dia antes de decidir, boa estratégia!" ensina o que repetir.',
    evidence: 'Mueller & Dweck (1998): crianças elogiadas pela inteligência escolheram tarefas mais fáceis e persistiram menos após fracassos do que as elogiadas pelo esforço/processo. Replicações posteriores mostram efeitos menores, mas na mesma direção. Evidência: moderada.',
    inApp: 'As mensagens do app celebram ações ("você guardou", "você pensou antes") e não rótulos.',
    challenge: 'Faça 3 elogios de processo esta semana: diga exatamente o que a criança FEZ de bom.',
    quiz: { q: 'Qual é um elogio de processo?', options: ['"Você é um gênio!"', '"Você comparou os preços antes, muito bem!"', '"Você é o melhor filho"'], correct: 1 },
  },
  {
    id: 'p-erros', emoji: '🧩', title: 'Deixe errar com pouco dinheiro', minutes: 3,
    body: 'Educação financeira "de sala de aula" tem efeito pequeno e que some com o tempo. O que funciona melhor é aprender PERTO da decisão real. Uma compra ruim de R$ 10 é uma aula barata.',
    evidence: 'Fernandes, Lynch & Netemeyer (2014), meta-análise com mais de 200 estudos: intervenções explicam ~0,1% da variação de comportamento, com decaimento ao longo do tempo; recomendam educação "just-in-time". Kaiser & Menkhoff (2017), outra meta-análise, encontram efeitos maiores quando o ensino coincide com um momento de decisão. Evidência: forte.',
    inApp: 'Os pedidos de gasto mostram, na hora da decisão, quantas semanas de pote aquilo custa. Os pais aprovam — mas o ideal é aprovar até as escolhas que você não faria.',
    challenge: 'Aprove uma compra que você acha "ruim" (dentro do pote Gastar) e converse depois, sem "eu avisei".',
    quiz: { q: 'Quando a educação financeira funciona melhor?', options: ['Em palestras longas', 'Perto de uma decisão real', 'Só na adolescência'], correct: 1 },
  },
  {
    id: 'p-doar', emoji: '❤️', title: 'Generosidade traz felicidade', minutes: 2,
    body: 'Dar faz bem a quem dá — inclusive para crianças muito pequenas. O pote Doar não é sacrifício: é uma fonte de bem-estar e de senso de propósito.',
    evidence: 'Aknin, Hamlin & Dunn (2012): crianças com menos de 2 anos ficaram mais felizes dando petiscos do que recebendo, e mais ainda quando davam dos próprios. Dunn, Aknin & Norton (2008): adultos que gastaram com outros relataram mais felicidade. Evidência: boa, com algumas replicações.',
    inApp: 'A criança escolhe a causa e pede a doação; você entrega junto com ela.',
    challenge: 'Escolham juntos uma causa e, se possível, entreguem a doação pessoalmente.',
    quiz: { q: 'O que a pesquisa diz sobre doar?', options: ['Só adultos se beneficiam', 'Até crianças pequenas ficam mais felizes dando', 'Doar deixa triste'], correct: 1 },
  },
  {
    id: 'p-jogo', emoji: '🎮', title: 'Gamificação sem vício', minutes: 3,
    body: 'Jogos podem motivar ou viciar. A diferença está em apoiar três necessidades: autonomia (eu escolho), competência (eu sei fazer) e pertencimento (minha família está junto). Mecânicas de sorte (caixas-surpresa) e cobrança diária exploram o contrário.',
    evidence: 'Teoria da Autodeterminação (Ryan & Deci, 2000). Zendle & Cairns (2018) associaram gastos com loot boxes a sintomas de jogo problemático. Evidência: SDT robusta; dados sobre loot boxes correlacionais, mas consistentes.',
    inApp: 'Sem loot box, sem ranking entre irmãos, missões SEMANAIS (não diárias), sequência em semanas e com folga, preços sempre visíveis, uma única moeda de jogo (estrelas).',
    challenge: 'Observe: o app está gerando alegria ou ansiedade? Se for ansiedade, conversem e ajustem.',
    quiz: { q: 'Qual mecânica o Poupi evita de propósito?', options: ['Metas visuais', 'Caixas-surpresa e cobrança diária', 'Lições curtas'], correct: 1 },
  },
  {
    id: 'p-conversa', emoji: '💬', title: 'Falar de dinheiro sem tabu', minutes: 2,
    body: 'Muitas famílias evitam falar de dinheiro por desconforto. Não precisa revelar salário — dá para falar de escolhas, prioridades, erros e de como você se sente em relação a dinheiro. O silêncio também ensina: ensina que o assunto é perigoso.',
    evidence: 'A literatura de socialização financeira associa a comunicação aberta sobre dinheiro na família a melhores atitudes e comportamentos financeiros dos filhos (Gudmunson & Danes, 2011; Shim et al., 2010). Evidência: consistente, majoritariamente correlacional.',
    inApp: 'O "papo da semana" é uma pergunta pronta para quebrar o gelo, ligada à lição que a criança fez.',
    challenge: 'Faça os papos da semana com cada filho por 3 semanas seguidas.',
    quiz: { q: 'Falar de dinheiro com os filhos significa…', options: ['Contar quanto você ganha', 'Conversar sobre escolhas, prioridades e erros', 'Evitar o assunto'], correct: 1 },
  },
];
