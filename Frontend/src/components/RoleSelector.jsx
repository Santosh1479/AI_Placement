import React from 'react';
import { COLORS } from '../constants/colors';

const RoleSelector = ({ onRoleSelect }) => {
  return (
    <div className="flex justify-center mb-6">
      <button
        className="px-4 py-2 mx-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => onRoleSelect('Student')}
      >
        Student
      </button>
      <button
        className="px-4 py-2 mx-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => onRoleSelect('HOD')}
      >
        HOD
      </button>
      <button
        className="px-4 py-2 mx-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => onRoleSelect('Admin')}
      >
        Admin
      </button>
    </div>
  );
};

export default RoleSelector;