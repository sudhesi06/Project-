import React, { useState } from 'react';
import { 
  BookOpen, Plus, Edit2, Trash2, Calendar, CheckSquare, 
  Square, ChevronDown, ChevronUp, Layers, AlertCircle, X 
} from 'lucide-react';

export function Subjects({ 
  subjects, 
  onAddSubject, 
  onUpdateSubject, 
  onDeleteSubject,
  onAddTopic,
  onToggleTopic,
  onDeleteTopic 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    difficulty: 'Medium',
    exam_date: '',
    color: '#6366F1'
  });

  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const openAddModal = () => {
    setEditingSubject(null);
    setFormData({
      name: '',
      code: '',
      difficulty: 'Medium',
      exam_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: '#6366F1'
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (sub) => {
    setEditingSubject(sub);
    setFormData({
      name: sub.name,
      code: sub.code || '',
      difficulty: sub.difficulty,
      exam_date: sub.exam_date,
      color: sub.color || '#6366F1'
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Subject name is required.');
      return;
    }
    if (!formData.exam_date) {
      setErrorMsg('Exam date is required.');
      return;
    }

    if (editingSubject) {
      onUpdateSubject(editingSubject.id, formData);
    } else {
      onAddSubject(formData);
    }
    setIsModalOpen(false);
  };

  const handleAddTopicSubmit = (subjectId) => {
    if (!newTopicTitle.trim()) return;
    onAddTopic(subjectId, { title: newTopicTitle, estimated_hours: 2.0 });
    setNewTopicTitle('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>Subject Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage course subjects, topics, exam dates, and chapter completion status.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid-2">
        {subjects.map((subject) => {
          const isExpanded = expandedSubjectId === subject.id;
          const completedTopicsCount = subject.topics.filter(t => t.is_completed).length;

          return (
            <div key={subject.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Subject Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                  <div style={{
                    width: '14px', height: '48px', borderRadius: '6px',
                    backgroundColor: subject.color || '#6366F1'
                  }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>{subject.name}</h3>
                      {subject.code && (
                        <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                          {subject.code}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={14} color="#A5B4FC" />
                        <span>Exam: {subject.exam_date}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions & Badge */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span className={`badge badge-${subject.difficulty.toLowerCase()}`}>
                    {subject.difficulty}
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(subject)} title="Edit Subject">
                      <Edit2 size={13} />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => onDeleteSubject(subject.id)} title="Delete Subject">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Percentage */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Syllabus Completion</span>
                  <span style={{ color: '#A5B4FC' }}>{subject.progress_pct}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${subject.progress_pct}%` }} />
                </div>
              </div>

              {/* Topics / Chapters Section Header */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <div 
                  onClick={() => setExpandedSubjectId(isExpanded ? null : subject.id)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    <Layers size={16} color="#818CF8" />
                    <span>Chapters / Topics ({completedTopicsCount}/{subject.topics.length})</span>
                  </div>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>

                {/* Expanded Topics List */}
                {isExpanded && (
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {subject.topics.map((topic) => (
                      <div key={topic.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem', borderRadius: '6px',
                        background: topic.is_completed ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-color)'
                      }}>
                        <div 
                          onClick={() => onToggleTopic(topic.id, !topic.is_completed)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', flex: 1 }}
                        >
                          <span style={{ color: topic.is_completed ? '#34D399' : 'var(--text-muted)' }}>
                            {topic.is_completed ? <CheckSquare size={16} /> : <Square size={16} />}
                          </span>
                          <span style={{
                            fontSize: '0.85rem',
                            color: topic.is_completed ? 'var(--text-muted)' : 'var(--text-primary)',
                            textDecoration: topic.is_completed ? 'line-through' : 'none'
                          }}>
                            {topic.title}
                          </span>
                        </div>
                        <button 
                          onClick={() => onDeleteTopic(topic.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}

                    {/* Add Topic Input Form */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Add new topic/chapter title..."
                        value={expandedSubjectId === subject.id ? newTopicTitle : ''}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                        className="form-input"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddTopicSubmit(subject.id);
                        }}
                      />
                      <button className="btn btn-primary btn-sm" onClick={() => handleAddTopicSubmit(subject.id)}>
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Subject Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {errorMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244, 63, 94, 0.15)', color: '#FB7185', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Subject Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Operating Systems"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Subject Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. CS304"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Difficulty Level</label>
                  <select
                    className="form-select"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Exam Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.exam_date}
                    onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Theme Color</label>
                  <input
                    type="color"
                    className="form-input"
                    style={{ height: '42px', padding: '2px 4px', cursor: 'pointer' }}
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSubject ? 'Save Changes' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
