// src/components/FriendTree/FriendTree.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Background from '../../mind-tree/assets/main-background.png';
import { FriendTreeStatus, getFriendTreeStatus } from '../apis';
import { FriendGuestBookModal } from './FriendGuestBookModal';
import { FriendTreeScene } from './FriendTreeScene';
import { FriendTreeStatusBar } from './FriendTreeStatusBar';

type TreeSceneStage = 'seed' | 'sprout' | 'sapling' | 'young' | 'mature';
type TreeStage = '씨앗' | '새싹' | '묘목' | '어린나무' | '성목';

export const FriendTree = () => {
  const { friendId: rawFriendId } = useParams<{ friendId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<FriendTreeStatus | null>(null);
  const [isGuestbookOpen, setGuestbookOpen] = useState(false);

  useEffect(() => {
    if (!rawFriendId) {
      navigate('/forests');
    }
  }, [rawFriendId, navigate]);

  useEffect(() => {
    if (!rawFriendId) return;

    (async () => {
      const start = Date.now();
      try {
        const data = await getFriendTreeStatus(rawFriendId);
        setStatus(data);
      } catch {
        navigate('/forests');
        return;
      } finally {
        const elapsed = Date.now() - start;
        const remain = 1000 - elapsed;
        if (remain > 0) {
          setTimeout(() => setLoading(false), remain);
        } else {
          setLoading(false);
        }
      }
    })();
  }, [rawFriendId, navigate]);

  if (!rawFriendId) return null;

  if (loading) {
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

  if (!status) return null;

  const MAX_LEVEL = 5;
  const THRESHOLDS = [0, 100, 150, 200, 250, 300];

  const level = Math.min(status.level, MAX_LEVEL);
  const exp = status.experience;
  const maxExp = THRESHOLDS[level];
  const expPercent = Math.min(100, Math.floor((exp / maxExp) * 100));

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
    <>
      <div
        className="flex w-full flex-col bg-cover bg-no-repeat sm:h-[calc(100vh-53px)] md:h-[calc(100vh-57px)]"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundPosition: 'bottom center',
        }}
      >
        <div className="mt-14 flex w-full shrink-0 justify-center px-4 md:mt-4">
          <FriendTreeStatusBar
            friendId={rawFriendId}
            stage={stageLabel}
            expPercent={expPercent}
            currentExp={exp}
            maxExp={maxExp}
          />
        </div>

        <div className="relative flex flex-1 items-end justify-center">
          <FriendTreeScene stage={sceneStage} onOpenGuestbook={() => setGuestbookOpen(true)} />
        </div>
      </div>
      {isGuestbookOpen && (
        <FriendGuestBookModal friendId={rawFriendId} onClose={() => setGuestbookOpen(false)} />
      )}
    </>
  );
};
