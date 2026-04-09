import {
  Activity,
  BellRing,
  ChevronRight,
  Flame,
  Gauge,
  HeartPulse,
  MapPinned,
  MoonStar,
  Radar,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { SectionHeading } from './components/SectionHeading'
import { StatCard } from './components/StatCard'
import {
  careTimeline,
  featureHighlights,
  readinessFactors,
  sleepBreakdown,
  topMetrics,
  weeklyVitals,
} from './data/mockData'
import './App.css'

const metricIcons = [Flame, MoonStar, Activity, MapPinned] as const
const factorIcons = [ShieldCheck, BellRing, Radar] as const

function App() {
  return (
    <div className="app-shell">
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
                Prontidao em 94%
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

          <aside className="hero-panel">
            <div className="hero-panel__status">
              <span className="status-dot" />
              Coleira online
            </div>

            <div className="dog-card">
              <div>
                <p className="dog-card__label">Pet em acompanhamento</p>
                <h2>Thor, golden retriever, 4 anos</h2>
              </div>
              <div className="dog-card__score">
                <strong>87</strong>
                <span>score diario</span>
              </div>
            </div>

            <div className="hero-panel__pulse">
              <div className="pulse-ring pulse-ring--outer" />
              <div className="pulse-ring pulse-ring--inner" />
              <div className="pulse-core">
                <span>3.8 km</span>
                <small>distancia segura</small>
              </div>
            </div>

            <div className="hero-panel__mini-grid">
              <article>
                <span>Ultimo descanso</span>
                <strong>08h32</strong>
              </article>
              <article>
                <span>Pico de energia</span>
                <strong>16h10</strong>
              </article>
              <article>
                <span>Alertas</span>
                <strong>02 leves</strong>
              </article>
            </div>
          </aside>
        </section>

        <section className="section-block" id="dashboard">
          <SectionHeading
            eyebrow="Visao geral"
            title="Leitura do dia"
            description="Uma combinacao de indicadores claros para entender como o cachorro dormiu, se movimentou e reagiu ao ambiente nas ultimas horas."
          />

          <div className="metrics-grid">
            {topMetrics.map((metric, index) => (
              <StatCard
                key={metric.label}
                icon={metricIcons[index]}
                label={metric.label}
                value={metric.value}
                helper={metric.helper}
                tone={metric.tone}
              />
            ))}
          </div>
        </section>

        <section className="analytics-grid">
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
                <AreaChart data={weeklyVitals}>
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
                    contentStyle={{
                      borderRadius: 18,
                      border: '1px solid #d8dfd9',
                      background: '#fefcf7',
                      boxShadow: '0 20px 40px rgba(40, 58, 48, 0.12)',
                    }}
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
                      {sleepBreakdown.map((slice) => (
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
                {sleepBreakdown.map((slice) => (
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
                <BarChart data={weeklyVitals} barGap={10}>
                  <CartesianGrid vertical={false} stroke="#e6ece7" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#5f6d63', fontSize: 12 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 18,
                      border: '1px solid #d8dfd9',
                      background: '#fefcf7',
                      boxShadow: '0 20px 40px rgba(40, 58, 48, 0.12)',
                    }}
                  />
                  <Bar dataKey="activeMinutes" radius={[14, 14, 6, 6]} fill="#123524" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        <section className="insight-grid">
          <article className="surface-panel surface-panel--accent">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Leitura automatica</p>
                <h3>Prontidao do dia</h3>
              </div>
              <Gauge size={20} className="panel-icon" />
            </div>

            <p className="coach-note">
              Thor acordou bem recuperado, mas teve queda de energia apos um pico
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
              {careTimeline.map((item) => (
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

        <section className="section-block section-block--features">
          <SectionHeading
            eyebrow="Porque funciona"
            title="O que o tutor enxerga no site"
            description="O mockup foi desenhado como um SPA simples, com blocos claros para status em tempo real, historico, recomendacoes e leitura rapida do bem-estar do animal."
          />

          <div className="feature-grid">
            {featureHighlights.map((feature) => (
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
