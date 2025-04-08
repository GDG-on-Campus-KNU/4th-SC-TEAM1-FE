import { X } from 'lucide-react';

type GuestbookModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const dummyComments = [
  {
    id: 1,
    name: '도기헌',
    date: '2025.03.25 14:12',
    content: '힘들 땐 잠깐 쉬어가도 괜찮아. 나 여기 있어 :)',
  },
  {
    id: 2,
    name: '오성식',
    date: '2025.03.24 09:31',
    content: '오늘도 잘 버텼다! 내일은 더 가볍게 시작하자 ☀️',
  },
  {
    id: 3,
    name: '최기영',
    date: '2025.03.22 20:04',
    content: '네가 얼마나 애쓰는지 나는 잘 알아. 응원해 💚',
  },
  {
    id: 4,
    name: '김마음',
    date: '2025.03.22 18:20',
    content: '요즘 너 진짜 멋있어. 스스로를 많이 칭찬해줘!',
  },
  {
    id: 5,
    name: '정토닥',
    date: '2025.03.21 08:55',
    content: '매일매일 조금씩 나아가는 너, 정말 대단해. 항상 응원할게 💌',
  },
];

export const GuestbookModal = ({ isOpen, onClose }: GuestbookModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="relative w-full max-w-md animate-fade-in rounded-2xl bg-white p-6 shadow-xl sm:max-w-sm md:max-w-lg">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 제목 */}
        <h2 className="mb-4 text-center text-xl font-bold text-primary md:text-2xl">방명록</h2>

        {/* 댓글 리스트 */}
        <div className="scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent max-h-[300px] space-y-4 overflow-y-auto pr-[2px]">
          {dummyComments.map((item) => (
            <div
              key={item.id}
              className="relative rounded-lg border border-gray-100 bg-softGray p-4"
            >
              {/* 삭제 아이콘 */}
              <button
                className="absolute right-2 top-2 text-gray-300 transition-colors hover:text-red-400"
                aria-label="댓글 삭제"
                onClick={() => {
                  alert('🗑️ 삭제 기능은 아직 준비 중이에요!');
                }}
              >
                <X className="h-4 w-4" />
              </button>

              {/* 작성자 + 날짜 */}
              <div className="mb-1 flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
                <span className="font-semibold text-gray-700">{item.name}</span>
                <span className="text-gray-400">{item.date}</span>
              </div>

              {/* 댓글 내용 */}
              <p className="whitespace-pre-line text-sm text-gray-700 sm:text-base">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
