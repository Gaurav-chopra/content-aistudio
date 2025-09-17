
import React, { useState, useEffect } from 'react';
// Fix: Correctly import from the now valid `types.ts` module.
import { Creator } from '../types';

interface CreatorFormProps {
  creator: Creator | null;
  onSave: (name: string) => void;
  onCancel: () => void;
}

const CreatorForm: React.FC<CreatorFormProps> = ({ creator, onSave, onCancel }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    setName(creator?.name || '');
  }, [creator]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="creatorName" className="block text-sm font-medium text-gray-300 mb-1">
          Creator Name
        </label>
        <input
          id="creatorName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default CreatorForm;
