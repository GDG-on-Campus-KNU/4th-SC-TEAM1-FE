import { useState } from 'react';

import Background from '../assets/main-background.png';
import { TreeScene } from '../components';

export const LoggedIn = () => {
  const [treeStage] = useState<'seed' | 'sprout' | 'sapling' | 'young' | 'mature'>('mature');

  const handleGuestbookOpen = () => {
    alert('📬 방명록 열기!');
  };

  return (
    <div
      className="flex min-h-[calc(100vh-65px)] w-full flex-col items-center justify-start bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundPosition: 'bottom center',
      }}
    >
      <TreeScene stage={treeStage} onGuestbookClick={handleGuestbookOpen} />
    </div>
  );
};
