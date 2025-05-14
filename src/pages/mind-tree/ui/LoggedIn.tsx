import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { GrowthButtonType, getMyTreeStatus, growTree } from '../apis';
import Background from '../assets/main-background.png';
import { GuestBookModal } from '../components';
import { HelpModal } from '../components/HelpModal';
import { TreeScene } from '../components/TreeScene';
import { TreeStatusBar } from '../components/TreeStatusBar';

type TreeSceneStage = 'seed' | 'sprout' | 'sapling' | 'young' | 'mature';
type TreeStage = '씨앗' | '새싹' | '묘목' | '어린나무' | '성목';

interface TreeStatus {
  level: number;
  experience: number;
}

export const LoggedIn: React.FC = () => {
  const queryClient = useQueryClient();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);

  const {
    data: tree,
    isLoading,
    isError,
  } = useQuery<TreeStatus, Error>({
    queryKey: ['myTree'],
    queryFn: getMyTreeStatus,
    staleTime: 60_000,
  });

  const growMutation = useMutation<void, Error, GrowthButtonType>({
    mutationFn: (btn) => growTree(btn),
    onSuccess: (_data, btn) => {
      queryClient.invalidateQueries({ queryKey: ['myTree'] });
      queryClient.invalidateQueries({ queryKey: ['points'] });
      let msg = '';
      switch (btn) {
        case 'SUN':
          msg = '✨ 따스한 햇살이 나뭇잎 사이로 스며들었어요!';
          break;
        case 'WATER':
          msg = '💧 촉촉한 물방울이 뿌리 깊이 스며들었어요!';
          break;
        case 'NUTRIENT':
          msg = '🌱 영양분 가득한 선물이 나무를 더욱 튼튼하게 해주었어요!';
          break;
      }
      toast.success(msg);
    },
  });

  if (isLoading) {
    return (
      <div
        className="relative flex w-full flex-col bg-cover bg-no-repeat sm:h-[calc(100vh-53px)] md:h-[calc(100vh-57px)]"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundPosition: 'bottom center',
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="mb-4 h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <div className="animate-pulse text-xl font-extrabold text-white">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (isError || !tree) {
    return (
      <div
        className="flex flex-1 items-center justify-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundPosition: 'bottom center',
        }}
      >
        <span className="font-semibold text-red-500">트리 정보를 불러오지 못했습니다.</span>
      </div>
    );
  }

  const MAX_LEVEL = 5;
  const THRESHOLDS = [0, 100, 150, 200, 250, 300];
  const level = Math.min(tree.level, MAX_LEVEL);
  const currentExp = tree.experience;
  const maxExp = THRESHOLDS[level];
  const expPercent = Math.floor((currentExp / maxExp) * 100);

  const sceneKeys: TreeSceneStage[] = ['seed', 'sprout', 'sapling', 'young', 'mature'];
  const stageLabelMap: Record<TreeSceneStage, TreeStage> = {
    seed: '씨앗',
    sprout: '새싹',
    sapling: '묘목',
    young: '어린나무',
    mature: '성목',
  };
  const sceneStage = sceneKeys[level - 1];
  const stageLabel = stageLabelMap[sceneStage];

  return (
    <div
      className="flex w-full flex-col bg-cover bg-no-repeat sm:h-[calc(100vh-53px)] md:h-[calc(100vh-57px)]"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundPosition: 'bottom center',
      }}
    >
      {/* 상태바 */}
      <div className="mt-4 flex w-full shrink-0 justify-center px-4">
        <TreeStatusBar
          stage={stageLabel}
          expPercent={expPercent}
          currentExp={currentExp}
          maxExp={maxExp}
          onHelpClick={() => setIsHelpOpen(true)}
        />
      </div>

      {/* 트리 씬 + 성장은 세 버튼으로 */}
      <div className="relative flex flex-1 items-end justify-center">
        <TreeScene
          stage={sceneStage}
          onGuestbookClick={() => setIsGuestbookOpen(true)}
          onSunClick={() => growMutation.mutate('SUN')}
          onWaterClick={() => growMutation.mutate('WATER')}
          onNutrientClick={() => growMutation.mutate('NUTRIENT')}
          disabled={growMutation.isPending}
        />
      </div>

      {/* 모달 */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <GuestBookModal isOpen={isGuestbookOpen} onClose={() => setIsGuestbookOpen(false)} />
    </div>
  );
};
