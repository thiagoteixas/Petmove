export const topMetrics = [
  {
    label: 'Gasto calorico',
    value: '1.248 kcal',
    helper: '+12% acima da media da ultima semana',
    tone: 'ember' as const,
  },
  {
    label: 'Sono profundo',
    value: '3h 14m',
    helper: 'Recuperacao consistente durante a madrugada',
    tone: 'mint' as const,
  },
  {
    label: 'Tempo ativo',
    value: '96 min',
    helper: 'Distribuido entre passeio, corrida e brincadeira',
    tone: 'sky' as const,
  },
  {
    label: 'Rotas seguras',
    value: '97%',
    helper: 'Sem desvios incomuns nas saidas monitoradas',
    tone: 'sand' as const,
  },
]

// Fallback used while API response is loading.
// Shape must match DayMetrics from src/api/index.ts.
export const weeklyVitals = [
  { day: 'Seg', date: '', calories: 980,  activeMinutes: 62,  stepsPerDay: 6200,  healthScore: 81 },
  { day: 'Ter', date: '', calories: 1130, activeMinutes: 74,  stepsPerDay: 7400,  healthScore: 86 },
  { day: 'Qua', date: '', calories: 1040, activeMinutes: 69,  stepsPerDay: 6900,  healthScore: 83 },
  { day: 'Qui', date: '', calories: 1210, activeMinutes: 82,  stepsPerDay: 8200,  healthScore: 89 },
  { day: 'Sex', date: '', calories: 1195, activeMinutes: 88,  stepsPerDay: 8800,  healthScore: 91 },
  { day: 'Sab', date: '', calories: 1375, activeMinutes: 102, stepsPerDay: 10200, healthScore: 95 },
  { day: 'Dom', date: '', calories: 1248, activeMinutes: 96,  stepsPerDay: 8420,  healthScore: 87 },
]

export const sleepBreakdown = [
  { name: 'Sono profundo', value: 38, label: '3h 14m', color: '#123524' },
  { name: 'Sono leve', value: 44, label: '3h 46m', color: '#56b89a' },
  { name: 'Estado de alerta', value: 18, label: '1h 32m', color: '#f4b55f' },
]

export const readinessFactors = [
  {
    title: 'Ambiente estavel',
    description: 'Pouca variacao de ruido e temperatura durante a noite.',
    score: 'Excelente',
    level: 'good',
  },
  {
    title: 'Alertas leves',
    description: 'Dois eventos curtos de agitacao apos a ultima alimentacao.',
    score: 'Atenção',
    level: 'medium',
  },
  {
    title: 'Resposta ao exercicio',
    description: 'Recuperacao rapida depois do passeio mais intenso.',
    score: 'Forte',
    level: 'good',
  },
]

export const careTimeline = [
  {
    time: '18:30',
    title: 'Passeio curto guiado',
    description: '20 minutos em ritmo leve para manter o gasto energetico sem sobrecarga.',
  },
  {
    time: '20:10',
    title: 'Janela ideal de descanso',
    description: 'Melhor horario para reduzir estimulos e favorecer recuperacao.',
  },
  {
    time: '21:00',
    title: 'Revisao do consumo de agua',
    description: 'Validar se a hidratacao acompanhou o volume de atividade do dia.',
  },
]

export const featureHighlights = [
  {
    title: 'Visao rapida do bem-estar',
    description: 'Cards objetivos ajudam o tutor a entender, em segundos, o estado geral do cachorro.',
  },
  {
    title: 'Graficos que contam historia',
    description: 'A evolucao semanal deixa claro quando o pet gastou mais energia ou dormiu melhor.',
  },
  {
    title: 'Recomendacoes acionaveis',
    description: 'O dashboard nao para em numero bruto: ele sugere o que fazer com base no padrao observado.',
  },
]
