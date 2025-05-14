import { HelpCircle } from 'lucide-react';

type TreeStage = '씨앗' | '새싹' | '묘목' | '어린나무' | '성목';

type TreeStatusBarProps = {
  stage: TreeStage;
  expPercent: number;
  currentExp: number;
  maxExp: number;
  onHelpClick: () => void;
};

export const TreeStatusBar = ({
  stage,
  expPercent,
  currentExp,
  maxExp,
  onHelpClick,
}: TreeStatusBarProps) => {
  return (
    <div className="relative flex w-full max-w-3xl items-center justify-between gap-4 rounded-xl bg-white/80 px-4 py-3 shadow-md backdrop-blur-sm">
      {/* 단계 텍스트 */}
      <div className="text-sm font-extrabold text-primary sm:text-base">{stage}</div>

      {/* 경험치 바 */}
      <div className="relative h-4 flex-1 rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.min(100, Math.max(0, expPercent))}%` }}
        />
      </div>

      {/* 도움말 아이콘 */}
      <button
        onClick={onHelpClick}
        aria-label="도움말 보기"
        className="text-gray-500 transition-colors hover:text-primary"
      >
        <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* 현재 경험치/최대 경험치 표시 */}
      <div className="absolute right-14 flex items-center px-2 py-[2px] text-[10px] font-bold text-gray-700">
        {currentExp} / {maxExp}
      </div>
    </div>
  );
};
