import React from 'react';

const FilterPresets = ({ onApplyPreset }) => {
  const presets = {
    urgentTasks: {
      name: 'Urgent Tasks',
      filters: {
        status: 'open',
        urgency: 'high',
        sortBy: 'deadline',
        sortOrder: 'asc'
      }
    },
    highBudget: {
      name: 'High Budget',
      filters: {
        minBudget: '5000',
        status: 'open',
        sortBy: 'budget',
        sortOrder: 'desc'
      }
    },
    nearDeadline: {
      name: 'Near Deadline',
      filters: {
        deadlineTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'open',
        sortBy: 'deadline',
        sortOrder: 'asc'
      }
    },
    beginnerFriendly: {
      name: 'Beginner Friendly',
      filters: {
        difficulty: 'easy',
        status: 'open',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
    }
  };

  return (
    <div className="filter-presets">
      <h4>Quick Filters</h4>
      <div className="preset-buttons">
        {Object.entries(presets).map(([key, preset]) => (
          <button
            key={key}
            className="preset-btn"
            onClick={() => onApplyPreset(preset.filters)}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterPresets;