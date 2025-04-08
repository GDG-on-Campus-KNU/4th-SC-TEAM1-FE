import GuestBookIcon from '../assets/guest-book.png';
import treeMature from '../assets/mature.png';
import treeSapling from '../assets/sapling.png';
import treeSeed from '../assets/seed.png';
import treeSprout from '../assets/sprout.png';
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
};

export const TreeScene = ({ stage, onGuestbookClick }: TreeSceneProps) => {
  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full overflow-hidden">
      {/* 나무 + 방명록 아이콘을 하나의 박스로 묶고 하단 40% 위치에 정렬 */}
      <div className="absolute left-1/2 -translate-x-1/2 sm:bottom-[22%] md:bottom-[17%]">
        {/* 나무 이미지 */}
        <img
          src={treeImages[stage]}
          alt={`나무 단계: ${stage}`}
          className="z-10 w-48 sm:w-60 md:w-72"
        />

        {/* 방명록 아이콘 */}
        <button
          onClick={onGuestbookClick}
          className="animate-float absolute -right-4 -top-0 focus:outline-none"
          aria-label="방명록 열기"
        >
          <img src={GuestBookIcon} alt="방명록 아이콘" className="sm:w-[60px] md:w-[85px]" />
        </button>
      </div>
    </div>
  );
};
