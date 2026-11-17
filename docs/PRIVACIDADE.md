# Privacidade e proteção de menores

> Este documento descreve o funcionamento **atual** do app. Não é parecer jurídico. Antes de qualquer cadastro, sincronização, notificação ou cobrança, validar com advogado. Referências: LGPD (art. 14, dados de crianças), ECA Digital (Lei 15.211/2025, em vigor desde 17/03/2026; regulamentação técnica da ANPD em andamento).

## Situação atual
- **Dados:** nomes ou apelidos, idades, valores, histórico, metas e escolhas. Ficam no `localStorage` do navegador do aparelho. O app não tem servidor, cadastro, analytics, anúncios nem SDKs de terceiros.
- **Rede:** fontes e imagens são do próprio app (funciona offline). Nenhuma chamada a domínios de terceiros. A leitura em voz alta usa a voz do aparelho (Web Speech API) e, dependendo do sistema, o serviço de voz dele.
- **Consentimento:** no primeiro uso, o responsável confirma que é pai, mãe ou responsável legal e vê o resumo do tratamento de dados.
- **Controle:** "Apagar tudo" nos Ajustes; backup opcional com criptografia (AES-GCM, chave derivada da senha por PBKDF2, 250 mil iterações).
- **Criança:** sem notificações, sem links externos, sem compras, sem sorteios (a loja de estrelas tem preço fixo e visível). Aviso gentil de pausa após ~10 minutos, sem bloqueio.

## Limites honestos
- O PIN de 4 dígitos impede a criança de entrar no painel dos pais. Não protege contra quem tem acesso ao armazenamento do aparelho. O bloqueio progressivo (5 erros, depois 30 s, 1 min, 5 min...) só dificulta tentativas pela tela.
- Limpar os dados do navegador apaga o Poupi. Por isso o backup existe.
- O hash do PIN (cyrb53 com sal fixo) não é criptografia forte.

## Antes de ter contas ou sincronização (Fase 2)
1. Consentimento específico e destacado de um dos pais (LGPD art. 14, §1º), registrado.
2. Coleta mínima; perfis de criança sem e-mail nem login próprio.
3. Sem anúncios, perfilamento nem venda de dados. Sem notificações persuasivas para crianças.
4. Exclusão de conta e de dados em um toque; política de privacidade em linguagem simples (versão para pais e para crianças).
5. Configurações mais protetivas por padrão e supervisão parental, conforme o ECA Digital.
6. Criptografia ponta a ponta opcional na sincronização; auditoria de rede sem chamadas a terceiros.
7. Revisão jurídica das bases legais e da regulamentação técnica da ANPD.
