
import React, { useState } from 'react';
// Fix: Correctly import from the now valid `types.ts` module.
import { Creator } from '../types';
import Modal from './Modal';
import CreatorForm from './CreatorForm';

interface CreatorManagerProps {
  creators: Creator[];
  setCreators: React.Dispatch<React.SetStateAction<Creator[]>>;
}

const CreatorCard: React.FC<{
  creator: Creator;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ creator, onEdit, onDelete }) => (
  <div className="flex items-center justify-between bg-slate-700 p-3 rounded-md">
    <span className="font-medium">{creator.name}</span>
    <div className="flex gap-2">
      <button onClick={onEdit} className="p-1 text-slate-400 hover:text-indigo-400 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
      </button>
      <button onClick={onDelete} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
      </button>
    </div>
  </div>
);


const CreatorManager: React.FC<CreatorManagerProps> = ({ creators, setCreators }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);

  const handleOpenModal = (creator: Creator | null = null) => {
    setEditingCreator(creator);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCreator(null);
  };

  const handleSave = (name: string) => {
    if (editingCreator) {
      setCreators(creators.map(c => c.id === editingCreator.id ? { ...c, name } : c));
    } else {
      const newCreator: Creator = { id: Date.now().toString(), name };
      setCreators([...creators, newCreator]);
    }
    handleCloseModal();
  };
  
  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this creator?')) {
        setCreators(creators.filter(c => c.id !== id));
    }
  };

  return (
    <>
      <div className="bg-slate-800 p-4 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-200">Manage Creators</h3>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            Add Creator
          </button>
        </div>
        <div className="space-y-2">
          {creators.length > 0 ? (
            creators.map(creator => (
                <CreatorCard 
                    key={creator.id} 
                    creator={creator} 
                    onEdit={() => handleOpenModal(creator)} 
                    onDelete={() => handleDelete(creator.id)}
                />
            ))
          ) : (
            <p className="text-slate-400 text-center py-4">No creators yet.</p>
          )}
        </div>
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCreator ? 'Edit Creator' : 'Add Creator'}
      >
        <CreatorForm
          creator={editingCreator}
          onSave={handleSave}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default CreatorManager;
