
import React, { useState, useEffect } from 'react';
import { Idea } from '../types';

interface IdeaFormProps {
  idea: Idea | null;
  onSave: (idea: Omit<Idea, 'id'>) => void;
  onCancel: () => void;
}

const IdeaForm: React.FC<IdeaFormProps> = ({ idea, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Idea['status']>('New');
  const [potential, setPotential] = useState<Idea['potential']>('Medium');

  useEffect(() => {
    if (idea) {
      setTitle(idea.title);
      setDescription(idea.description);
      setStatus(idea.status);
      setPotential(idea.potential);
    } else {
      setTitle('');
      setDescription('');
      setStatus('New');
      setPotential('Medium');
    }
  }, [idea]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, status, potential });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
      <div>
        <label htmlFor="ideaTitle" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
        <input id="ideaTitle" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
       <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
        <select id="status" value={status} onChange={e => setStatus(e.target.value as Idea['status'])} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
          <option value="New">New</option>
          <option value="Considering">Considering</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
       <div>
        <label htmlFor="potential" className="block text-sm font-medium text-gray-300 mb-1">Potential</label>
        <select id="potential" value={potential} onChange={e => setPotential(e.target.value as Idea['potential'])} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition-colors">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Save Idea</button>
      </div>
    </form>
  );
};

export default IdeaForm;
