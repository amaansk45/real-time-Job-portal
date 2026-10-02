import React from 'react';
import { FiUser, FiBriefcase, FiCheck } from 'react-icons/fi';

const RoleSelector = ({ selectedRole, onSelectRole }) => {
  const roles = [
    {
      id: 'candidate',
      title: 'Job Candidate',
      description: 'Looking to explore jobs, build a profile, and apply.',
      icon: FiUser,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'recruiter',
      title: 'Hiring Recruiter',
      description: 'Looking to post jobs, manage applicants, and hire talent.',
      icon: FiBriefcase,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      {roles.map((role) => {
        const Icon = role.icon;
        const isSelected = selectedRole === role.id;
        return (
          <div
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 relative flex flex-col justify-between ${
              isSelected
                ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              {isSelected && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                  <FiCheck className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-sm text-slate-900">{role.title}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{role.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoleSelector;
