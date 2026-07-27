// Cole este código no Apps Script da planilha (conta faleconosco@institutorumo.com)
// Extensões → Apps Script → colar → Salvar → Implantar → Nova implantação → App da Web → Acesso: Qualquer pessoa

// Preencher depois de criar a conta Brevo (ver GUIA-BREVO-SEQUENCIA-EMAILS.md)
const BREVO_API_KEY = 'COLE_A_CHAVE_DE_API_AQUI'
const BREVO_LIST_ID = 0 // COLE_O_ID_DA_LISTA_AQUI

function doGet(e) { return processarDados(e) }
function doPost(e) { return processarDados(e) }

function processarDados(e) {
  const raw = (e.parameter && e.parameter.payload) || (e.postData && e.postData.contents)
  const d = JSON.parse(raw)

  const planilha = SpreadsheetApp.getActiveSpreadsheet()
  const aba = planilha.getSheetByName('Leads') || planilha.insertSheet('Leads')

  if (aba.getLastRow() === 0) {
    aba.appendRow(['Data/Hora', 'Nome', 'E-mail', 'WhatsApp', 'Pontuação', 'Perfil'])
  } else if (!aba.getRange(1, 6).getValue()) {
    // A planilha nasceu com 5 colunas; a do perfil entrou depois.
    aba.getRange(1, 6).setValue('Perfil')
  }

  aba.appendRow([
    new Date(),
    d.nome || '',
    d.email || '',
    // Apóstrofo na frente: o WhatsApp começa com "+" e o Sheets tentaria
    // interpretar como fórmula, gravando #ERROR! no lugar do número.
    d.whatsapp ? "'" + d.whatsapp : '',
    d.pontuacao ?? '',
    d.perfil || '',
  ])

  enviarParaBrevo(d)

  return ContentService.createTextOutput('ok')
}

// Manda o lead pro Brevo pra disparar a automação de e-mails.
// O resultado é registrado na aba "Log Brevo" — sem isso, uma falha
// (chave errada, atributo inexistente, sem autorização) passa despercebida.
function enviarParaBrevo(d) {
  if (!BREVO_API_KEY || BREVO_API_KEY === 'COLE_A_CHAVE_DE_API_AQUI') return

  let status = ''
  let resposta = ''

  try {
    const r = UrlFetchApp.fetch('https://api.brevo.com/v3/contacts', {
      method: 'post',
      contentType: 'application/json',
      headers: { 'api-key': BREVO_API_KEY },
      payload: JSON.stringify({
        email: d.email || '',
        attributes: {
          NOME: d.nome || '',
          WHATSAPP: d.whatsapp || '',
          PONTUACAO: d.pontuacao ?? '',
          // O e-mail 1 da automação usa estes dois como merge tag para
          // devolver o resultado do quiz. PERFIL (R1–R5) serve pra segmentar.
          PERFIL: d.perfil || '',
          RESULTADO_TITULO: d.resultadoTitulo || '',
          RESULTADO_TEXTO: d.resultadoTexto || '',
        },
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
      muteHttpExceptions: true,
    })
    status = r.getResponseCode()
    resposta = r.getContentText()
  } catch (err) {
    status = 'EXCECAO'
    resposta = err.toString()
  }

  registrarLog(d.email || '', status, resposta)
}

// Grava o resultado de cada chamada ao Brevo numa aba separada.
function registrarLog(email, status, resposta) {
  try {
    const planilha = SpreadsheetApp.getActiveSpreadsheet()
    const log = planilha.getSheetByName('Log Brevo') || planilha.insertSheet('Log Brevo')
    if (log.getLastRow() === 0) {
      log.appendRow(['Data/Hora', 'E-mail', 'Status', 'Resposta do Brevo'])
    }
    log.appendRow([new Date(), email, status, String(resposta).slice(0, 500)])
  } catch (err) {
    // Log é diagnóstico: se falhar, não deve travar nada.
  }
}

// ─── Função de teste ─────────────────────────────────────────────────────────
// Rode esta função manualmente no editor (menu suspenso no topo → testarBrevo →
// Executar) para ver a resposta real do Brevo e conceder a autorização de acesso
// à internet, que o código novo exige.
function testarBrevo() {
  enviarParaBrevo({
    nome: 'Teste Manual',
    email: 'teste-manual@institutorumo.com',
    whatsapp: '+55 21999999999',
    pontuacao: 10,
    perfil: 'R5',
    resultadoTitulo: 'Talvez seja um bom momento de buscar apoio profissional.',
    resultadoTexto: 'Texto de teste do resultado.',
  })
}
