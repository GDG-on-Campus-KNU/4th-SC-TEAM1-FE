import React from 'react';

import GuestBookIcon from '../assets/guest-book.png';
import treeMature from '../assets/mature.png';
import treeSapling from '../assets/sapling.png';
import treeSeed from '../assets/seed.png';
import treeSprout from '../assets/sprout.png';
import nutrientIcon from '../assets/treecare-nutrients.png';
import sunIcon from '../assets/treecare-sun.png';
import waterIcon from '../assets/treecare-water.png';
import treeYoung from '../assets/young.png';

const treeImages = {
  seed: treeSeed,
  sprout: treeSprout,
  sapling: treeSapling,
  young: treeYoung,
  mature: treeMature,
} as const;

type TreeSceneProps = {
  stage: keyof typeof treeImages;
  onGuestbookClick: () => void;
  onSunClick: () => void;
  onWaterClick: () => void;
  onNutrientClick: () => void;
  disabled?: boolean;
};

export const TreeScene: React.FC<TreeSceneProps> = ({
  stage,
  onGuestbookClick,
  onSunClick,
  onWaterClick,
  onNutrientClick,
  disabled = false,
}) => {
  return (
    <div className="relative min-h-full w-full overflow-hidden">
      {/* Tree 이미지 & 방명록 버튼 */}
      <div className="absolute left-1/2 -translate-x-1/2 sm:bottom-[22%] md:bottom-[17%]">
        <img
          src={treeImages[stage]}
          alt={`나무 단계: ${stage}`}
          className="z-10 w-48 sm:w-60 md:w-72"
        />
        <button
          onClick={onGuestbookClick}
          className="absolute -right-4 -top-0 animate-float focus:outline-none"
          aria-label="방명록 열기"
        >
          <img src={GuestBookIcon} alt="방명록 아이콘" className="sm:w-[60px] md:w-[85px]" />
        </button>
      </div>

      {/* Care 버튼들 (햇빛, 물, 영양분) */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-xl bg-white/80 p-2 shadow-md backdrop-blur-md sm:bottom-6 md:bottom-10">
        <button
          onClick={onSunClick}
          disabled={disabled}
          className="flex w-16 flex-col items-center gap-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <img src={sunIcon} alt="햇빛 주기" className="h-8 w-8 sm:h-10 sm:w-10" />
          <span className="text-xs text-gray-700">햇빛 주기</span>
        </button>

        <button
          onClick={onWaterClick}
          disabled={disabled}
          className="flex w-16 flex-col items-center gap-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <img src={waterIcon} alt="물 주기" className="h-8 w-8 sm:h-10 sm:w-10" />
          <span className="text-xs text-gray-700">물 주기</span>
        </button>

        <button
          onClick={onNutrientClick}
          disabled={disabled}
          className="flex w-16 flex-col items-center gap-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <img src={nutrientIcon} alt="영양분 주기" className="h-8 w-8 sm:h-10 sm:w-10" />
          <span className="text-xs text-gray-700">영양분 주기</span>
        </button>
      </div>
    </div>
  );
};
