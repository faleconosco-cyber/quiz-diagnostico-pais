import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, MessageCircle, RotateCcw, CheckCircle, AlertCircle, Lightbulb, Mail, Shuffle, HeartHandshake } from 'lucide-react'

// ─── Captura de lead (Google Sheets via Apps Script) ─────────────────────────
// Substituir pela URL gerada em Implantar → Nova implantação → App da Web
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw_Ng20FbuhYkTaI78vZrZyQgh3laVTif4CNmv9Pfe6yP2LRnwksEleM-5o4vqPcUhHMw/exec'

function sendLead(data) {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === 'COLE_A_URL_AQUI') return
  fetch(`${APPS_SCRIPT_URL}?payload=${encodeURIComponent(JSON.stringify(data))}`, {
    method: 'GET',
    mode: 'no-cors',
  }).catch(() => {})
}

// ─── Paleta (base: creme + bordô + verde · laranja só em detalhes/atenção) ───
const C = {
  blush: '#FDDED5',
  verde: '#3B503F',
  bordo: '#6B2F3C',
  coral: '#FD745D',
  preto: '#282828',
}

// ─── Perguntas (opção a=4pts … d=1pt) ────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    text: 'Quando o assunto é profissão, seu filho:',
    options: [
      'Demonstra clareza sobre o que procura',
      'Muda frequentemente de ideia',
      'Escolhe baseado apenas em matérias da escola',
      'Diz que ainda não sabe por onde começar',
    ],
  },
  {
    id: 2,
    text: 'Seu filho conhece realmente as profissões que considera seguir?',
    options: [
      'Sim, pesquisou profundamente',
      'Conhece apenas superficialmente',
      'Escolhe mais pelo nome ou status da profissão',
      'Ainda sabe muito pouco sobre as possibilidades',
    ],
  },
  {
    id: 3,
    text: 'Ao pensar no futuro profissional, seu filho:',
    options: [
      'Possui critérios claros para decidir',
      'Pensa apenas no vestibular',
      'Parece perdido diante das possibilidades',
      'Evita aprofundar o assunto',
    ],
  },
  {
    id: 4,
    text: 'Seu filho já conversou com profissionais das áreas que considera?',
    options: [
      'Sim, mais de uma vez',
      'Conversou superficialmente',
      'Apenas viu conteúdos na internet',
      'Nunca teve contato real com profissionais',
    ],
  },
  {
    id: 5,
    text: 'A escolha profissional do seu filho parece baseada principalmente em:',
    options: [
      'Interesses e critérios pessoais',
      'Pressão externa ou expectativas familiares',
      'Influência de amigos ou redes sociais',
      'Tentativa de escolher "qualquer coisa logo"',
    ],
  },
  {
    id: 6,
    text: 'Seu filho consegue explicar por que determinada profissão faria sentido para ele?',
    options: [
      'Sim, com bastante clareza',
      'Parcialmente',
      'Muito superficialmente',
      'Não consegue explicar',
    ],
  },
  {
    id: 7,
    text: 'Seu filho conhece diferentes caminhos possíveis dentro das áreas que gosta?',
    options: [
      'Sim',
      'Conhece poucas possibilidades',
      'Pensa em profissões muito limitadas',
      'Praticamente não explorou opções',
    ],
  },
  {
    id: 8,
    text: 'Quando vocês conversam sobre futuro profissional, seu filho:',
    options: [
      'Participa ativamente',
      'Demonstra insegurança',
      'Responde de forma vaga',
      'Evita ou encerra rapidamente a conversa',
    ],
  },
  {
    id: 9,
    text: 'Ao pensar em profissão, o que mais pesa na cabeça do seu filho?',
    options: [
      'O estilo de vida que ele quer ter no dia a dia',
      'Só o nome do curso ou da faculdade',
      'Só o salário ou a estabilidade',
      'Ele ainda não parou para pensar nisso',
    ],
  },
  {
    id: 10,
    text: 'Hoje, você sente que seu filho está:',
    options: [
      'Construindo uma decisão consciente',
      'Precisando de mais direcionamento',
      'Muito confuso diante das possibilidades',
      'Tentando decidir sem informações suficientes',
    ],
  },
]

// ─── WhatsApp ─────────────────────────────────────────────────────────────────
const WA_PHONE = '5521990625330'
const WA_TEXT  = 'Olá! Fiz o quiz diagnóstico para pais sobre primeira escolha profissional e gostaria de conversar sobre orientação profissional para meu filho.'

function openWhatsApp() {
  window.open(
    `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(WA_TEXT)}`,
    '_blank',
    'noopener,noreferrer',
  )
}

// ─── Resultado ────────────────────────────────────────────────────────────────
// Pontuação: opção 0 = 4pts, opção 1 = 3pts, opção 2 = 2pts, opção 3 = 1pt
// Total: 10–40 pts, dividido em 5 faixas de 6 pts
// R1 (35–40) · R2 (29–34) · R3 (23–28) · R4 (17–22) · R5 (10–16)

function getResult(score) {
  if (score >= 35) return {
    id:     'R1',
    badge:  'Presença que ajuda, mas pode ganhar mais estrutura',
    title:  'Você tende a apoiar com presença, mas talvez falte método.',
    text:   'Você está por perto, disponível e atento. Isso já conta muito. Mas presença sozinha não constrói critérios. A orientação profissional dá ao seu filho um método claro para transformar esse apoio em decisões mais seguras.',
    cta:    'Quero entender melhor como funciona',
    color:  C.verde,
    bg:     '#EDF4EE',
    Icon:   CheckCircle,
  }
  if (score >= 29) return {
    id:     'R2',
    badge:  'Um ponto de atenção na forma de apoiar',
    title:  'Você pode estar pressionando sem perceber.',
    text:   'Cobrança, prazo e comparação costumam vir de um lugar de cuidado, mas pesam mais do que ajudam. Entender essa diferença já é o primeiro passo para apoiar sem empurrar.',
    cta:    'Quero entender essa diferença',
    color:  C.coral,
    bg:     '#FFEEE9',
    Icon:   AlertCircle,
  }
  if (score >= 23) return {
    id:     'R3',
    badge:  'Falta de critérios claros',
    title:  'Seu filho parece precisar de mais critérios antes de escolher.',
    text:   'Sem critérios próprios, qualquer escolha fica frágil e some no primeiro sinal de dúvida. A orientação profissional ajuda a construir esses critérios a partir de quem seu filho é, não do que ele acha que deveria escolher.',
    cta:    'Quero ajudar meu filho a construir critérios',
    color:  C.bordo,
    bg:     '#F5E8EA',
    Icon:   Lightbulb,
  }
  if (score >= 17) return {
    id:     'R4',
    badge:  'Excesso de opções, não falta de interesse',
    title:  'A dúvida do seu filho pode estar mais ligada a excesso de opções do que falta de interesse.',
    text:   'Hoje existem tantos caminhos possíveis que decidir virou mais difícil, não mais fácil. Isso não é falta de vontade. É sobrecarga de possibilidades sem um filtro para organizá-las.',
    cta:    'Quero ajudar meu filho a organizar as opções',
    color:  C.coral,
    bg:     '#FFEEE9',
    Icon:   Shuffle,
  }
  return {
    id:     'R5',
    badge:  'Um momento importante de decidir',
    title:  'Talvez seja um bom momento de buscar apoio profissional.',
    text:   'Os sinais indicam bastante confusão e pouca estrutura para decidir com segurança. Isso não é motivo de alarme. É só o sinal de que esse é um bom momento para buscar ajuda especializada.',
    cta:    'Conversar sobre orientação profissional',
    color:  C.bordo,
    bg:     '#FAEAED',
    Icon:   HeartHandshake,
  }
}

// ─── Selo com a logo oficial ──────────────────────────────────────────────────
function LogoBadge() {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: C.bordo,
      color: '#fff',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      padding: '6px 18px 6px 10px',
      borderRadius: 100,
    }}>
      <img src={`${import.meta.env.BASE_URL}logo-rumo.png`} alt="" style={{ height: 16, width: 'auto' }} />
      Instituto Rumo
    </div>
  )
}

// ─── Tela: Intro ──────────────────────────────────────────────────────────────
function IntroScreen({ onStart }) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '44px 24px',
        background: C.blush,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Blobs decorativos */}
      <div style={{
        position: 'fixed', top: -120, right: -80,
        width: 340, height: 340, borderRadius: '50%',
        background: 'rgba(253,116,93,0.12)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: -80, left: -70,
        width: 260, height: 260, borderRadius: '50%',
        background: 'rgba(59,80,63,0.09)', pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 400, width: '100%', textAlign: 'center' }}>

        {/* Badge */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 28 }}
        >
          <LogoBadge />
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.7rem, 5.8vw, 2.3rem)',
            fontWeight: 800,
            color: C.preto,
            lineHeight: 1.25,
            marginBottom: 20,
          }}
        >
          Você está ajudando ou{' '}
          <span style={{ color: C.coral }}>pressionando</span> o seu filho na
          escolha profissional?
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
          style={{
            fontSize: 15,
            color: '#555',
            lineHeight: 1.7,
            marginBottom: 32,
            fontWeight: 500,
          }}
        >
          Responda este quiz diagnóstico e identifique sinais importantes de
          confusão, falta de informação e ausência de critérios antes da
          primeira escolha profissional.
        </motion.p>

        {/* Bullets */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          style={{
            background: '#fff',
            borderRadius: 18,
            padding: '20px 24px',
            marginBottom: 36,
            textAlign: 'left',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}
        >
          {[
            'Leva apenas 3 minutos',
            'Experiência interativa',
            'Resultado imediato',
            'Criado por psicóloga especialista em orientação profissional',
          ].map((item) => (
            <div key={item} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              marginBottom: 10, fontSize: 14, color: C.preto, fontWeight: 500,
            }}>
              <span style={{ color: C.verde, fontWeight: 900, fontSize: 16, marginTop: 1, flexShrink: 0 }}>✔</span>
              {item}
            </div>
          ))}
        </motion.div>

        {/* Botão */}
        <motion.button
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            width: '100%',
            padding: '19px 32px',
            background: C.coral,
            color: '#fff',
            border: 'none',
            borderRadius: 18,
            fontSize: 16,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 10px 36px rgba(253,116,93,0.38)',
          }}
        >
          Começar avaliação
          <ArrowRight size={18} strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  )
}

// ─── Tela: Pergunta ───────────────────────────────────────────────────────────
function QuestionScreen({ question, index, total, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const progress = (index / total) * 100

  function handleSelect(i) {
    if (selected !== null) return
    setSelected(i)
    setTimeout(() => onAnswer(4 - i), 340)
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: C.blush,
      }}
    >
      {/* Barra de progresso */}
      <div style={{ background: 'rgba(0,0,0,0.08)', height: 5 }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: C.bordo,
            borderRadius: '0 4px 4px 0',
          }}
        />
      </div>

      {/* Contador */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 24px 0',
      }}>
        <div style={{
          background: 'rgba(107,47,60,0.10)',
          color: C.bordo,
          fontSize: 10, fontWeight: 800,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '5px 14px', borderRadius: 100,
        }}>
          Pergunta {index + 1} de {total}
        </div>
        <div style={{
          fontSize: 11, color: '#aaa', fontWeight: 700,
        }}>
          {Math.round(progress)}%
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '20px 20px 32px',
      }}>
        {/* Card da pergunta */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '28px 24px',
          boxShadow: '0 4px 32px rgba(0,0,0,0.07)',
          borderLeft: `5px solid ${C.bordo}`,
          marginBottom: 20,
        }}>
          <p style={{
            fontSize: 'clamp(1rem, 3.8vw, 1.1rem)',
            fontWeight: 700,
            color: C.preto,
            lineHeight: 1.55,
            margin: 0,
          }}>
            {question.text}
          </p>
        </div>

        {/* Opções */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {question.options.map((opt, i) => {
            const isSelected = selected === i
            const isOther = selected !== null && !isSelected

            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isOther ? 0.35 : 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.25 }}
                whileHover={selected === null ? { scale: 1.015 } : {}}
                whileTap={selected === null ? { scale: 0.98 } : {}}
                onClick={() => handleSelect(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '16px 18px',
                  background: isSelected ? C.coral : '#fff',
                  border: `2px solid ${isSelected ? C.coral : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: 14,
                  textAlign: 'left',
                  cursor: selected === null ? 'pointer' : 'default',
                  boxShadow: isSelected ? `0 6px 20px ${C.coral}40` : '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Letra */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: isSelected ? 'rgba(255,255,255,0.25)' : `${C.bordo}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800,
                  color: isSelected ? '#fff' : C.bordo,
                }}>
                  {['A', 'B', 'C', 'D'][i]}
                </div>
                <span style={{
                  fontSize: 13.5, fontWeight: 600,
                  color: isSelected ? '#fff' : C.preto,
                  lineHeight: 1.45,
                }}>
                  {opt}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Códigos internacionais (DDI) ─────────────────────────────────────────────
const DDI_OPTIONS = [
  { code: '+55', label: 'Brasil +55' },
  { code: '+351', label: 'Portugal +351' },
  { code: '+1', label: 'EUA/Canadá +1' },
  { code: '+34', label: 'Espanha +34' },
  { code: '+44', label: 'Reino Unido +44' },
  { code: '+49', label: 'Alemanha +49' },
  { code: '+33', label: 'França +33' },
  { code: '+39', label: 'Itália +39' },
  { code: '+54', label: 'Argentina +54' },
  { code: '+598', label: 'Uruguai +598' },
  { code: '+595', label: 'Paraguai +595' },
]

// ─── Tela: Captura de lead ────────────────────────────────────────────────────
function CaptureScreen({ onSubmit }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [ddi, setDdi] = useState('+55')
  const [whatsapp, setWhatsapp] = useState('')

  const valido = nome.trim().length > 1 && /\S+@\S+\.\S+/.test(email) && whatsapp.trim().length >= 8

  function handleSubmit(e) {
    e.preventDefault()
    if (!valido) return
    onSubmit({ nome: nome.trim(), email: email.trim(), whatsapp: `${ddi} ${whatsapp.trim()}` })
  }

  const inputStyle = {
    width: '100%',
    padding: '15px 16px',
    fontSize: 15,
    fontWeight: 500,
    color: C.preto,
    background: '#fff',
    border: '2px solid rgba(0,0,0,0.08)',
    borderRadius: 14,
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <motion.div
      key="capture"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '44px 24px',
        background: C.blush,
      }}
    >
      <div style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 60, height: 60,
            background: C.bordo,
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Mail color="#fff" size={26} strokeWidth={2} />
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.3rem, 4.8vw, 1.6rem)',
            fontWeight: 700,
            color: C.preto,
            lineHeight: 1.35,
            marginBottom: 12,
          }}>
            Seu resultado está pronto!
          </h2>
          <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, fontWeight: 500 }}>
            Deixe seus dados para receber o diagnóstico completo e os próximos passos por e-mail.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            style={inputStyle}
            type="email"
            placeholder="Seu melhor e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <select
              value={ddi}
              onChange={(e) => setDdi(e.target.value)}
              style={{ ...inputStyle, width: 'auto', flexShrink: 0, paddingRight: 8 }}
            >
              {DDI_OPTIONS.map((d) => (
                <option key={d.code} value={d.code}>{d.label}</option>
              ))}
            </select>
            <input
              style={inputStyle}
              type="tel"
              placeholder="WhatsApp (com DDD)"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <motion.button
            type="submit"
            whileHover={valido ? { scale: 1.02 } : {}}
            whileTap={valido ? { scale: 0.97 } : {}}
            disabled={!valido}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              width: '100%',
              padding: '19px 32px',
              background: valido ? C.coral : 'rgba(0,0,0,0.15)',
              color: '#fff',
              border: 'none',
              borderRadius: 18,
              fontSize: 16,
              fontWeight: 800,
              cursor: valido ? 'pointer' : 'not-allowed',
              boxShadow: valido ? '0 10px 36px rgba(253,116,93,0.38)' : 'none',
              marginTop: 8,
            }}
          >
            Ver meu resultado
            <ArrowRight size={18} strokeWidth={2.5} />
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#aaa', marginTop: 18, fontWeight: 500 }}>
          Seus dados estão seguros e não serão compartilhados.
        </p>
      </div>
    </motion.div>
  )
}

// ─── Tela: Resultado ──────────────────────────────────────────────────────────
function ResultsScreen({ score, lead, onRestart }) {
  const { badge, title, text, cta, color, bg, Icon } = getResult(score)
  const pct = Math.round(((score - 10) / 30) * 100)
  const primeiroNome = lead?.nome?.split(' ')[0]

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        minHeight: '100vh',
        background: C.blush,
        padding: '32px 20px 52px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Blob decorativo */}
      <div style={{
        position: 'fixed', bottom: -80, right: -80,
        width: 280, height: 280, borderRadius: '50%',
        background: `${color}14`, pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 420, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Badge Instituto Rumo */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <LogoBadge />
          {primeiroNome && (
            <p style={{ marginTop: 12, fontSize: 14, color: '#555', fontWeight: 600 }}>
              {primeiroNome}, seu resultado ficou pronto
            </p>
          )}
        </div>

        {/* Card principal do resultado */}
        <div style={{
          background: bg,
          borderRadius: 24,
          padding: '36px 28px',
          marginBottom: 16,
          border: `2px solid ${color}20`,
        }}>
          {/* Ícone */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 220 }}
            style={{
              width: 68, height: 68,
              background: color,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: `0 10px 28px ${color}45`,
            }}
          >
            <Icon color="#fff" size={28} strokeWidth={2} />
          </motion.div>

          {/* Badge do resultado */}
          <div style={{
            display: 'inline-block',
            background: `${color}22`,
            color,
            fontSize: 11, fontWeight: 800,
            letterSpacing: '0.06em',
            padding: '6px 16px', borderRadius: 100,
            marginBottom: 16,
          }}>
            {badge}
          </div>

          {/* Título */}
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.2rem, 4.3vw, 1.45rem)',
            fontWeight: 700,
            color: C.preto,
            lineHeight: 1.35,
            marginBottom: 16,
          }}>
            {title}
          </h2>

          {/* Barra de pontuação */}
          <div style={{
            background: 'rgba(0,0,0,0.07)',
            height: 7, borderRadius: 100,
            marginBottom: 20, overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ delay: 0.3, duration: 0.9, ease: 'easeOut' }}
              style={{ height: '100%', background: color, borderRadius: 100 }}
            />
          </div>

          {/* Texto */}
          <p style={{
            fontSize: 14, color: '#555',
            lineHeight: 1.75, margin: 0, fontWeight: 500,
          }}>
            {text}
          </p>
        </div>

        {/* CTA WhatsApp */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={openWhatsApp}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            width: '100%',
            padding: '20px',
            background: '#25D366',
            border: 'none',
            borderRadius: 18,
            fontSize: 15,
            fontWeight: 800,
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 10px 28px rgba(37,211,102,0.38)',
            marginBottom: 12,
          }}
        >
          <MessageCircle size={20} strokeWidth={2.5} />
          {cta}
        </motion.button>

        {/* Refazer */}
        <button
          onClick={onRestart}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            padding: '15px',
            background: 'transparent',
            border: '2px solid rgba(0,0,0,0.10)',
            borderRadius: 16,
            fontSize: 13,
            fontWeight: 700,
            color: '#aaa',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={14} strokeWidth={2.5} />
          Refazer o quiz
        </button>

        <p style={{
          textAlign: 'center', fontSize: 11,
          color: '#ccc', marginTop: 24, fontWeight: 500,
        }}>
          © Instituto Rumo · Orientação Profissional
        </p>
      </div>
    </motion.div>
  )
}

// ─── App Principal ────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]   = useState('intro')
  const [index, setIndex]     = useState(0)
  const [scores, setScores]   = useState([])
  const [lead, setLead]       = useState(null)

  function handleAnswer(pts) {
    const next = [...scores, pts]
    setScores(next)
    if (index + 1 < QUESTIONS.length) {
      setIndex(index + 1)
    } else {
      setScreen('capture')
    }
  }

  const totalScore = scores.reduce((a, b) => a + b, 0)

  function handleCapture(data) {
    setLead(data)
    // O resultado vai junto com o lead: é ele que o e-mail 1 da automação
    // devolve pra pessoa. Sem isso o Brevo só tem a pontuação crua.
    const resultado = getResult(totalScore)
    sendLead({
      ...data,
      pontuacao: totalScore,
      perfil: resultado.id,
      resultadoTitulo: resultado.title,
      resultadoTexto: resultado.text,
    })
    setScreen('results')
  }

  function restart() {
    setScreen('intro')
    setIndex(0)
    setScores([])
    setLead(null)
  }

  return (
    <AnimatePresence mode="wait">
      {screen === 'intro' && (
        <IntroScreen onStart={() => setScreen('questions')} />
      )}
      {screen === 'questions' && (
        <QuestionScreen
          key={`q-${index}`}
          question={QUESTIONS[index]}
          index={index}
          total={QUESTIONS.length}
          onAnswer={handleAnswer}
        />
      )}
      {screen === 'capture' && (
        <CaptureScreen onSubmit={handleCapture} />
      )}
      {screen === 'results' && (
        <ResultsScreen
          score={totalScore}
          lead={lead}
          onRestart={restart}
        />
      )}
    </AnimatePresence>
  )
}
