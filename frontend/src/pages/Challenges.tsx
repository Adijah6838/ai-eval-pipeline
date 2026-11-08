import { useState, useEffect } from 'react';
import { Plus, Code2 } from 'lucide-react';
import { api } from '../services/api';

export function Challenges() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [language, setLanguage] = useState('Python');

  const fetchChallenges = () => {
    api.get('/challenges').then(setChallenges).catch(console.error);
  };

  useEffect(() => { fetchChallenges(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/challenges', { 
        title, description, difficulty, language, time_limit: 60, 
        expected_input: "test", expected_output: "test", test_cases: "test", evaluation_criteria: "test" 
      });
      setIsModalOpen(false);
      setTitle(''); setDescription('');
      fetchChallenges();
    } catch (err: any) { alert(err.message); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Coding Challenges</h1>
        <button onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#6366f1', color: '#fff', borderRadius: '8px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
          <Plus size={18} /> Add Challenge
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {challenges.map(chal => (
          <div key={chal.id} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#6366f120', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Code2 size={20} />
              </div>
              <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: chal.difficulty === 'Hard' ? '#fee2e2' : chal.difficulty === 'Medium' ? '#fef3c7' : '#d1fae5', color: chal.difficulty === 'Hard' ? '#ef4444' : chal.difficulty === 'Medium' ? '#f59e0b' : '#10b981' }}>
                {chal.difficulty}
              </span>
            </div>
            <h3 style={{ margin: 0 }}>{chal.title}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem', flex: 1 }}>{chal.description}</p>
            <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6366f1' }}>{chal.language}</div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Create Challenge</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Description</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Difficulty</label>
                  <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px' }}>
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Language</label>
                  <select value={language} onChange={e => setLanguage(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px' }}>
                    <option>Python</option><option>JavaScript</option><option>TypeScript</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#6366f1', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
