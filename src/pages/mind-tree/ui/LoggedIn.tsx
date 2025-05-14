import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { MyTreeStatus, getMyTreeStatus } from '../api';
import Background from '../assets/main-background.png';
import { GuestbookModal } from '../components/GuestbookModal';
import { HelpModal } from '../components/HelpModal';
import { TreeScene } from '../components/TreeScene';
import { TreeStatusBar } from '../components/TreeStatusBar';

const THRESHOLDS = [0, 100, 150, 200, 250, 300];
type TreeSceneStage = 'seed' | 'sprout' | 'sapling' | 'young' | 'mature';
type TreeStage = '씨앗' | '새싹' | '묘목' | '어린나무' | '성목';

export const LoggedIn: React.FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);

  const { data, isLoading, isError } = useQuery<MyTreeStatus, Error>({
    queryKey: ['myTreeStatus'],
    queryFn: getMyTreeStatus,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div
        className="flex h-screen flex-col items-center justify-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${Background})`, backgroundPosition: 'bottom center' }}
      >
        <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-lg font-bold text-gray-500">나무 상태를 불러오는 중...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4 text-center text-red-500">
        나무 상태를 불러오지 못했습니다. 새로고침 해주세요.
      </div>
    );
  }

  const level = Math.min(data.level, THRESHOLDS.length - 1);
  const exp = data.experience;
  const currentExp = data.experience;
  const maxExp = THRESHOLDS[level];
  const expPercent = Math.min(100, Math.floor((exp / maxExp) * 100));

  const sceneKeys: TreeSceneStage[] = ['seed', 'sprout', 'sapling', 'young', 'mature'];
  const stageKey = sceneKeys[level - 1] || 'seed';

  const stageLabelMap: Record<TreeSceneStage, TreeStage> = {
    seed: '씨앗',
    sprout: '새싹',
    sapling: '묘목',
    young: '어린나무',
    mature: '성목',
  };

  const stageLabel = stageLabelMap[stageKey];

  return (
    <div
      className="flex w-full flex-col bg-cover bg-no-repeat sm:h-[calc(100vh-53px)] md:h-[calc(100vh-57px)]"
      style={{ backgroundImage: `url(${Background})`, backgroundPosition: 'bottom center' }}
    >
      <div className="mt-4 flex w-full shrink-0 justify-center px-4">
        <TreeStatusBar
          stage={stageLabel}
          expPercent={expPercent}
          currentExp={currentExp}
          maxExp={maxExp}
          onHelpClick={() => setIsHelpOpen(true)}
        />
      </div>

      <div className="relative flex flex-1 items-end justify-center">
        <TreeScene stage={stageKey} onGuestbookClick={() => setIsGuestbookOpen(true)} />
      </div>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <GuestbookModal isOpen={isGuestbookOpen} onClose={() => setIsGuestbookOpen(false)} />
    </div>
  );
};
