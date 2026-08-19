import React, { useState, useContext } from 'react';
import { FiCheck, FiCompass } from 'react-icons/fi';
import { UserContext } from '../context/userContext';

const AVAILABLE_TOPICS = [
  { id: 'Technology', label: 'Technology', icon: '💻' },
  { id: 'AI', label: 'AI & Machine Learning', icon: '🤖' },
  { id: 'Science', label: 'Science', icon: '🔬' },
  { id: 'Business', label: 'Business & Economy', icon: '📈' },
  { id: 'World', label: 'World News', icon: '🌍' },
  { id: 'India', label: 'India', icon: '🇮🇳' },
  { id: 'Politics', label: 'Politics', icon: '🏛️' },
  { id: 'Sports', label: 'Sports', icon: '⚽' },
  { id: 'Entertainment', label: 'Entertainment', icon: '🎬' },
  { id: 'Gaming', label: 'Gaming', icon: '🎮' },
  { id: 'Startups', label: 'Startups & Tech', icon: '🚀' },
  { id: 'Health', label: 'Health & Medicine', icon: '🩺' },
  { id: 'Climate', label: 'Climate & Earth', icon: '🌱' },
  { id: 'Space', label: 'Space Exploration', icon: '🌌' }
];

export default function OnboardingModal({ isOpen, onClose }) {
  const { currentUser, updatePreferences } = useContext(UserContext);
  const initialSelected = currentUser?.preferences?.categories || ['Technology', 'AI', 'World', 'Science', 'Business'];
  const [selectedTopics, setSelectedTopics] = useState(initialSelected);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const toggleTopic = (topicId) => {
    if (selectedTopics.includes(topicId)) {
      if (selectedTopics.length <= 2) return; // Maintain minimum 2 topics
      setSelectedTopics(selectedTopics.filter(t => t !== topicId));
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await updatePreferences({ categories: selectedTopics }, true);
    setSaving(false);
    if (onClose) onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-subtle)',
              color: 'var(--accent-primary)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 1rem auto'
            }}
          >
            <FiCompass size={24} />
          </div>

          <h2 className="serif-headline" style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>
            Personalize Your News Feed
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Select topics you care about to tailor your discovery experience.
          </p>
        </div>

        {/* Topics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '0.75rem',
            marginBottom: '2rem'
          }}
        >
          {AVAILABLE_TOPICS.map(topic => {
            const isSelected = selectedTopics.includes(topic.id);
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => toggleTopic(topic.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--bg-subtle)',
                  color: isSelected ? 'var(--accent-text)' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{topic.icon}</span>
                  <span>{topic.label}</span>
                </span>
                {isSelected && <FiCheck size={16} style={{ color: 'var(--accent-primary)' }} />}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {selectedTopics.length} topics selected
          </span>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
            style={{ padding: '0.75rem 2rem' }}
          >
            {saving ? 'Saving Preferences...' : 'Save & Explore Stories'}
          </button>
        </div>
      </div>
    </div>
  );
}
