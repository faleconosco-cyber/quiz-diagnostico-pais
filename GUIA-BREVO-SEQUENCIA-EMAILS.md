# Guia — Sequência de 6 e-mails no Brevo (leads do quiz de pais)

Roteiro passo a passo pra ligar o quiz diagnóstico de pais a uma sequência automática de 6 e-mails no Brevo, terminando no convite pra triagem. Siga na ordem — cada passo tem só o que você precisa clicar.

**Como funciona depois de pronto:** pai/mãe responde o quiz → cai na planilha "Leads" (como já acontece hoje) → cai também numa lista no Brevo → Brevo dispara o e-mail 1 na hora e os outros 5 nos dias seguintes, sem você precisar fazer nada manualmente.

---

## Passo 1 — Criar a conta no Brevo

1. Acesse [brevo.com](https://www.brevo.com) e clique em "Cadastre-se grátis"
2. Use o e-mail `faleconosco@institutorumo.com`
3. Confirme o cadastro pelo e-mail que o Brevo mandar

Não precisa cartão de crédito — o plano grátis já cobre seu volume (até 300 e-mails/dia).

## Passo 2 — Criar a lista de contatos

1. No menu lateral, vá em **Contatos → Listas**
2. Clique em **Criar uma lista**
3. Nome: `Leads Quiz Pais`
4. Depois de criada, clique nela e anote o **número do ID** que aparece no topo ou na URL (ex: se a URL for `.../lists/7`, o ID é `7`)

Me avise esse número quando tiver.

## Passo 3 — Pegar a chave de API

1. Clique no seu nome (canto superior direito) → **Chaves de API (SMTP & API)**
2. Aba **API Keys** → **Gerar uma nova chave de API**
3. Nome: `Quiz Pais`
4. Copie a chave gerada (só aparece uma vez — se perder, gera outra)

Me mande essa chave (pode ser por aqui mesmo) que eu atualizo o código com ela.

## Passo 4 — Eu atualizo o código

Assim que você me passar o ID da lista (Passo 2) e a chave de API (Passo 3), eu preencho essas duas informações no arquivo `apps-script-lead-capture.js` (já deixei os espaços prontos: `BREVO_API_KEY` e `BREVO_LIST_ID`).

Depois você só precisa:
1. Abrir a planilha "Leads" → **Extensões → Apps Script**
2. Apagar o código antigo e colar o novo que eu te mandar
3. **Salvar** (ícone de disquete)
4. **Publicar a versão nova — salvar NÃO publica.** O link que o quiz usa fica travado na versão que valia quando você implantou. Vá em **Implantar → Gerenciar implantações → ✏️ (editar) → Versão: Nova versão → Implantar**. A URL não muda, então o quiz continua funcionando sem alteração.

> ⚠️ Esse passo 4 é o que mais engana: se você pular, o teste manual no editor funciona (roda o código novo) mas o quiz de verdade não (roda o antigo). Sempre que mexer no Apps Script, republique.

## Passo 5 — Autenticar o domínio institutorumo.com ✅ FEITO EM 27/07/2026

> Concluído. São 7 registros no DNS (código Brevo, `em`, os dois DKIM, `img.em`, `r.em` e o `_dmarc`), todos no ar e conferidos, e o domínio aparece autenticado no Brevo. O que está escrito abaixo fica só como referência caso precise refazer.


Isso evita que seus e-mails caiam em spam (o Brevo passa a mandar "de verdade" como institutorumo.com, e não como um domínio genérico do Brevo).

1. No Brevo: **Configurações → Senders, Domains & Dedicated IPs → Domains**
2. Clique em **Adicionar um domínio**, digite `institutorumo.com`
3. O Brevo vai mostrar 3-4 registros (tipo TXT e CNAME) pra você adicionar no painel de DNS de onde o domínio está registrado

Quando chegar nesse passo, me manda print da tela com os registros que o Brevo pedir — eu leio os valores e te dou o passo a passo exato de onde colar (normalmente é em **DNS** dentro do painel do provedor do domínio). Isso não afeta o site nem o quiz, é só adicionar registros novos.

## Passo 6 — Criar os 3 atributos do resultado

O quiz agora manda o resultado do diagnóstico junto com o lead — é ele que o e-mail 1 devolve pra pessoa. Sem esses três atributos criados, o contato até entra na lista, mas chega **sem o resultado**, e o e-mail 1 sai com os espaços em branco.

> Testado em 27/07/2026: o Brevo **ignora em silêncio** atributo que ele não conhece. Ele não recusa o contato, só descarta aquele campo. Então o erro não aparece em lugar nenhum, o e-mail é que sai capenga.
>
> O que o Brevo **recusa mesmo** é contato repetido: dois contatos não podem ter o mesmo número de WhatsApp. Se aparecer "Contact already exist" na aba "Log Brevo", é isso.

1. No menu lateral: **Contatos → Configurações → Atributos de contato**
2. Clique em **Adicionar um atributo** e crie os três, todos do tipo **Texto**:

| Nome do atributo | Tipo | O que guarda |
|---|---|---|
| `PERFIL` | Texto | Qual dos 5 resultados a pessoa tirou (R1 a R5) |
| `RESULTADO_TITULO` | Texto | A frase do resultado (ex: "Você pode estar pressionando sem perceber.") |
| `RESULTADO_TEXTO` | Texto | O parágrafo que explica o resultado |

Escreva o nome exatamente assim: tudo em maiúsculo, com underline, sem acento.

> Os atributos `NOME`, `WHATSAPP` e `PONTUACAO` já existem desde o primeiro teste — não precisa mexer neles.

## Passo 7 — Montar a automação com os 6 e-mails

1. Menu lateral → **Automação → Meus workflows → Criar um workflow**
2. Escolha **Começar do zero**
3. Gatilho: **Contato é adicionado a uma lista** → selecione `Leads Quiz Pais`
4. Monte a sequência assim (arrastando os blocos "Enviar um e-mail" e "Aguardar antes de continuar"):

| Bloco | Configuração |
|---|---|
| Enviar e-mail 1 | Imediato |
| Aguardar | 2 dias |
| Enviar e-mail 2 | — |
| Aguardar | 2 dias |
| Enviar e-mail 3 | — |
| Aguardar | 2 dias |
| Enviar e-mail 4 | — |
| Aguardar | 2 dias |
| Enviar e-mail 5 | — |
| Aguardar | 2 dias |
| Enviar e-mail 6 (convite pra triagem) | — |

Pra cada bloco "Enviar e-mail", clique em **Criar um novo e-mail** e cole o texto que você já tem pronto. Se quiser, me manda os 6 textos aqui na conversa que eu formato e devolvo prontos pra colar (assunto + corpo).

5. No fim, clique em **Ativar** o workflow

### Remetente e respostas

Em cada e-mail da automação, configure assim:

| Campo | Valor |
|---|---|
| Nome do remetente | `Cláudia Botelho \| Instituto Rumo` |
| E-mail do remetente | `faleconosco@institutorumo.com` |
| Responder para | `faleconosco@institutorumo.com` |

O Brevo só dispara, ele não tem caixa de entrada. Quando alguém responder, a mensagem cai no Gmail do `faleconosco@` como e-mail comum, e você responde normalmente. Por isso nunca use `noreply@`: o e-mail 1 pede resposta de propósito, e resposta de gente de verdade é o que mais ajuda a não cair em spam.

Vale criar um marcador no Gmail (ex: "Quiz pais") pra juntar todas essas respostas num lugar só.

### Como o e-mail 1 devolve o resultado

Dentro do editor do e-mail 1, onde você quiser que apareça o resultado da pessoa, escreva estas etiquetas — o Brevo troca cada uma pelo conteúdo daquele contato na hora do envio:

- `{{contact.NOME}}` → o nome que ela digitou
- `{{contact.RESULTADO_TITULO}}` → a frase do resultado dela
- `{{contact.RESULTADO_TEXTO}}` → o parágrafo que explica

Assim é **um e-mail só** que chega diferente pra cada pessoa, em vez de cinco versões pra escrever e manter. Os outros cinco e-mails são iguais pra todo mundo.

> Antes de ativar, use o **Enviar um teste** do editor com o seu e-mail: se as etiquetas chegarem escritas em vez de preenchidas, é nome de atributo digitado errado (confira o Passo 6).

## Passo 8 — Testar de ponta a ponta

1. Preencha o quiz de verdade (ou peça pra alguém de confiança preencher) com um e-mail seu de teste
2. Confira: a linha caiu na planilha, aba **"Leads"**? ✅
3. Confira a aba **"Log Brevo"** (criada automaticamente): status **201** = o Brevo aceitou o contato ✅
4. Confira no Brevo: **CRM → Contatos → Listas → leads quiz de pais** — o contato apareceu? ✅
5. Clique no contato: os campos **PERFIL**, **RESULTADO_TITULO** e **RESULTADO_TEXTO** vieram preenchidos? ✅
6. Confira sua caixa de entrada: o e-mail 1 chegou com o resultado escrito nele? ✅

**Status testado e funcionando em 27/07/2026** — os passos 2, 3 e 4 passaram (o 5 depende da automação estar montada).

### Se algo falhar

A aba **"Log Brevo"** é o lugar de olhar primeiro: ela guarda a resposta exata do Brevo em cada envio.
- Status **201** = contato criado com sucesso
- Status **400** = o Brevo recusou (a coluna "Resposta do Brevo" diz o motivo)
- Status **401** = chave de API errada ou expirada
- Aba vazia / nenhuma linha nova = o código novo não está no ar → refaça o Passo 4 (republicar)

Também dá pra rodar a função `testarBrevo` direto no editor do Apps Script (menu suspenso no topo → `testarBrevo` → ▶ Executar) pra testar sem precisar preencher o quiz.

---

## Depois disso: a newsletter

Quando quiser mandar newsletter pra sua lista (ou pra uma lista maior, todos os contatos), é só ir em **Campanhas → Criar uma campanha de e-mail** no Brevo — mesma conta, sem precisar configurar nada novo. Se quiser, a gente pode juntar todos os leads (quiz + outros formulários do Rumo) numa lista mestre mais pra frente.
