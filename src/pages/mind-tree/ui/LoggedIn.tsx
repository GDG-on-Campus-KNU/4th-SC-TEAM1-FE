import { useState } from 'react';

import Background from '../assets/main-background.png';
import { TreeScene } from '../components';
import { TreeStatusBar } from '../components';
import { HelpModal } from '../components';
import { GuestbookModal } from '../components';

type TreeSceneStage = 'seed' | 'sprout' | 'sapling' | 'young' | 'mature';
type TreeStage = '씨앗' | '새싹' | '묘목' | '어린나무' | '성목';

export const LoggedIn = () => {
  const [treeStage] = useState<TreeSceneStage>('mature');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);

  const stageLabelMap: Record<TreeSceneStage, TreeStage> = {
    seed: '씨앗',
    sprout: '새싹',
    sapling: '묘목',
    young: '어린나무',
    mature: '성목',
  };

  return (
    <div
      className="flex h-[calc(100dvh-65px)] w-full flex-col bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundPosition: 'bottom center',
      }}
    >
      <div className="mt-4 flex w-full shrink-0 justify-center px-4">
        <TreeStatusBar
          stage={stageLabelMap[treeStage]}
          expPercent={100}
          onHelpClick={() => setIsHelpOpen(true)}
        />
      </div>

      <div className="relative flex flex-1 items-end justify-center">
        <TreeScene stage={treeStage} onGuestbookClick={() => setIsGuestbookOpen(true)} />
      </div>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <GuestbookModal isOpen={isGuestbookOpen} onClose={() => setIsGuestbookOpen(false)} />
    </div>
  );
};
