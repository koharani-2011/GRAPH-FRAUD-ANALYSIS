import React from 'react';
import { Activity, AlertTriangle, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function DashboardResults({ analysisData, onReset }) {
  if (!analysisData) return null;

  return (
    <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Analysis Results: <span style={{ color: 'var(--text-muted)' }}>{analysisData.filename}</span></h2>
        <button onClick={onReset} className="btn" style={{ background: 'transparent', border: '1px solid var(--border-subtle)' }}>Upload New File</button>
      </div>

      <div className="metrics-grid">
        <div className="glass-card metric-card">
          <span className="metric-title">Total Nodes Analysed</span>
          <span className="metric-value">{analysisData.total_nodes.toLocaleString()}</span>
          <span className="metric-trend trend-neutral"><Activity size={16} /> Dataset</span>
        </div>
        
        <div className="glass-card metric-card">
          <span className="metric-title">Detected Illicit (Fraud)</span>
          <span className="metric-value" style={{ color: 'var(--danger)' }}>{analysisData.illicit.toLocaleString()}</span>
          <span className="metric-trend trend-up"><TrendingUp size={16} /> Attention Required</span>
        </div>

        <div className="glass-card metric-card">
          <span className="metric-title">Safe Transactions</span>
          <span className="metric-value" style={{ color: 'var(--success)' }}>{analysisData.licit.toLocaleString()}</span>
          <span className="metric-trend trend-down"><ShieldCheck size={16} /> {(analysisData.licit / analysisData.total_nodes * 100).toFixed(1)}% Secure</span>
        </div>

        <div className="glass-card metric-card">
          <span className="metric-title">Model Confidence</span>
          <span className="metric-value" style={{ color: 'var(--primary)' }}>{analysisData.confidence}%</span>
          <span className="metric-trend trend-neutral"><AlertTriangle size={16} /> Model prediction</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 500 }}>Temporal Fraud Volume Evolution</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analysisData.time_series} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIllicit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLicit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="transactions" stroke="var(--success)" fillOpacity={1} fill="url(#colorLicit)" name="Total Txns" />
                <Area type="monotone" dataKey="illicit" stroke="var(--danger)" fillOpacity={1} fill="url(#colorIllicit)" name="Fraud Detected" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 500 }}>Overall Distribution</h3>
          <div className="chart-container" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Licit Transactions', value: analysisData.licit },
                    { name: 'Illicit (Fraud)', value: analysisData.illicit }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {[
                    { name: 'Licit Transactions', value: analysisData.licit },
                    { name: 'Illicit (Fraud)', value: analysisData.illicit }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#10b981', '#ef4444'][index % 2]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: 'var(--text-main)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
