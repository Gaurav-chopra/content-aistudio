
import React, { useState } from 'react';
import { Creator, Channel, Video, ChannelToStart, Idea } from './types';
import CreatorManager from './components/CreatorManager';
import ChannelManager from './components/ChannelManager';
import VideoManager from './components/VideoManager';
import ChannelToStartManager from './components/ChannelToStartManager';
import IdeaManager from './components/IdeaManager';

type Tab = 'creators' | 'channels' | 'videos' | 'channelsToStart' | 'ideas';

const App: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [channelsToStart, setChannelsToStart] = useState<ChannelToStart[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('channels');

  const renderContent = () => {
    switch (activeTab) {
      case 'creators':
        return <CreatorManager creators={creators} setCreators={setCreators} />;
      case 'channels':
        return <ChannelManager channels={channels} setChannels={setChannels} />;
      case 'videos':
        return <VideoManager videos={videos} setVideos={setVideos} channels={channels} creators={creators} />;
      case 'channelsToStart':
        return <ChannelToStartManager channelsToStart={channelsToStart} setChannelsToStart={setChannelsToStart} />;
      case 'ideas':
        return <IdeaManager ideas={ideas} setIdeas={setIdeas} />;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ tabName: Tab; label: string }> = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
        activeTab === tabName
          ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-400'
          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans">
      <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-40">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                 <h1 className="text-2xl font-bold text-white">YouTube Strategy Hub</h1>
            </div>
        </nav>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
            <div className="border-b border-slate-700 flex space-x-2">
                <TabButton tabName="creators" label="Creators" />
                <TabButton tabName="channels" label="Your Channels" />
                <TabButton tabName="videos" label="Videos" />
                <TabButton tabName="channelsToStart" label="New Channel Ideas" />
                <TabButton tabName="ideas" label="Video Ideas" />
            </div>
        </div>
        
        <div className="bg-slate-800/50 p-6 rounded-b-lg rounded-r-lg">
             {renderContent()}
        </div>

      </main>

      <footer className="text-center py-4 mt-8 text-slate-500 text-sm">
        <p>Powered by Gemini</p>
      </footer>
    </div>
  );
};

export default App;