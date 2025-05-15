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

const stats = {
  sun: { cost: 15, exp: 20 },
  water: { cost: 10, exp: 10 },
  nutrient: { cost: 20, exp: 30 },
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

      {/* Care 버튼들 */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-xl bg-white/80 p-2 shadow-md backdrop-blur-md sm:bottom-6 md:bottom-10">
        {/* 햇빛 주기 */}
        <button
          onClick={onSunClick}
          disabled={disabled}
          className="relative flex w-16 flex-col items-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <img src={sunIcon} alt="햇빛 주기" className="mx-auto h-8 w-8 sm:h-10 sm:w-10" />
          <div className="absolute right-0 top-7 flex flex-col items-end space-y-0.5">
            <span className="rounded bg-white/80 px-1 text-[10px] font-semibold text-red-500">
              -{stats.sun.cost}P
            </span>
            <span className="rounded bg-white/80 px-1 text-[10px] font-semibold text-green-500">
              +{stats.sun.exp}XP
            </span>
          </div>
          <span className="mt-6 text-xs text-gray-700">햇빛 주기</span>
        </button>

        {/* 물 주기 */}
        <button
          onClick={onWaterClick}
          disabled={disabled}
          className="relative flex w-16 flex-col items-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <img src={waterIcon} alt="물 주기" className="mx-auto h-8 w-8 sm:h-10 sm:w-10" />
          <div className="absolute right-0 top-7 flex flex-col items-end space-y-0.5">
            <span className="rounded bg-white/80 px-1 text-[10px] font-semibold text-red-500">
              -{stats.water.cost}P
            </span>
            <span className="rounded bg-white/80 px-1 text-[10px] font-semibold text-green-500">
              +{stats.water.exp}XP
            </span>
          </div>
          <span className="mt-6 text-xs text-gray-700">물 주기</span>
        </button>

        {/* 영양분 주기 */}
        <button
          onClick={onNutrientClick}
          disabled={disabled}
          className="relative flex w-16 flex-col items-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <img src={nutrientIcon} alt="영양분 주기" className="mx-auto h-8 w-8 sm:h-10 sm:w-10" />
          <div className="absolute right-0 top-7 flex flex-col items-end space-y-0.5">
            <span className="rounded bg-white/80 px-1 text-[10px] font-semibold text-red-500">
              -{stats.nutrient.cost}P
            </span>
            <span className="rounded bg-white/80 px-1 text-[10px] font-semibold text-green-500">
              +{stats.nutrient.exp}XP
            </span>
          </div>
          <span className="mt-6 text-xs text-gray-700">영양분 주기</span>
        </button>
      </div>
    </div>
  );
};
