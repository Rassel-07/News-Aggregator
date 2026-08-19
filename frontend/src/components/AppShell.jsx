import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import Footer from './Footer';
import InactivityBanner from './InactivityBanner';
import StoryClusterModal from './StoryClusterModal';
import { UserContext } from '../context/userContext';

export default function AppShell() {
  const { activeStoryModal, setActiveStoryModal } = useContext(UserContext);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <InactivityBanner />
      {activeStoryModal && (
        <StoryClusterModal
          article={activeStoryModal}
          onClose={() => setActiveStoryModal(null)}
        />
      )}
    </div>
  );
}
