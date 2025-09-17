
import React, { useState } from 'react';
import { Idea } from '../types';
import Modal from './Modal';
import IdeaForm from './IdeaForm';

interface IdeaManagerProps {
  ideas: Idea[];
  setIdeas: React.Dispatch<React.SetStateAction<Idea[]>>;
}

const IdeaCard: React.FC<{
  idea: Idea;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ idea, onEdit, onDelete }) => (
  <div className="bg-slate-800 p-4 rounded-lg shadow-md space-y-3">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xl font-bold text-indigo-400">{idea.title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-400 mt-2">
            <p><span className="font-semibold text-slate-300">Status:</span> {idea.status}</p>
            <p><span className="font-semibold text-slate-300">Potential:</span> {idea.potential}</p>
        </div>
      </div>
      <div className="flex-shrink-0 flex gap-2 ml-4">
        <button onClick={onEdit} className="p-1 text-slate-400 hover:text-indigo-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
        </button>
        <button onClick={onDelete} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
    {idea.description && <p className="text-slate-300 whitespace-pre-wrap">{idea.description}</p>}
  </div>
);


const IdeaManager: React.FC<IdeaManagerProps> = ({ ideas, setIdeas }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);

  const handleOpenModal = (idea: Idea | null = null) => {
    setEditingIdea(idea);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIdea(null);
  };

  const handleSave = (ideaData: Omit<Idea, 'id'>) => {
    if (editingIdea) {
      setIdeas(ideas.map(i => i.id === editingIdea.id ? { ...i, ...ideaData } : i));
    } else {
      const newIdea: Idea = { id: Date.now().toString(), ...ideaData };
      setIdeas([...ideas, newIdea]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this video idea?')) {
      setIdeas(ideas.filter(i => i.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Add Video Idea
        </button>
      </div>
      
      <div className="space-y-4">
        {ideas.length > 0 ? (
          ideas.map(idea => (
            <IdeaCard 
                key={idea.id} 
                idea={idea} 
                onEdit={() => handleOpenModal(idea)}
                onDelete={() => handleDelete(idea.id)}
            />
          ))
        ) : (
          <p className="text-slate-400 text-center py-10 text-lg">No video ideas yet. Click 'Add Video Idea' to get started.</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingIdea ? 'Edit Video Idea' : 'Add New Video Idea'}
      >
        <IdeaForm
          idea={editingIdea}
          onSave={handleSave}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default IdeaManager;
