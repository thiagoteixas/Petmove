import { useState } from 'react'
import type { DayMetrics } from './api/index'
import {
  Activity,
  AlertTriangle,
  BellRing,
  ChevronRight,
  Flame,
  Footprints,
  Gauge,
  HeartPulse,
  MoonStar,
  Radar,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingUp,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { SectionHeading } from './components/SectionHeading'
import { StatCard } from './components/StatCard'
import { usePetData } from './hooks/usePetData'
import {
  careTimeline,
  featureHighlights,
  readinessFactors,
  sleepBreakdown,
} from './data/mockData'
import './App.css'

type Tab = 'hoje' | 'semana' | 'tendencias'

const factorIcons = [ShieldCheck, BellRing, Radar] as const

const TOOLTIP_STYLE = {
  borderRadius: 18,
  border: '1px solid #d8dfd9',
  background: '#fefcf7',
  boxShadow: '0 20px 40px rgba(40, 58, 48, 0.12)',
}

function avg(arr: number[]) {
  return arr.length > 0 ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="empty-state">
      <AlertTriangle size={20} />
      <span>{message}</span>
    </div>
  )
}

function MetricValue({ value }: { value: string | number | null | undefined }) {
  if (value == null) return <span className="metric-no-data">—</span>
  return <>{value}</>
}

function App() {
  const { dog, todayMetrics, weekMetrics, loading, error } = usePetData()

  const [activeTab, setActiveTab] = useState<Tab>('hoje')

  const chartData: DayMetrics[] = weekMetrics
  const dogName = dog?.name ?? '—'
  const healthScore = todayMetrics?.healthScore ?? null

  const weekAvgCalories = avg(chartData.map(d => d.calories))
  const weekAvgMinutes = avg(chartData.map(d => d.activeMinutes))
  const weekAvgScore = avg(chartData.map(d => d.healthScore ?? 0))
  const bestDay = chartData.length > 0
    ? chartData.reduce((best, d) => d.activeMinutes > best.activeMinutes ? d : best).day
    : null

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner" />
        <p>Carregando dados do pet...</p>
      </div>
    )
  }

  return (
    <div className="app-shell">
      {error && (
        <div className="error-banner" role="alert">
          <AlertTriangle size={16} />
          <span>Erro ao conectar com o servidor: {error}</span>
        </div>
      )}
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <span className="brand-mark__pulse" />
          </div>
          <div>
            <p className="eyebrow">Petmove</p>
            <strong>Coleira inteligente para rotina, sono e energia</strong>
          </div>
        </div>

        <nav className="topnav" aria-label="Navegacao principal">
          <a href="#dashboard">Dashboard</a>
          <a href="#insights">Insights</a>
          <a href="#rotina">Rotina</a>
        </nav>

        <button className="ghost-button" type="button">
          Modo demo
        </button>
      </header>

      <main className="page-content">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Monitoramento em tempo real</p>
            <h1>
              Saude e comportamento do cachorro em um dashboard claro,
              elegante e acionavel.
            </h1>
            <p className="hero-description">
              O Petmove acompanha gasto calorico, sono, atividade e sinais de
              estresse ao longo do dia, sincroniza tudo com a nuvem e transforma
              os dados em decisoes simples para o tutor.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#dashboard">
                Ver dashboard
                <ChevronRight size={18} />
              </a>
              <button className="secondary-button" type="button">
                Ver status da coleira
              </button>
            </div>

            <ul className="hero-badges" aria-label="Indicadores principais">
              <li>
                <HeartPulse size={16} />
                {healthScore != null ? `Prontidao em ${healthScore}%` : 'Score indisponivel'}
              </li>
              <li>
                <Sparkles size={16} />
                Recomenda treino leve hoje
              </li>
              <li>
                <Gauge size={16} />
                Sincronizacao a cada 15 min
              </li>
            </ul>
          </div>

          {/* ── Dog profile panel ────────────────────────────────────────── */}
          <aside className="hero-panel">
            <div className="hero-panel__status">
              <span className="status-dot" />
              Coleira online
            </div>

            <div className="dog-card">
              <div>
                <p className="dog-card__label">Pet em acompanhamento</p>
                {dog
                  ? <h2>{dog.name}</h2>
                  : <p className="no-dog-label">Nenhum pet cadastrado</p>}
              </div>
              <div className="dog-card__score">
                <strong><MetricValue value={healthScore} /></strong>
                <span>score de saude</span>
              </div>
            </div>

            {dog ? (
              <>
                {/* Profile fields: nome/raça/porte/peso/idade/sexo */}
                <div className="dog-profile-grid">
                  <div className="dog-profile-item">
                    <span>Raça</span>
                    <strong>{dog.breed}</strong>
                  </div>
                  <div className="dog-profile-item">
                    <span>Porte</span>
                    <strong>{dog.size}</strong>
                  </div>
                  <div className="dog-profile-item">
                    <span>Peso</span>
                    <strong>{dog.weight} kg</strong>
                  </div>
                  <div className="dog-profile-item">
                    <span>Sexo</span>
                    <strong>{dog.gender}</strong>
                  </div>
                  {dog.bodyCondition && (
                    <div className="dog-profile-item dog-profile-item--full">
                      <span>Condição corporal</span>
                      <strong>{dog.bodyCondition}</strong>
                    </div>
                  )}
                </div>

                {dog.medicalRestrictions.length > 0 && (
                  <div className="medical-restrictions">
                    <span>Restrições médicas</span>
                    <div className="medical-tags">
                      {dog.medicalRestrictions.map(r => (
                        <span key={r} className="medical-tag">{r}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <EmptyState message="Cadastre um pet para ver o perfil completo" />
            )}

            {/* restrições médicas — optional field */}
            {dog?.medicalRestrictions && dog.medicalRestrictions.length > 0 && (
              <div className="medical-restrictions">
                <span>Restrições médicas</span>
                <div className="medical-tags">
                  {dog.medicalRestrictions.map(r => (
                    <span key={r} className="medical-tag">{r}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="hero-panel__mini-grid">
              <article>
                <span>Minutos ativos</span>
                <strong>
                  <MetricValue
                    value={todayMetrics ? `${todayMetrics.activeMinutes} min` : null}
                  />
                </strong>
              </article>
              <article>
                <span>Passos hoje</span>
                <strong>
                  <MetricValue
                    value={
                      todayMetrics?.stepsPerDay != null
                        ? todayMetrics.stepsPerDay.toLocaleString('pt-BR')
                        : null
                    }
                  />
                </strong>
              </article>
              <article>
                <span>Alertas</span>
                <strong>
                  {todayMetrics
                    ? todayMetrics.lowActivityAlert ? '01 ativo' : 'Nenhum'
                    : '—'}
                </strong>
              </article>
            </div>
          </aside>
        </section>

        {/* ── Dashboard ────────────────────────────────────────────────────── */}
        <section className="section-block" id="dashboard">
          <SectionHeading
            eyebrow="Visao geral"
            title="Leitura do dia"
            description="Uma combinacao de indicadores claros para entender como o cachorro dormiu, se movimentou e reagiu ao ambiente nas ultimas horas."
          />

          {/* alerta de pouca atividade */}
          {todayMetrics?.lowActivityAlert && (
            <div className="activity-alert" role="alert">
              <AlertTriangle size={18} />
              <span>
                {dogName} ficou menos de 30 minutos ativo hoje. Considere um passeio curto no fim do dia.
              </span>
            </div>
          )}

          {/* Tab selector */}
          <div className="dashboard-tabs" role="tablist">
            {(['hoje', 'semana', 'tendencias'] as Tab[]).map(tab => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={`dashboard-tab${activeTab === tab ? ' dashboard-tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab === 'hoje' ? 'Hoje' : tab === 'semana' ? 'Semana' : 'Tendências'}
              </button>
            ))}
          </div>

          {/* ── Tab: Hoje ──────────────────────────────────────────────────── */}
          {activeTab === 'hoje' && (
            <>
              {/* 6 required metrics */}
              <div className="metrics-grid">
                <StatCard
                  icon={Flame}
                  label="Calorias gastas"
                  value={
                    todayMetrics
                      ? `${todayMetrics.caloriesBurned.toLocaleString('pt-BR')} kcal`
                      : '—'
                  }
                  helper="Gasto energetico total do dia"
                  tone="ember"
                />
                <StatCard
                  icon={Footprints}
                  label="Passos no dia"
                  value={
                    todayMetrics?.stepsPerDay != null
                      ? todayMetrics.stepsPerDay.toLocaleString('pt-BR')
                      : '—'
                  }
                  helper="Total de passos registrados pela coleira"
                  tone="sky"
                />
                <StatCard
                  icon={Activity}
                  label="Tempo ativo"
                  value={todayMetrics ? `${todayMetrics.activeMinutes} min` : '—'}
                  helper="Caminhada, corrida e brincadeira"
                  tone="mint"
                />
                <StatCard
                  icon={HeartPulse}
                  label="Score de saude"
                  value={todayMetrics ? `${todayMetrics.healthScore}/100` : '—'}
                  helper={todayMetrics?.diagnosis ?? 'Aguardando sincronizacao'}
                  tone="sand"
                />
                <StatCard
                  icon={Timer}
                  label="Indice de sedentarismo"
                  value={
                    todayMetrics
                      ? `${Math.round(todayMetrics.sedentaryIndex * 100)}%`
                      : '—'
                  }
                  helper="Percentual de tempo em repouso"
                  tone="sky"
                />
                <StatCard
                  icon={todayMetrics?.lowActivityAlert ? AlertTriangle : ShieldCheck}
                  label="Atividade fisica"
                  value={
                    todayMetrics
                      ? todayMetrics.lowActivityAlert
                        ? 'Alerta'
                        : 'Em dia'
                      : '—'
                  }
                  helper={
                    todayMetrics?.lowActivityAlert
                      ? 'Menos de 30 min ativos registrados'
                      : 'Meta de atividade atingida'
                  }
                  tone={todayMetrics?.lowActivityAlert ? 'ember' : 'mint'}
                />
              </div>

              <div className="analytics-grid analytics-grid--two-col">
                {/* Sleep breakdown */}
                <article className="surface-panel" id="insights">
                  <div className="panel-header">
                    <div>
                      <p className="eyebrow">Qualidade do sono</p>
                      <h3>Ciclos da noite</h3>
                    </div>
                    <MoonStar size={20} className="panel-icon" />
                  </div>
                  <div className="sleep-card">
                    <div className="sleep-chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sleepBreakdown}
                            dataKey="value"
                            innerRadius={56}
                            outerRadius={82}
                            paddingAngle={4}
                            stroke="none"
                          >
                            {sleepBreakdown.map(slice => (
                              <Cell key={slice.name} fill={slice.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="sleep-chart__center">
                        <strong>8h 32m</strong>
                        <span>sono total</span>
                      </div>
                    </div>
                    <ul className="sleep-legend">
                      {sleepBreakdown.map(slice => (
                        <li key={slice.name}>
                          <span
                            className="sleep-legend__dot"
                            style={{ backgroundColor: slice.color }}
                          />
                          <div>
                            <strong>{slice.name}</strong>
                            <span>{slice.label}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>

                {/* Active minutes bar chart */}
                <article className="surface-panel">
                  <div className="panel-header">
                    <div>
                      <p className="eyebrow">Movimento diario</p>
                      <h3>Minutos ativos</h3>
                    </div>
                    <Activity size={20} className="panel-icon" />
                  </div>
                  <div className="chart-wrap chart-wrap--compact">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} barGap={10}>
                        <CartesianGrid vertical={false} stroke="#e6ece7" />
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#5f6d63', fontSize: 12 }}
                        />
                        <YAxis hide />
                        <Tooltip contentStyle={TOOLTIP_STYLE} />
                        <Bar dataKey="activeMinutes" radius={[14, 14, 6, 6]} fill="#123524" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </article>
              </div>
            </>
          )}

          {/* ── Tab: Semana ────────────────────────────────────────────────── */}
          {activeTab === 'semana' && chartData.length === 0 && (
            <EmptyState message="Sem dados históricos para esta semana" />
          )}
          {activeTab === 'semana' && chartData.length > 0 && (
            <div className="analytics-grid">
              {/* Calories evolution */}
              <article className="surface-panel surface-panel--wide">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">Calorias e atividade</p>
                    <h3>Evolucao semanal</h3>
                  </div>
                  <div className="panel-badge">Ultimos 7 dias</div>
                </div>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="caloriesFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff7c45" stopOpacity={0.38} />
                          <stop offset="95%" stopColor="#ff7c45" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="#dde4de" strokeDasharray="4 4" />
                      <XAxis
                        axisLine={false}
                        dataKey="day"
                        tickLine={false}
                        tick={{ fill: '#5f6d63', fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#5f6d63', fontSize: 12 }}
                        width={42}
                      />
                      <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        cursor={{ stroke: '#123524', strokeDasharray: '4 4' }}
                      />
                      <Area
                        dataKey="calories"
                        fill="url(#caloriesFill)"
                        stroke="#ff7c45"
                        strokeWidth={3}
                        type="monotone"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </article>

              {/* Active minutes bar */}
              <article className="surface-panel">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">Movimento semanal</p>
                    <h3>Minutos ativos</h3>
                  </div>
                  <Activity size={20} className="panel-icon" />
                </div>
                <div className="chart-wrap chart-wrap--compact">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barGap={10}>
                      <CartesianGrid vertical={false} stroke="#e6ece7" />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#5f6d63', fontSize: 12 }}
                      />
                      <YAxis hide />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="activeMinutes" radius={[14, 14, 6, 6]} fill="#123524" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              {/* Weekly summary */}
              <article className="surface-panel">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">Media da semana</p>
                    <h3>Resumo</h3>
                  </div>
                  <TrendingUp size={20} className="panel-icon" />
                </div>
                <ul className="week-summary">
                  <li>
                    <span>Calorias/dia</span>
                    <strong>
                      {weekAvgCalories > 0
                        ? `${weekAvgCalories.toLocaleString('pt-BR')} kcal`
                        : '—'}
                    </strong>
                  </li>
                  <li>
                    <span>Min. ativos/dia</span>
                    <strong>{weekAvgMinutes > 0 ? `${weekAvgMinutes} min` : '—'}</strong>
                  </li>
                  <li>
                    <span>Melhor dia</span>
                    <strong>{bestDay}</strong>
                  </li>
                  <li>
                    <span>Score medio</span>
                    <strong>{weekAvgScore > 0 ? `${weekAvgScore}/100` : '—'}</strong>
                  </li>
                </ul>
              </article>
            </div>
          )}

          {/* ── Tab: Tendências ────────────────────────────────────────────── */}
          {activeTab === 'tendencias' && chartData.length === 0 && (
            <EmptyState message="Sem dados históricos para analisar tendências" />
          )}
          {activeTab === 'tendencias' && chartData.length > 0 && (
            <div className="analytics-grid">
              {/* Health score trend line */}
              <article className="surface-panel surface-panel--wide">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">Score de saude</p>
                    <h3>Tendencia da semana</h3>
                  </div>
                  <div className="panel-badge">Ultimos 7 dias</div>
                </div>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid vertical={false} stroke="#dde4de" strokeDasharray="4 4" />
                      <XAxis
                        axisLine={false}
                        dataKey="day"
                        tickLine={false}
                        tick={{ fill: '#5f6d63', fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#5f6d63', fontSize: 12 }}
                        domain={[0, 100]}
                        width={42}
                      />
                      <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        cursor={{ stroke: '#123524', strokeDasharray: '4 4' }}
                      />
                      <Line
                        dataKey="healthScore"
                        stroke="#56b89a"
                        strokeWidth={3}
                        dot={{ fill: '#56b89a', r: 5 }}
                        activeDot={{ r: 7 }}
                        type="monotone"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </article>

              {/* Trend indicators */}
              <article className="surface-panel">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">Analise semanal</p>
                    <h3>Indicadores</h3>
                  </div>
                  <TrendingUp size={20} className="panel-icon" />
                </div>
                <ul className="week-summary">
                  <li>
                    <span>Score hoje</span>
                    <strong><MetricValue value={healthScore != null ? `${healthScore}/100` : null} /></strong>
                  </li>
                  <li>
                    <span>Score medio</span>
                    <strong>{weekAvgScore > 0 ? `${weekAvgScore}/100` : '—'}</strong>
                  </li>
                  <li>
                    <span>Melhor score</span>
                    <strong>
                      {chartData.length > 0
                        ? `${Math.max(...chartData.map(d => d.healthScore ?? 0))}/100`
                        : '—'}
                    </strong>
                  </li>
                  <li>
                    <span>Passos media/dia</span>
                    <strong>
                      {chartData.some(d => d.stepsPerDay != null)
                        ? avg(
                            chartData
                              .map(d => d.stepsPerDay)
                              .filter((s): s is number => s != null)
                          ).toLocaleString('pt-BR')
                        : '—'}
                    </strong>
                  </li>
                </ul>
              </article>

              {/* Sedentary gauge */}
              <article className="surface-panel">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">Sedentarismo</p>
                    <h3>Nivel de repouso</h3>
                  </div>
                  <Timer size={20} className="panel-icon" />
                </div>
                <div className="sedentary-gauge">
                  {todayMetrics ? (
                    <>
                      <div className="sedentary-gauge__bar">
                        <div
                          className="sedentary-gauge__fill"
                          style={{ width: `${Math.round(todayMetrics.sedentaryIndex * 100)}%` }}
                        />
                      </div>
                      <div className="sedentary-gauge__labels">
                        <span>Ativo</span>
                        <strong>{Math.round(todayMetrics.sedentaryIndex * 100)}%</strong>
                        <span>Sedentario</span>
                      </div>
                      <p className="sedentary-gauge__description">
                        {todayMetrics.sedentaryIndex > 0.5
                          ? `${dogName} passou mais da metade do dia em repouso. Considere aumentar a atividade gradualmente.`
                          : `Indice de sedentarismo dentro da faixa saudavel.`}
                      </p>
                    </>
                  ) : (
                    <EmptyState message="Sem dados de sedentarismo para hoje" />
                  )}
                </div>
              </article>
            </div>
          )}
        </section>

        {/* ── Insights ─────────────────────────────────────────────────────── */}
        <section className="insight-grid" id="insights">
          <article className="surface-panel surface-panel--accent">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Leitura automatica</p>
                <h3>Prontidao do dia</h3>
              </div>
              <Gauge size={20} className="panel-icon" />
            </div>

            <p className="coach-note">
              {dogName} acordou bem recuperado, mas teve queda de energia apos um pico
              forte de atividade no meio da tarde. O sistema sugere uma caminhada
              curta no fim do dia e reforco de descanso depois das 20h.
            </p>

            <ul className="factor-list">
              {readinessFactors.map((factor, index) => {
                const Icon = factorIcons[index]
                return (
                  <li key={factor.title}>
                    <span className="factor-icon">
                      <Icon size={18} />
                    </span>
                    <div>
                      <strong>{factor.title}</strong>
                      <p>{factor.description}</p>
                    </div>
                    <span className={`factor-score factor-score--${factor.level}`}>
                      {factor.score}
                    </span>
                  </li>
                )
              })}
            </ul>
          </article>

          <article className="surface-panel" id="rotina">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Rotina recomendada</p>
                <h3>Proximas janelas</h3>
              </div>
              <BellRing size={20} className="panel-icon" />
            </div>

            <ol className="timeline-list">
              {careTimeline.map(item => (
                <li key={item.time}>
                  <span className="timeline-time">{item.time}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </article>
        </section>

        {/* ── Features ─────────────────────────────────────────────────────── */}
        <section className="section-block section-block--features">
          <SectionHeading
            eyebrow="Porque funciona"
            title="O que o tutor enxerga no site"
            description="O mockup foi desenhado como um SPA simples, com blocos claros para status em tempo real, historico, recomendacoes e leitura rapida do bem-estar do animal."
          />

          <div className="feature-grid">
            {featureHighlights.map(feature => (
              <article className="feature-card" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
