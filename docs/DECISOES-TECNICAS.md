# Decisões técnicas

## PWA (web instalável) × Android nativo → **PWA**

| Critério | PWA | Android nativo |
|---|---|---|
| Teste imediato | Abre por um link, em qualquer celular | Precisa gerar e instalar APK |
| iPhone e Android | Um código só | Só Android (iOS seria outro app) |
| Custo | Zero (GitHub Pages) | Conta Google Play (taxa única) + revisão da loja |
| Atualização | Automática a cada publicação | Passa pela loja |
| Venda futura | Assinatura via web, sem a taxa das lojas; pode virar app de loja depois com Capacitor | Loja retém comissão sobre assinaturas |
| Limitações | Notificações no iOS só com o app instalado; armazenamento local pode ser limpo pelo sistema | Acesso total ao aparelho |

Para validar com a família, a PWA é mais rápida, mais barata e cobre os dois sistemas. Se a fase 2 exigir presença nas lojas, o mesmo código pode ser empacotado com Capacitor.

## Arquitetura

- **React 18 + Vite + Tailwind**, com versões fixas no `package-lock.json`. O protótipo carregava React, Babel e Tailwind de CDNs **sem versão fixa** e compilava JSX no navegador: era lento em celulares simples, quebrava sem internet e permitia que uma atualização (ou um ataque) em um CDN mudasse o app.
- **Regras isoladas da tela** (`src/domain/`): funções puras, testadas com Vitest. As telas só chamam essas funções.
- **Dinheiro em centavos** (inteiros): nada de `R$ 31,500000001`.
- **Datas no fuso local**: o protótipo usava UTC, e o "dia" virava às 21h no Brasil.
- **Livro-caixa único**: o saldo é sempre `gastar + poupar + doar + banco`, então não há um campo separado que possa dessincronizar.
- **Persistência** em `localStorage`, isolada em `src/storage.js`, com backup em arquivo JSON e campo `version` para migrações futuras.
- **Fonte Nunito empacotada** (@fontsource): funciona offline e não chama o Google Fonts.
- **Service worker** simples, escrito à mão (`public/sw.js`), sem dependências extras.

## Privacidade e segurança (fase 1)

- Nenhum dado sai do aparelho. Não há servidor, analytics, anúncios ou cookies de terceiros.
- Recomendação no app: usar só primeiro nome ou apelido.
- O PIN dos pais é guardado como hash, mas isso **não é proteção contra um adulto** com acesso ao aparelho, já que o `localStorage` é legível. O objetivo é impedir que a criança aprove os próprios pedidos.
- O "Apagar tudo" fica dentro da área dos pais (no protótipo estava na tela inicial).
- O código no repositório público **não contém dados da família**: tudo é cadastrado no aparelho.

## Limitação conhecida

Os dados vivem em **um** navegador de **um** aparelho. Para pais e filhos em celulares diferentes, é preciso um backend (ver `ROADMAP.md`).
