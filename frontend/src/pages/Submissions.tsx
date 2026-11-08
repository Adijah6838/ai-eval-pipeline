import { useState, useEffect } from 'react';
import { Play, CheckCircle, XCircle, Code2, Terminal } from 'lucide-react';
import { api } from '../services/api';

export function Submissions() {
  const [developers, setDevelopers] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  
  const [devId, setDevId] = useState('');
  const [chalId, setChalId] = useState('');
  const [code, setCode] = useState('');
  
  const [evaluating, setEvaluating] = useState(false);
  const [activeEval, setActiveEval] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [d, c, s] = await Promise.all([api.get('/developers'), api.get('/challenges'), api.get('/submissions')]);
      setDevelopers(d); setChallenges(c); setSubmissions(s);
      if (d.length > 0 && !devId) setDevId(d[0].id.toString());
      if (c.length > 0 && !chalId) setChalId(c[0].id.toString());
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sub = await api.post('/submissions', { developer_id: parseInt(devId), challenge_id: parseInt(chalId), source_code: code });
      setCode('');
      fetchData();
      
      // Auto-run evaluation
      setEvaluating(true);
      const evaluation = await api.post(`/evaluations/${sub.id}/run`, {});
      setActiveEval(evaluation);
      setEvaluating(false);
      fetchData();
    } catch (err: any) { alert(err.message); setEvaluating(false); }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      
      {/* Left: Code Editor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Submit Code</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Developer</label>
                <select value={devId} onChange={e => setDevId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px' }}>
                  {developers.map(d => <option key={d.id} value={d.id}>{d.full_name}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Challenge</label>
                <select value={chalId} onChange={e => setChalId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px' }}>
                  {challenges.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
            </div>
            
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Source Code</label>
              <textarea 
                required value={code} onChange={e => setCode(e.target.value)} rows={12} 
                placeholder="def solution():&#10;    # Write your code here&#10;    return True"
                style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px', fontFamily: 'monospace', fontSize: '0.9rem', resize: 'vertical', backgroundColor: '#0f172a', color: '#e2e8f0' }} 
              />
            </div>

            <button type="submit" disabled={evaluating} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: '#6366f1', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: evaluating ? 'not-allowed' : 'pointer', opacity: evaluating ? 0.7 : 1 }}>
              <Play size={18} /> {evaluating ? 'Running Evaluation...' : 'Submit & Evaluate'}
            </button>
          </form>
        </div>
      </div>

      {/* Right: Results & History */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Active Evaluation Result */}
        {activeEval && (
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', borderLeft: '4px solid #6366f1' }}>
            <h2 style={{ marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={24} color="#6366f1" /> Evaluation Report
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: '#64748b' }}>Overall Score</p>
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#6366f1' }}>{activeEval.overall_score}/100</h3>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: '#64748b' }}>Tests Passed</p>
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#10b981' }}>{activeEval.passed_tests} / {activeEval.passed_tests + activeEval.failed_tests}</h3>
              </div>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0' }}>AI Feedback</h4>
              <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', whiteSpace: 'pre-wrap', fontSize: '0.875rem', color: '#334155' }}>
                {activeEval.ai_feedback || "No feedback generated."}
              </div>
            </div>
          </div>
        )}

        {/* Submission History */}
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', flex: 1 }}>
          <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Recent Submissions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {submissions.map(sub => (
              <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>Submission #{sub.id}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Dev ID: {sub.developer_id} | Chal ID: {sub.challenge_id}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 600, color: sub.status === 'Passed' ? '#10b981' : sub.status === 'Failed' ? '#ef4444' : '#f59e0b' }}>
                  {sub.status === 'Passed' ? <CheckCircle size={16} /> : <XCircle size={16} />} {sub.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
