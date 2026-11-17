/**
 * TRILHA DAS CRIANÇAS — 17 microlições (uma por semana, 2–3 min).
 *
 * Cada lição tem DUAS versões:
 *   little (6–7 anos): frase curta, pode ser ouvida (🔊), respostas com emoji.
 *     Piaget: na fase pré-operatória/operatória concreta, o conceito precisa
 *     de um objeto ou cena concreta (moeda, pote, plantinha).
 *   big (8–10 anos): um pouco mais de texto, números e "e se...".
 *
 * `talk` é o "papo da semana" sugerido aos pais: a socialização financeira
 * acontece sobretudo em conversa com a família (Gudmunson & Danes, 2011),
 * então a lição no app é só o ponto de partida.
 *
 * Ordem: do concreto (de onde vem o dinheiro) para o abstrato (juros,
 * propaganda, planejamento).
 */
export const LESSONS = [
  {
    id: 'origem', emoji: '💼', title: 'De onde vem o dinheiro?',
    little: {
      text: 'O dinheiro vem do trabalho. Papai e mamãe trabalham e recebem dinheiro.',
      quiz: 'De onde vem o dinheiro?',
      options: [{ e: '🌳', t: 'Da árvore' }, { e: '💼', t: 'Do trabalho' }, { e: '☁️', t: 'Do céu' }],
      correct: 1,
    },
    big: {
      text: 'Dinheiro é o que as pessoas recebem em troca do seu trabalho ou do seu tempo. O banco só GUARDA o dinheiro: ele não aparece do nada. Por isso cada real tem uma história de esforço por trás.',
      quiz: 'Se você tira dinheiro do caixa eletrônico, de onde ele veio antes?',
      options: [{ t: 'O banco inventou' }, { t: 'Do trabalho de alguém que guardou lá' }, { t: 'Da máquina' }],
      correct: 1,
    },
    talk: 'Conte qual é o seu trabalho e uma coisa que você faz nele. Pergunte: "que trabalho você acha legal?"',
  },
  {
    id: 'preciso-quero', emoji: '🤔', title: 'Preciso ou quero?',
    little: {
      text: 'Precisar é o que a gente não pode ficar sem, como comida. Querer é o que é legal ter, como brinquedo.',
      quiz: 'Qual a gente PRECISA?',
      options: [{ e: '🎮', t: 'Videogame' }, { e: '🍎', t: 'Comida' }, { e: '🍭', t: 'Pirulito' }],
      correct: 1,
    },
    big: {
      text: 'Necessidades são coisas sem as quais a vida fica difícil: comida, casa, remédio, escola. Desejos deixam a vida mais gostosa, mas dá pra viver sem. Não tem nada de errado em querer — o segredo é cuidar das necessidades primeiro.',
      quiz: 'Um tênis para a escola e um tênis de marca famosa. Qual é a necessidade?',
      options: [{ t: 'O de marca famosa' }, { t: 'Ter um tênis que sirva para a escola' }, { t: 'Os dois são necessidade' }],
      correct: 1,
    },
    talk: 'No mercado, peça para a criança separar 1 item "preciso" e 1 item "quero" do carrinho.',
  },
  {
    id: 'potes', emoji: '🫙', title: 'Os 3 potes',
    little: {
      text: 'Seu dinheiro mora em 3 potes: um para GASTAR, um para GUARDAR e um para AJUDAR alguém.',
      quiz: 'Qual pote é para guardar para um sonho?',
      options: [{ e: '💸', t: 'Gastar' }, { e: '🎯', t: 'Poupar' }, { e: '❤️', t: 'Doar' }],
      correct: 1,
    },
    big: {
      text: 'Quando a mesada chega, ela já se divide sozinha: uma parte para GASTAR agora, uma para POUPAR para um sonho e uma para DOAR. Separar antes de gastar é o truque que muitos adultos usam para conseguir guardar.',
      quiz: 'Por que dividir o dinheiro ANTES de gastar?',
      options: [{ t: 'Pra ficar mais difícil gastar o que é do sonho' }, { t: 'Pra gastar mais rápido' }, { t: 'Não faz diferença' }],
      correct: 0,
    },
    talk: 'Mostre como você separa dinheiro para contas, para guardar e para lazer (mesmo que de forma simples).',
  },
  {
    id: 'metas', emoji: '🎯', title: 'Sonho grande, passos pequenos',
    little: {
      text: 'Para comprar algo grande, a gente guarda um pouquinho toda semana. Moeda por moeda, o pote enche!',
      quiz: 'Como encher o pote do sonho?',
      options: [{ e: '🪙', t: 'Um pouquinho toda semana' }, { e: '🙈', t: 'Esquecer dele' }, { e: '🍬', t: 'Gastar tudo hoje' }],
      correct: 0,
    },
    big: {
      text: 'Uma meta precisa de 3 coisas: O QUE você quer, QUANTO custa e QUANDO quer ter. Divida o preço pelas semanas e você descobre quanto guardar por semana. Uma meta de R$ 60 em 10 semanas = R$ 6 por semana.',
      quiz: 'Quer juntar R$ 40 em 8 semanas. Quanto por semana?',
      options: [{ t: 'R$ 4' }, { t: 'R$ 5' }, { t: 'R$ 8' }],
      correct: 1,
    },
    talk: 'Ajude a criança a cadastrar uma meta no app e a contar quantas semanas faltam.',
  },
  {
    id: 'escolhas', emoji: '⚖️', title: 'Escolher é trocar',
    little: {
      text: 'Se eu gasto minha moeda no doce, ela não está mais aqui para o brinquedo. Toda escolha é uma troca.',
      quiz: 'Gastei tudo no doce. Ainda posso comprar o brinquedo com esse dinheiro?',
      options: [{ e: '👍', t: 'Sim' }, { e: '👎', t: 'Não' }],
      correct: 1,
    },
    big: {
      text: 'Cada real só pode ser gasto uma vez. Quando você escolhe uma coisa, desiste de outra — os economistas chamam isso de "custo de oportunidade". A pergunta esperta é: "o que eu deixo de ter se comprar isso?"',
      quiz: 'Você tem R$ 20. Compra um jogo de R$ 20. Qual é o custo de oportunidade?',
      options: [{ t: 'Nenhum, o jogo é bom' }, { t: 'Tudo o que você poderia fazer com esses R$ 20' }, { t: 'Os impostos' }],
      correct: 1,
    },
    talk: 'Conte uma escolha de dinheiro que vocês fizeram em família (ex.: viagem em vez de TV nova) e por quê.',
  },
  {
    id: 'esperar', emoji: '⏳', title: 'Esperar vale a pena',
    little: {
      text: 'Quando você quer muito uma coisa, espere até amanhã. Se ainda quiser, é um desejo de verdade!',
      quiz: 'Quer muito um brinquedo. O que fazer primeiro?',
      options: [{ e: '🏃', t: 'Comprar correndo' }, { e: '😴', t: 'Pensar até amanhã' }],
      correct: 1,
    },
    big: {
      text: 'Lojas e jogos querem que você compre NA HORA, com pressa. Uma regra simples: coloque na lista de desejos e espere 1 dia. Muitas vezes a vontade passa — e o dinheiro fica para algo que você quer de verdade.',
      quiz: 'Por que as lojas fazem "só hoje!"?',
      options: [{ t: 'Porque são boazinhas' }, { t: 'Pra você não ter tempo de pensar' }, { t: 'Porque o produto vai acabar no mundo' }],
      correct: 1,
    },
    talk: 'Pergunte: "teve alguma coisa que você queria muito e depois deixou de querer?"',
  },
  {
    id: 'juros', emoji: '🌱', title: 'Dinheiro que cresce',
    little: {
      text: 'No banco do Poupi, o dinheiro guardado vira árvore e dá frutinhas todo mês. As frutinhas são os juros!',
      quiz: 'O que acontece com o dinheiro guardado no banco?',
      options: [{ e: '🌳', t: 'Cresce' }, { e: '💨', t: 'Some' }],
      correct: 0,
    },
    big: {
      text: 'Juros são um "aluguel" que o banco paga por usar seu dinheiro. E no mês seguinte, os juros rendem juros também — isso é juros compostos. Quanto mais cedo você guarda, mais tempo ele tem para crescer.',
      quiz: 'Quem ganha mais juros no fim?',
      options: [{ t: 'Quem guardou cedo e deixou lá' }, { t: 'Quem guardou e tirou toda semana' }, { t: 'Os dois ganham igual' }],
      correct: 0,
    },
    talk: 'Mostre o histórico de juros no app e pergunte: "e se você deixasse isso lá por 1 ano?"',
  },
  {
    id: 'doar', emoji: '❤️', title: 'Ajudar faz bem',
    little: {
      text: 'Doar é dar um pouco do que temos para ajudar alguém. Pode ser dinheiro, brinquedo ou tempo.',
      quiz: 'O que dá para doar?',
      options: [{ e: '🪙', t: 'Só dinheiro' }, { e: '🎁', t: 'Dinheiro, brinquedo e tempo' }],
      correct: 1,
    },
    big: {
      text: 'Pesquisas mostram que gastar com os outros deixa as pessoas mais felizes do que gastar só consigo — até crianças pequenas! O pote Doar existe para você escolher QUEM ajudar: animais, crianças, natureza…',
      quiz: 'Quem escolhe para onde vai o pote Doar?',
      options: [{ t: 'Você, conversando com a família' }, { t: 'O banco' }, { t: 'Ninguém' }],
      correct: 0,
    },
    talk: 'Escolham juntos uma causa para o pote Doar e, se der, entreguem a doação pessoalmente.',
  },
  {
    id: 'precos', emoji: '🏷️', title: 'Comparar preços',
    little: {
      text: 'A mesma coisa pode ter preços diferentes. Olhar antes de comprar ajuda a sobrar mais moedinhas.',
      quiz: 'O mesmo suco custa 🪙🪙🪙 aqui e 🪙🪙 ali. Qual é mais barato?',
      options: [{ e: '🪙🪙🪙', t: 'Aqui' }, { e: '🪙🪙', t: 'Ali' }],
      correct: 1,
    },
    big: {
      text: 'Antes de comprar, compare: o mesmo produto em outra loja, uma marca diferente, ou o tamanho maior (que às vezes sai mais barato por unidade). Pesquisar 2 minutos pode economizar muito.',
      quiz: 'Pacote com 2 por R$ 6 ou com 3 por R$ 7,50. Qual sai mais barato por unidade?',
      options: [{ t: '2 por R$ 6 (R$ 3 cada)' }, { t: '3 por R$ 7,50 (R$ 2,50 cada)' }, { t: 'Igual' }],
      correct: 1,
    },
    talk: 'No mercado, peça para a criança achar o mesmo produto com 2 preços diferentes.',
  },
  {
    id: 'propaganda', emoji: '📺', title: 'A propaganda quer te convencer',
    little: {
      text: 'Propaganda mostra o brinquedo sempre bonito e feliz. Na vida real, ele pode ser diferente!',
      quiz: 'Na propaganda o brinquedo voa sozinho. Na vida real ele voa?',
      options: [{ e: '✈️', t: 'Voa' }, { e: '🤷', t: 'Talvez não' }],
      correct: 1,
    },
    big: {
      text: 'Propagandas, influenciadores e jogos com "ofertas" são feitos por pessoas que querem vender. Eles usam música, cores, pressa e famosos. Pergunte sempre: "quem ganha se eu comprar isso?"',
      quiz: 'Um youtuber mostra um produto que ganhou de graça da marca. O que pensar?',
      options: [{ t: 'É a melhor coisa do mundo' }, { t: 'Ele pode estar fazendo propaganda' }, { t: 'Preciso comprar agora' }],
      correct: 1,
    },
    talk: 'Assistam a uma propaganda juntos e brinquem de "detetive": que truques ela usa?',
  },
  {
    id: 'erros', emoji: '🧩', title: 'Errar faz parte',
    little: {
      text: 'Todo mundo erra com dinheiro às vezes. O importante é aprender e tentar diferente na próxima.',
      quiz: 'Comprei algo e me arrependi. E agora?',
      options: [{ e: '😢', t: 'Nunca mais tento' }, { e: '💡', t: 'Aprendo para a próxima' }],
      correct: 1,
    },
    big: {
      text: 'Errar com R$ 10 aos 10 anos é muito melhor do que errar com R$ 10.000 aos 30. Quando uma compra decepcionar, pergunte: "o que eu faria diferente?" — essa resposta vale mais que o dinheiro gasto.',
      quiz: 'Comprou um brinquedo que quebrou em 2 dias. A melhor reação é:',
      options: [{ t: 'Pensar no que observar da próxima vez' }, { t: 'Comprar outro igual' }, { t: 'Esconder dos pais' }],
      correct: 0,
    },
    talk: 'Conte um erro seu com dinheiro e o que você aprendeu. Crianças aprendem muito com a honestidade dos pais.',
  },
  {
    id: 'troco', emoji: '🪙', title: 'Moedas e troco',
    little: {
      text: 'Você paga com uma nota grande e a loja devolve o que sobra. O que sobra se chama troco!',
      quiz: 'Pagou com uma nota grande e a conta era pequena. O que volta para você?',
      options: [{ e: '🪙', t: 'O troco' }, { e: '🎁', t: 'Um presente' }, { e: '🍬', t: 'Nada' }],
      correct: 0,
    },
    big: {
      text: 'Troco é a diferença entre o que você entrega e o que você deve. Se a conta é R$ 7 e você paga com R$ 10, o troco é R$ 3. Conferir o troco é um hábito de quem cuida do próprio dinheiro: todo mundo erra às vezes, até o caixa.',
      quiz: 'A conta deu R$ 12 e você pagou com R$ 20. Qual é o troco?',
      options: [{ t: 'R$ 6' }, { t: 'R$ 8' }, { t: 'R$ 10' }],
      correct: 1,
    },
    talk: 'Na próxima compra, deixe a criança pagar e conferir o troco, mesmo que você já saiba o valor.',
  },
  {
    id: 'orcamento', emoji: '📝', title: 'Planejar a semana',
    little: {
      text: 'Antes de gastar, a gente pensa: o que eu quero fazer com meu dinheiro esta semana?',
      quiz: 'Quando é melhor pensar no que vai comprar?',
      options: [{ e: '🤔', t: 'Antes de gastar' }, { e: '😮', t: 'Depois que acabou' }],
      correct: 0,
    },
    big: {
      text: 'Orçamento é um plano simples: quanto eu tenho, quanto quero gastar e quanto vou guardar. Se você sabe que vai querer um lanche na escola toda sexta, já separa esse dinheiro antes. Planejar não tira a graça: evita a surpresa de ficar sem dinheiro no meio da semana.',
      quiz: 'Qual é o primeiro passo de um orçamento?',
      options: [{ t: 'Saber quanto dinheiro eu tenho' }, { t: 'Gastar tudo logo' }, { t: 'Pedir mais mesada' }],
      correct: 0,
    },
    talk: 'Peça para a criança dizer, na segunda-feira, uma coisa em que pretende gastar e uma que pretende guardar.',
  },
  {
    id: 'inflacao', emoji: '📈', title: 'Por que as coisas ficam mais caras?',
    little: {
      text: 'Com o tempo, as coisas ficam um pouquinho mais caras. O mesmo dinheiro compra um pouco menos.',
      quiz: 'O picolé custava pouco e agora custa mais. O que mudou?',
      options: [{ e: '🏷️', t: 'O preço subiu' }, { e: '🍦', t: 'O picolé encolheu sozinho' }],
      correct: 0,
    },
    big: {
      text: 'Chamamos de inflação quando os preços sobem com o tempo. Por isso, dinheiro parado perde um pouco de força: com os mesmos R$ 10 você compra menos coisas no ano que vem. Quando o banco paga juros, uma parte serve só para compensar essa perda.',
      quiz: 'O que a inflação faz com o dinheiro guardado em casa, sem render?',
      options: [{ t: 'Ele compra um pouco menos com o tempo' }, { t: 'Ele compra mais com o tempo' }, { t: 'Nada muda' }],
      correct: 0,
    },
    talk: 'Lembrem juntos de um preço de alguns anos atrás (um sorvete, um ingresso) e comparem com o de hoje.',
  },
  {
    id: 'jogos', emoji: '🎮', title: 'Dinheiro dentro dos jogos',
    little: {
      text: 'Em alguns jogos dá para comprar coisas. Isso gasta dinheiro de verdade. Sempre pergunte antes para papai ou mamãe!',
      quiz: 'O que você faz antes de comprar algo no jogo?',
      options: [{ e: '🙋', t: 'Pergunto para um adulto' }, { e: '👆', t: 'Aperto logo' }],
      correct: 0,
    },
    big: {
      text: 'Moedas, "skins" e caixas surpresa dentro de jogos são feitas para dar vontade de gastar. As moedas parecem de brinquedo, mas custam dinheiro de verdade. Antes de comprar, aplique a regra do Poupi: espere, pense e converse com seus pais.',
      quiz: 'Por que é bom esperar um dia antes de comprar algo num jogo?',
      options: [{ t: 'Porque a vontade do momento passa e dá para decidir com calma' }, { t: 'Porque o jogo some' }, { t: 'Não faz diferença' }],
      correct: 0,
    },
    talk: 'Combinem uma regra de família para compras em jogos (sempre perguntar antes) e conversem sobre como os jogos "convidam" a gastar.',
  },
  {
    id: 'golpes', emoji: '🔐', title: 'Cuidado com golpes',
    little: {
      text: 'Senha e PIN são segredos. Quem pede sua senha por mensagem quer enganar você. Conte para um adulto!',
      quiz: 'Alguém pediu a senha de papai pelo celular. O que você faz?',
      options: [{ e: '🙅', t: 'Não dou e aviso um adulto' }, { e: '📩', t: 'Mando a senha' }],
      correct: 0,
    },
    big: {
      text: 'Golpistas usam mensagens com pressa ("ganhe agora!", "sua conta será bloqueada") para você agir sem pensar. Nunca passe senha, PIN, código recebido por SMS ou dados dos seus pais. Se algo parecer bom demais, pare, espere e conte para um adulto de confiança.',
      quiz: 'Uma mensagem diz: "Você ganhou um prêmio! Clique agora e informe o código." O que é mais seguro?',
      options: [{ t: 'Não clicar e mostrar para um adulto' }, { t: 'Clicar rápido antes que acabe' }, { t: 'Mandar o código só dessa vez' }],
      correct: 0,
    },
    talk: 'Contem um golpe que você ou alguém conhecido quase caiu. Combinem uma "palavra de segurança" da família.',
  },
  {
    id: 'plano', emoji: '🗺️', title: 'Seu plano de dinheiro',
    little: {
      text: 'Agora você sabe: ganhar, dividir nos potes, guardar, esperar e ajudar. Você cuida do seu dinheiro!',
      quiz: 'Quem cuida do seu dinheiro no Poupi?',
      options: [{ e: '🙋', t: 'Eu!' }, { e: '🤖', t: 'O celular' }],
      correct: 0,
    },
    big: {
      text: 'Um plano simples: 1) a renda chega e se divide nos potes; 2) você tem uma meta com prazo; 3) antes de gastar, pensa um dia; 4) o que sobra no Poupar vai pro banco render. Repita toda semana e você terá algo que muito adulto não tem: hábito.',
      quiz: 'Qual destes NÃO faz parte do plano?',
      options: [{ t: 'Dividir nos potes' }, { t: 'Comprar tudo que aparecer' }, { t: 'Ter uma meta com prazo' }],
      correct: 1,
    },
    talk: 'Celebrem a trilha completa! Peçam para a criança explicar os potes para alguém da família.',
  },
];
