import { X } from 'lucide-react';

type HelpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="relative w-full max-w-md animate-fade-in rounded-2xl bg-white p-6 shadow-xl sm:max-w-sm md:max-w-lg">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="도움말 닫기"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 제목 */}
        <h2 className="mb-4 text-center text-xl font-bold text-primary md:text-2xl">감정나무란?</h2>

        {/* 설명 본문 */}
        <div className="space-y-4 text-sm text-gray-700 md:text-base">
          <p>
            감정나무는{' '}
            <span className="font-semibold text-primary">씨앗 → 새싹 → 묘목 → 어린나무 → 성목</span>{' '}
            총 5단계로 자랍니다.
          </p>

          <p>
            <span className="font-semibold text-primary">출석</span>과{' '}
            <span className="font-semibold text-primary">일기 작성</span>을 통해 포인트를 모을 수
            있어요.
          </p>

          <p>포인트로 다음 활동을 할 수 있어요:</p>

          <ul className="list-inside list-disc space-y-1 pl-1">
            <li>
              💧 <span className="font-medium text-gray-800">물 주기</span>: 감정나무에 생기를
              불어넣어요.
            </li>
            <li>
              ☀️ <span className="font-medium text-gray-800">햇빛 주기</span>: 따뜻한 에너지를 줘요.
            </li>
            <li>
              🌿 <span className="font-medium text-gray-800">영양분 주기</span>: 튼튼하게 자라도록
              도와줘요.
            </li>
          </ul>

          <p>
            활동을 통해 감정나무는{' '}
            <span className="font-semibold text-primary">더 빠르게 성장</span>해요.
          </p>
        </div>
      </div>
    </div>
  );
};
