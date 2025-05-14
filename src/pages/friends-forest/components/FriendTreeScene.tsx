import GuestBookIcon from '../../mind-tree/assets/guest-book.png';
import treeMature from '../../mind-tree/assets/mature.png';
import treeSapling from '../../mind-tree/assets/sapling.png';
import treeSeed from '../../mind-tree/assets/seed.png';
import treeSprout from '../../mind-tree/assets/sprout.png';
import treeYoung from '../../mind-tree/assets/young.png';

const treeImages = {
  seed: treeSeed,
  sprout: treeSprout,
  sapling: treeSapling,
  young: treeYoung,
  mature: treeMature,
} as const;

type TreeSceneProps = {
  stage: keyof typeof treeImages;
};

export const FriendTreeScene = ({ stage }: TreeSceneProps) => {
  return (
    <div className="relative min-h-full w-full overflow-hidden">
      <div className="absolute left-1/2 -translate-x-1/2 sm:bottom-[22%] md:bottom-[17%]">
        <img
          src={treeImages[stage]}
          alt={`나무 단계: ${stage}`}
          className="z-10 w-48 sm:w-60 md:w-72"
        />
        <button
          className="absolute -right-4 -top-0 animate-float focus:outline-none"
          aria-label="방명록 열기"
        >
          <img src={GuestBookIcon} alt="방명록 아이콘" className="sm:w-[60px] md:w-[85px]" />
        </button>
      </div>
    </div>
  );
};
