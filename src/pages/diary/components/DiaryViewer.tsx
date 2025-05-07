import ReactMarkdown from 'react-markdown';

type Props = {
  onClose: () => void;
};

const exampleDiary = {
  date: '2025-05-07',
  emotion: {
    name: 'HAPPY' as const,
    emoji: '😊',
  },
  markdown: `
# 😊 즐거운 하루였어요!

## 오전
- 아침에 일찍 일어나서 상쾌한 기분으로 하루를 시작했어요.
- 따뜻한 커피 한 잔과 함께 일기장을 열었어요.

## 오후
- 친구랑 공원에서 산책을 했어요.
- 벤치에 앉아 햇살을 쬐며 이야기 나눴는데 너무 좋았어요 🌳🌞

## 저녁
- 가족과 함께 저녁을 먹었어요. 오늘 메뉴는 된장찌개!
- 하루를 마무리하며 차 한잔 마시고 조용히 책을 읽었어요.

> "작은 일상 속에서도 행복은 충분히 피어난다."
  `,
};

export const DiaryViewer = ({ onClose }: Props) => {
  const date = new Date(exampleDiary.date).toLocaleDateString();

  return (
    <div className="relative mx-auto w-full rounded-xl bg-white px-4 pb-6 pt-4 shadow-md sm:max-w-sm lg:max-w-xl lg:px-6 lg:pt-6">
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute right-3 top-3 z-10 text-lg text-gray-400 transition hover:scale-110 hover:text-gray-600"
      >
        ✕
      </button>

      <h2 className="mb-2 text-lg font-semibold text-primary">{date}의 일기</h2>

      <p className="mb-4 text-sm text-gray-600">
        오늘의 감정:{' '}
        <span className="text-base">
          {exampleDiary.emotion.emoji} {exampleDiary.emotion.name}
        </span>
      </p>

      <div className="prose prose-sm max-w-none leading-relaxed text-gray-800">
        <ReactMarkdown
          components={{
            h1: ({ ...props }) => <h1 className="text-xl font-bold text-primary" {...props} />,
            h2: ({ ...props }) => <h2 className="text-lg font-semibold text-primary" {...props} />,
            h3: ({ ...props }) => <h3 className="text-base font-medium text-primary" {...props} />,
            p: ({ ...props }) => <p className="text-sm" {...props} />,
            li: ({ ...props }) => <li className="ml-4 list-disc text-sm" {...props} />,
            blockquote: ({ ...props }) => (
              <blockquote
                className="border-l-4 border-primary pl-4 italic text-gray-600"
                {...props}
              />
            ),
          }}
        >
          {exampleDiary.markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};
