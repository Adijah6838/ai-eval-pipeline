import { useState, useEffect } from 'react';
import { Plus, User } from 'lucide-react';
import { api } from '../services/api';

export function Developers() {
  const [developers, setDevelopers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [skillLevel, setSkillLevel] = useState('Mid');

  const fetchDevelopers = () => {
    api.get('/developers').then(setDevelopers).catch(console.error);
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/developers', { full_name: fullName, email, skill_level: skillLevel });
      setIsModalOpen(false);
      setFullName(''); setEmail(''); setSkillLevel('Mid');
      fetchDevelopers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Developer Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#6366f1', color: '#fff', borderRadius: '8px', fontWeight: 500, border: 'none', cursor: 'pointer' }}
        >
          <Plus size={18} /> Add Developer
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px', fontWeight: 600, color: '#64748b' }}>Name</th>
              <th style={{ padding: '16px', fontWeight: 600, color: '#64748b' }}>Email</th>
              <th style={{ padding: '16px', fontWeight: 600, color: '#64748b' }}>Skill Level</th>
              <th style={{ padding: '16px', fontWeight: 600, color: '#64748b' }}>Registered</th>
            </tr>
          </thead>
          <tbody>
            {developers.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No developers found.</td>
              </tr>
            ) : (
              developers.map(dev => (
                <tr key={dev.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#6366f120', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={16} />
                      </div>
                      <span style={{ fontWeight: 500 }}>{dev.full_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#64748b' }}>{dev.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#f3f4f6', color: '#374151' }}>
                      {dev.skill_level}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: '#64748b', fontSize: '0.875rem' }}>
                    {new Date(dev.registered_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Add New Developer</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
                <input required value={fullName} onChange={e => setFullName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Skill Level</label>
                <select value={skillLevel} onChange={e => setSkillLevel(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px' }}>
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                </select>
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
