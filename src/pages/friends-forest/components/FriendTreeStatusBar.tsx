type TreeStage = '씨앗' | '새싹' | '묘목' | '어린나무' | '성목';

export type FriendTreeStatusBarProps = {
  friendId: string;
  stage: TreeStage;
  expPercent: number;
  currentExp: number;
  maxExp: number;
};

export const FriendTreeStatusBar = ({
  friendId,
  stage,
  expPercent,
  currentExp,
  maxExp,
}: FriendTreeStatusBarProps) => {
  return (
    <div className="relative flex w-full max-w-3xl items-center justify-between gap-4 rounded-xl bg-white/80 px-4 py-2 shadow-md backdrop-blur-sm">
      {/* 1) 단계 텍스트 */}
      <div className="text-sm font-extrabold text-primary sm:text-base">
        {friendId}의 {stage}
      </div>
      {/* 2) 경험치 바 */}
      <div className="relative h-4 flex-1 rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.min(100, Math.max(0, expPercent))}%` }}
        />
      </div>
      {/* 3) 현재/총 경험치 (작은 pill 형태) */}
      <div className="absolute right-4 flex items-center px-2 py-[2px] text-[10px] font-semibold text-gray-700">
        {currentExp} / {maxExp}
      </div>
    </div>
  );
};
