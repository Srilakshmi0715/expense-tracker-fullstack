import React, { useState, useEffect } from 'react';

const TransactionTags = ({ selectedTags, onTagsChange }) => {
  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('transactionTags') || '[]');
    setAvailableTags(saved);
  }, []);

  const addTag = () => {
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      const updated = [...availableTags, newTag.trim()];
      setAvailableTags(updated);
      localStorage.setItem('transactionTags', JSON.stringify(updated));
      setNewTag('');
    }
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
        Tags
      </label>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {availableTags.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            style={{
              padding: '0.25rem 0.75rem',
              border: `2px solid ${selectedTags.includes(tag) ? '#667eea' : '#e9ecef'}`,
              background: selectedTags.includes(tag) ? '#667eea' : 'white',
              color: selectedTags.includes(tag) ? 'white' : '#495057',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.3s ease'
            }}
          >
            {tag}
          </button>
        ))}
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add new tag..."
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          style={{
            flex: '1',
            padding: '0.5rem',
            border: '2px solid #e9ecef',
            borderRadius: '6px',
            fontSize: '0.875rem'
          }}
        />
        <button
          type="button"
          onClick={addTag}
          style={{
            padding: '0.5rem 1rem',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Add Tag
        </button>
      </div>
    </div>
  );
};

export default TransactionTags;
