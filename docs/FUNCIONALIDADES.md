# Funcionalidades e justificativas

| Recurso | Onde | Por quê (ver `PESQUISA.md`) |
|---|---|---|
| **Perfis separados** com PIN dos pais | Tela inicial | Num aparelho compartilhado, a criança não pode aprovar os próprios pedidos. O PIN é uma barreira para crianças, não segurança contra adultos. |
| **Interface por idade** (lúdica até 7 anos; autônoma a partir de 8) | Toda a área da criança | Piaget: concreto antes do abstrato. Moedas tocáveis, áudio, menos texto para os pequenos; números, prazos e simulações para os maiores. |
| **Mesada semanal automática** | Pais → Ajustes | Previsibilidade gera confiança e paciência (Kidd et al., 2013). |
| **3 potes com divisão automática** | Início da criança | Poupar como padrão (Thaler). Percentuais ajustáveis por criança. |
| **Tarefas da família sem pagamento** + "💛 Obrigado" | Início / Pais → Tarefas | Recompensa externa reduz a ajuda espontânea (Warneken & Tomasello, 2008). |
| **Trabalhos extras pagos** com aprovação | Início / Pais → Resumo | Trabalho gera renda, por escolha da criança. |
| **Pedidos de gasto e doação** | Tocar nos potes | O dinheiro de verdade fica com os pais (modelo "banco da família"); o momento do pedido é o momento de ensinar (just-in-time). |
| **Custo em semanas de mesada** | Pedido de gasto | Traduz preço em tempo/esforço, que é mais concreto. |
| **Lista de desejos com espera proporcional ao preço** (1, 3 ou 7 dias, configurável) | Sonhos | Treino de gratificação adiada; desistir depois de pensar também é celebrado. |
| **Banco da família com juros mensais** | Banco / Fazenda | Juros compostos visíveis (Stango & Zinman, 2009). Bônus da família de 1% por padrão, configurável, com comparação com o banco de verdade. |
| **Fazendinha** derivada do saldo do banco | Banco / Fazenda | Representação concreta: 🌳 = dinheiro guardado, 🍎 = juros. Cresce com tempo e poupança, não com toques. |
| **Simulador "e se eu deixar guardado?"** | Banco (8+) | Mostra o efeito do tempo sobre os juros. |
| **Cartão virtual** | Banco (8+) | Simula o mundo real sem número de cartão realista. |
| **Meta pessoal com previsão em semanas** | Sonhos | Metas específicas e com prazo; o progresso é visível. |
| **17 microlições semanais com quiz e pergunta de revisão** | Aprender | Duas versões por idade; uma por semana; errar não revela a resposta. |
| **Papo da semana** | Pais → Resumo | Conversa guiada sobre a lição que a criança fez (Gudmunson & Danes). |
| **Jornada dos Pais** (12 lições, desafios, níveis) | Pais → Jornada | Os pais aprendem a ciência por trás do app e a como conversar sobre dinheiro. |
| **Meta cooperativa da família** + "Time da família" | Início / Pais → Família | Pertencimento (SDT). Substitui o ranking entre irmãos, que puniria a criança mais nova. |
| **Missões semanais** (3) | Início | Retomar tarefas abertas sem cobrança diária. |
| **Estrelas, níveis, loja do avatar** | Eu | Uma única moeda de jogo; nível nunca cai; preços fixos; sem sorteio. |
| **Conquistas** | Eu | Celebram ações (elogio de processo). |
| **Sequência em semanas** | Cabeçalho | Hábito sem ansiedade diária. |
| **Extrato completo** | Pais → Extrato | Acompanhar tudo sem planilha. |
| **Backup/restauração** | Pais → Ajustes | Os dados vivem no aparelho; o backup evita perda. |
| **Funciona offline e instala como app** | — | Service worker + manifest (PWA). |

## O que foi deliberadamente deixado de fora

- **Ranking entre irmãos**: substituído pelo placar conjunto da família.
- **Missões e sequências diárias**: substituídas por missões e sequências semanais.
- **Pagamento por tarefa doméstica**: substituído por reconhecimento + trabalhos extras.
- **Recompensa por "regar" a fazendinha**: o protótipo dava XP por toque repetido (mecânica de clique compulsivo).
- **Dados realistas de cartão e sobrenome**: desnecessários e sensíveis.
| **Reflexões** ("valeu a pena?" 7 dias depois; "como se sentiu?" ao doar) | Início | Aprender com as próprias decisões, sem nota e sem estrelas. |
| **Resumo semanal para os pais** (compartilhável) | Pais → Início | Instrumenta a conversa e a modelagem em família. |
| **Privacidade**, bloqueio do PIN e backup criptografado | Todas | Dados de crianças: consentimento do responsável, transparência e controle. |
