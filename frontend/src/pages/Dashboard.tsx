import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Code2, Terminal, TrendingUp } from 'lucide-react';
import { api } from '../services/api';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

const StatCard = ({ title, value, icon, color }: any) => (
  <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <p style={{ color: '#64748b', margin: '0 0 8px 0', fontSize: '0.875rem', fontWeight: 500 }}>{title}</p>
      <h3 style={{ margin: 0, fontSize: '1.75rem' }}>{value}</h3>
    </div>
    <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: `${color}15`, color: color }}>
      {icon}
    </div>
  </div>
);

export function Dashboard() {
  const [overview, setOverview] = useState<any>(null);
  const [performance, setPerformance] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/overview'),
      api.get('/analytics/performance'),
      api.get('/analytics/submissions')
    ]).then(([ov, perf, subs]) => {
      setOverview(ov);
      setPerformance(perf);
      setSubmissions(subs);
    }).catch(console.error);
  }, []);

  if (!overview) return <div style={{ padding: '24px' }}>Loading Dashboard...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Analytics Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <StatCard title="Developers" value={overview.total_developers} icon={<Users size={24} />} color="#6366f1" />
        <StatCard title="Challenges" value={overview.total_challenges} icon={<Code2 size={24} />} color="#8b5cf6" />
        <StatCard title="Total Submissions" value={overview.total_submissions} icon={<Terminal size={24} />} color="#f59e0b" />
        <StatCard title="Avg Score" value={`${overview.average_score}/100`} icon={<TrendingUp size={24} />} color="#10b981" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Top Developer Performance</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" />
                <YAxis dataKey="name" type="category" width={100} stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="score" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Submission Status Breakdown</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={submissions} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {submissions.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
