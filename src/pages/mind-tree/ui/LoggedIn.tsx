import { useState } from 'react';

import Background from '../assets/main-background.png';
import { TreeScene } from '../components';
import { TreeStatusBar } from '../components';
import { HelpModal } from '../components';

type TreeSceneStage = 'seed' | 'sprout' | 'sapling' | 'young' | 'mature';
type TreeStage = '씨앗' | '새싹' | '묘목' | '어린나무' | '성목';

export const LoggedIn = () => {
  const [treeStage] = useState<TreeSceneStage>('mature');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const OpenGuestbook = () => {
    alert('📬 방명록 열기!');
  };

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
      {/* 상태바 */}
      <div className="mt-4 flex w-full shrink-0 justify-center px-4">
        <TreeStatusBar
          stage={stageLabelMap[treeStage]}
          expPercent={100}
          onHelpClick={() => setIsHelpOpen(true)}
        />
      </div>

      {/* 나무 씬 - 나머지 화면 꽉 채우기 */}
      <div className="relative flex flex-1 items-end justify-center">
        <TreeScene stage={treeStage} onGuestbookClick={OpenGuestbook} />
      </div>

      {/* 도움말 모달 */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};
