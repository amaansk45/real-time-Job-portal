import React, { useState } from 'react';
import { FiTag, FiPlus, FiX } from 'react-icons/fi';

const SkillsManager = ({ skills = [], onSkillsChange }) => {
  const [skillInput, setSkillInput] = useState('');

  const popularSkills = [
    'Python',
    'Django',
    'React',
    'JavaScript',
    'TypeScript',
    'REST APIs',
    'PostgreSQL',
    'Docker',
    'Tailwind CSS',
    'Node.js',
    'AWS',
    'Git',
  ];

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || skillInput).trim();
    if (!trimmed) return;

    if (!skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...skills, trimmed];
      onSkillsChange(updated);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    onSkillsChange(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FiTag className="text-indigo-600 w-5 h-5" />
          Technical Skills & Proficiencies
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Add skills that highlight your technical strengths to recruiter search algorithms
        </p>
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a skill (e.g. Python, React, PostgreSQL)..."
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
        />
        <button
          type="button"
          onClick={() => handleAddSkill()}
          className="gradient-btn px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Active Skills Chips */}
      <div className="flex flex-wrap gap-2 pt-1 min-h-[40px]">
        {skills.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No skills added yet.</p>
        ) : (
          skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs group hover:bg-indigo-100 transition-colors"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-indigo-400 hover:text-rose-600 focus:outline-none p-0.5 rounded-full"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Suggestions */}
      <div className="pt-2 border-t border-slate-100">
        <span className="text-xs font-medium text-slate-500 mr-2">Suggestions:</span>
        <div className="inline-flex flex-wrap gap-1.5 mt-1">
          {popularSkills
            .filter((s) => !skills.some((existing) => existing.toLowerCase() === s.toLowerCase()))
            .slice(0, 8)
            .map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAddSkill(suggestion)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                + {suggestion}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsManager;
