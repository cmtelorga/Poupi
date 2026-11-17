# 🐷 Poupi

Educação financeira para crianças de 6 a 10 anos, **com os pais junto**.

App web instalável (PWA), funciona **sem internet** e **sem servidor**: tudo fica no aparelho da família. Sem anúncios, sem rastreamento, sem cadastro.

**Abrir o app:** https://cmtelorga.github.io/Poupi/

---

## Como testar em 2 minutos

1. Abra o link acima no celular (Chrome no Android ou Safari no iPhone).
2. Toque em **"Ver demonstração"**: abre uma família fictícia (Bia, 10 anos, e Tom, 6 anos). O **PIN dos pais da demo é `1234`**.
3. Experimente:
   - **Bia** (modo autônomo): toque no pote *Gastar* e veja quanto tempo de mesada aquilo custa; use a lista de desejos; veja o simulador de juros no *Banco*.
   - **Tom** (modo lúdico): botões grandes, valores com moedas em vez de teclado, 🔊 para ouvir as lições, fazendinha que cresce com o dinheiro guardado.
   - **Área dos pais**: aprove o pedido do picolé e o trabalho extra da Bia, faça o *Papo da semana* e abra a **Jornada dos Pais**.
4. Quando quiser usar de verdade: *Ajustes → Apagar tudo* e crie a sua família.

### Instalar como app (ícone na tela inicial)

- **Android (Chrome):** menu ⋮ → *Instalar app* (ou *Adicionar à tela inicial*).
- **iPhone (Safari):** botão Compartilhar → *Adicionar à Tela de Início*.

> ⚠️ Os dados ficam **só naquele aparelho e naquele navegador**. Use sempre o mesmo celular/tablet da família e faça **backup** de vez em quando em *Ajustes → Baixar backup*.

---

## O modelo pedagógico em 5 regras

| Regra | Por quê |
|---|---|
| **Mesada fixa, no mesmo dia, sem condição** | Sem dinheiro previsível não há decisões para praticar; adultos confiáveis ensinam a esperar (Kidd et al., 2013). |
| **Ajudar em casa não é pago** — vale um "obrigado" | Recompensas externas reduzem a ajuda espontânea (Warneken & Tomasello, 2008). |
| **Trabalhos extras, opcionais, são pagos** | Ensinam que trabalho gera renda, sem transformar a casa em negociação. |
| **Toda renda se divide em 3 potes** (Gastar/Poupar/Doar) | Poupar vira o padrão, sem depender de força de vontade (contabilidade mental, Thaler). |
| **Os pais aprendem junto** (Jornada dos Pais + Papo da semana) | A família é o principal agente de socialização financeira (Gudmunson & Danes, 2011). |

Detalhes e referências: [`docs/PESQUISA.md`](docs/PESQUISA.md).

## Documentação

- [`docs/PESQUISA.md`](docs/PESQUISA.md) — base científica, com a força de cada evidência
- [`docs/FUNCIONALIDADES.md`](docs/FUNCIONALIDADES.md) — cada recurso e sua justificativa pedagógica
- [`docs/DECISOES-TECNICAS.md`](docs/DECISOES-TECNICAS.md) — PWA × Android nativo e arquitetura
- [`docs/BENCHMARK.md`](docs/BENCHMARK.md) — comparação com Greenlight, GoHenry, RoosterMoney, FamZoo, Gimi, Duolingo e Habitica
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — caminho até virar produto
- [`docs/AVALIACAO-PROTOTIPO.md`](docs/AVALIACAO-PROTOTIPO.md) — o que estava errado na versão anterior e como foi corrigido

## Para desenvolver

Requer Node.js 20+.

```bash
npm install
```

```bash
npm run dev
```

```bash
npm test
```

```bash
npm run build
```

Cada push na branch `main` roda os testes e publica no GitHub Pages automaticamente (`.github/workflows/deploy.yml`).

### Estrutura

```
src/
  domain/          regras puras, sem tela (testadas em engine.test.js)
    engine.js        mesada, juros, potes, pedidos, missões, níveis
    money.js         dinheiro sempre em centavos
    dates.js         datas no fuso local
    lessons.js       12 microlições das crianças (versões 6–7 e 8–10 anos)
    parentLessons.js 12 lições da Jornada dos Pais
    achievements.js  conquistas
    shop.js          loja do avatar e cores
    demo.js          família fictícia de demonstração
  screens/
    Onboarding.jsx   primeiro uso
    kid/             app da criança (modo lúdico e autônomo)
    parent/          painel dos pais
  ui/              componentes visuais
  storage.js       localStorage + backup (único arquivo a trocar por um backend)
public/            manifest, service worker e ícones
```
