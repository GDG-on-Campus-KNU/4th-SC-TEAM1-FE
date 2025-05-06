type Props = {
  date: Date;
  onClose: () => void;
};

export const DiaryEditor = ({ date, onClose }: Props) => {
  return (
    <div className="relative rounded-xl bg-white p-6 shadow-md">
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-sm text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>

      <h2 className="mb-4 text-lg font-semibold text-primary">
        {date.toLocaleDateString()}의 일기
      </h2>

      {/* 감정 입력 */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">오늘의 감정</label>
        <input
          type="text"
          placeholder="감정을 입력하세요"
          className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* 내용 입력 */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">일기 내용</label>
        <textarea
          rows={6}
          placeholder="오늘 있었던 일을 적어보세요."
          className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* 저장 버튼 */}
      <button className="w-full rounded-lg bg-primary py-2 text-white hover:bg-primary/90">
        저장하기
      </button>
    </div>
  );
};
