export type PresentationDeck = {
  topic: string
  eyebrow: string
  accent: string
  slides: PresentationSlide[]
}

export type PresentationSlide = {
  title: string
  body: string
  visual: string
  stat?: string
}

export const presentationDecks: PresentationDeck[] = [
  {
    topic: 'Provando que a lua é feita de queijo',
    eyebrow: 'Investigação lunar • edição especial',
    accent: '#f1c75b',
    slides: [
      { title: 'A hipótese', body: 'Crateras são marcas de mordida cósmica.', visual: '◐', stat: '01' },
      { title: 'Crosta brilhante', body: 'O brilho noturno combina com queijo curado.', visual: 'LUNA\nFROMAGE', stat: '02' },
      { title: 'Amostra suspeita', body: 'Textura granulada detectada nas imagens Apollo.', visual: '▦', stat: 'TEXTURA: 98%' },
      { title: 'O furo perfeito', body: 'Queijo suíço explica naturalmente as crateras.', visual: '○  ○\n  ○', stat: '6.371 km' },
      { title: 'O teste do cheiro', body: 'Vácuo espacial e distância resolvem a dúvida.', visual: '← ~~~', stat: '0 m/s' },
      { title: 'Veredito', body: 'Falta só um foguete com uma faca de manteiga.', visual: '✓', stat: 'CASO ABERTO' },
    ],
  },
  {
    topic: 'A diferença do fã para o fanboy',
    eyebrow: 'Sociologia de arquibancada',
    accent: '#ff8c69',
    slides: [
      { title: 'Fã', body: 'Acompanha, curte e segue a vida.', visual: 'FÃ\n♡', stat: 'EQUILÍBRIO' },
      { title: 'Fanboy', body: 'Monta uma defesa em três atos.', visual: 'FANBOY\n!!!', stat: '3 ATOS' },
      { title: 'Defeito ou feature?', body: 'Fã reconhece. Fanboy rebatiza.', visual: 'BUG → FEATURE', stat: '100% CONVICÇÃO' },
      { title: 'A escala', body: 'Fã compra ingresso. Fanboy compra a discussão.', visual: '1 → ∞', stat: '47 LINKS' },
      { title: 'A conversão', body: 'Fã muda de ideia. Fanboy atualiza o manifesto.', visual: 'v2.0', stat: 'PATCH NOTES' },
      { title: 'Diagnóstico final', body: 'Paixão é saudável. Caps lock é um sinal.', visual: '!!!', stat: 'VOLUME: ALTO' },
    ],
  },
  {
    topic: 'Top 10 colheres comicamente grandes',
    eyebrow: 'Ranking culinário • escala sem moderação',
    accent: '#7dd3fc',
    slides: [
      { title: 'A colher de sopa', body: 'Precisa de cinto de segurança.', visual: '10', stat: 'TAMANHO: 10/10' },
      { title: 'A piscina de cereal', body: 'Perfeita para servir o café da manhã de um bairro.', visual: '🥣', stat: 'CAPACIDADE: 42 L' },
      { title: 'A pá emocional', body: 'Tecnicamente uma pá. Emocionalmente, uma colher.', visual: '╲│╱', stat: 'ÁREA: GIGANTE' },
      { title: 'O almoço completo', body: 'Cabe almoço, sobremesa e uma decisão ruim.', visual: '4', stat: 'RANKING' },
      { title: 'Operação em dupla', body: 'Exige duas pessoas e autorização municipal.', visual: '2×', stat: 'EQUIPE MÍNIMA' },
      { title: 'A atração turística', body: 'Tão grande que ganhou seu próprio CEP.', visual: '#1', stat: 'CAMPEÃ ABSOLUTA' },
    ],
  },
  {
    topic: 'Por que raposas são tão fofas',
    eyebrow: 'Biologia do encanto',
    accent: '#f59e7a',
    slides: [
      { title: 'Orelhas grandes', body: 'Antenas oficiais de fofura.', visual: '▲ ▲', stat: 'FATOR: 10×' },
      { title: 'A cauda', body: 'Cobertor, sinalizador e argumento visual.', visual: '〰〰〰', stat: 'VOLUME: MACIO' },
      { title: 'Olhos atentos', body: 'Qualquer reunião vira documentário.', visual: '●  ●', stat: 'FOCO: 100%' },
      { title: 'Passos leves', body: 'A ilusão perfeita de que tudo está sob controle.', visual: '·  ·  ·', stat: 'RUÍDO: ZERO' },
      { title: 'Paleta laranja', body: 'Combina com folhas e com pôr do sol.', visual: '▰▰▰', stat: 'COR: #F59E7A' },
      { title: 'Design perfeito', body: 'A evolução encontrou seu personagem principal.', visual: '✦', stat: 'FOFURA: APROVADA' },
    ],
  },
  {
    topic: 'Como faturar bilhões vendendo milho na praia usando IA',
    eyebrow: 'Estratégia de crescimento • versão salgada',
    accent: '#a7e36f',
    slides: [
      { title: 'Detecte a fome', body: 'Treine o algoritmo para reconhecer 15h em ponto.', visual: '15:00', stat: 'SINAL: FOME' },
      { title: 'Ache o ponto', body: 'Preveja o lugar exato entre mar e guarda-sol.', visual: 'MAR + SOL', stat: 'PRECISÃO: 93%' },
      { title: 'Personalize', body: 'Manteiga, sal e discurso para cada cliente.', visual: 'IA → 🌽', stat: '1 ESPIGA / PERFIL' },
      { title: 'Transforme em escala', body: 'Cada espiga vira uma unidade de negócio.', visual: '🌽 × 🌽', stat: 'MODELO: REPLICÁVEL' },
      { title: 'Domine a praia', body: 'Escale para quiosques e eventos corporativos.', visual: 'PRAIA → MUNDO', stat: 'FASE: EXPANSÃO' },
      { title: 'A projeção', body: 'Bilhões, ou pelo menos um carrinho respeitado.', visual: 'R$ 1B+', stat: 'ROI: CROCANTE' },
    ],
  },
  {
    topic: 'Qual animal você seria na empresa de produção de hardware',
    eyebrow: 'Mapeamento de fauna corporativa',
    accent: '#c4a7ff',
    slides: [
      { title: 'A capivara', body: 'Mantém a calma enquanto a placa esquenta.', visual: 'CALMA', stat: 'TEMPERATURA: OK' },
      { title: 'O castor', body: 'Constrói protótipos e documenta cada parafuso.', visual: 'BUILD\nSHIP', stat: 'PARAFUSOS: 248' },
      { title: 'O polvo', body: 'Gerencia oito fornecedores antes do almoço.', visual: '8×', stat: 'TAREFAS: SIMULTÂNEAS' },
      { title: 'A coruja', body: 'Encontra o bug escondido no datasheet.', visual: '◉', stat: 'BUG: ENCONTRADO' },
      { title: 'A formiga', body: 'Entrega em escala e nunca perde uma peça.', visual: '▰▰▰', stat: 'ESCALA: ALTA' },
      { title: 'E você?', body: 'Escolha seu habitat, seu sprint e seu animal.', visual: '?', stat: 'SEU PERFIL AGUARDA' },
    ],
  },
]
