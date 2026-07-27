// Cole este código no Apps Script da planilha (conta faleconosco@institutorumo.com)
// Extensões → Apps Script → colar → Salvar → Implantar → Nova implantação → App da Web → Acesso: Qualquer pessoa

function doGet(e) { return processarDados(e) }
function doPost(e) { return processarDados(e) }

function processarDados(e) {
  const raw = (e.parameter && e.parameter.payload) || (e.postData && e.postData.contents)
  const d = JSON.parse(raw)

  const planilha = SpreadsheetApp.getActiveSpreadsheet()
  const aba = planilha.getSheetByName('Leads') || planilha.insertSheet('Leads')

  if (aba.getLastRow() === 0) {
    aba.appendRow(['Data/Hora', 'Nome', 'E-mail', 'WhatsApp', 'Pontuação'])
  }

  aba.appendRow([
    new Date(),
    d.nome || '',
    d.email || '',
    d.whatsapp || '',
    d.pontuacao ?? '',
  ])

  return ContentService.createTextOutput('ok')
}
