type LoggedOutProps = {
  setModal: (modal: 'login' | 'register') => void;
};

export const LoggedOut = ({ setModal }: LoggedOutProps) => {
  return (
    <div className="flex min-h-screen w-full animate-fade-in flex-col items-center justify-center bg-gradient-to-b from-[#fdfcfb] to-[#e2ebe5] px-4 py-12 text-center">
      <h1 className="animate-fade-in-up mb-4 text-2xl font-bold leading-snug text-gray-800 md:text-3xl">
        감정 일기로 나를 돌보는 공간
        <br />
        <span className="text-primary">토닥</span>
      </h1>

      <p className="animate-fade-in-up mb-8 max-w-md text-sm text-gray-600 delay-100 sm:text-base">
        매일의 감정을 기록하며,
        <br />
        나만의 마음나무를 키워보세요.
        <br />
        친구들과 따뜻한 마음도 나눌 수 있어요.
      </p>

      <div className="animate-fade-in-up mb-10 flex flex-col gap-3 delay-200 sm:flex-row sm:gap-4">
        <button
          onClick={() => setModal('login')}
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          로그인
        </button>
        <button
          onClick={() => setModal('register')}
          className="rounded-full border border-primary px-6 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
        >
          회원가입
        </button>
      </div>

      <div className="animate-fade-in-up mb-10 flex flex-col items-center gap-4 text-sm text-gray-600 delay-300 sm:text-base">
        <div className="flex items-center gap-2">
          <span>🌱</span>
          <span>감정 기록이 나무로 자라나요</span>
        </div>
        <div className="flex items-center gap-2">
          <span>💌</span>
          <span>이웃과 마음을 나눠요</span>
        </div>
        <div className="flex items-center gap-2">
          <span>☺️</span>
          <span>AI 토닥 친구가 함께해요</span>
        </div>
      </div>

      {/* 주요 기능 카드 소개 */}
      <div className="flex flex-col gap-6 px-4 sm:w-4/5 md:w-3/5 md:flex-row">
        <div className="flex-1 rounded-xl bg-white p-6 text-center shadow-md">
          <h3 className="mb-2 text-lg font-semibold text-primary">마음나무</h3>
          <p className="text-balance break-keep text-sm text-gray-600">
            감정을 기록할수록 성장하는 당신만의 나무를 키워보세요. 씨앗부터 성목까지 다양한 단계로
            자라나요.
          </p>
        </div>

        <div className="flex-1 rounded-xl bg-white p-6 text-center shadow-md">
          <h3 className="mb-2 text-lg font-semibold text-primary">일기장</h3>
          <p className="text-balance break-keep text-sm text-gray-600">
            하루의 감정을 담아 일기를 작성하고, 나중에 다시 돌아보며 스스로를 더 잘 이해할 수
            있어요.
          </p>
        </div>

        <div className="flex-1 rounded-xl bg-white p-6 text-center shadow-md">
          <h3 className="mb-2 text-lg font-semibold text-primary">이웃숲</h3>
          <p className="text-balance break-keep text-sm text-gray-600">
            친구들과 서로의 나무를 구경하고, 방명록을 남기며 따뜻한 마음을 주고받을 수 있어요.
          </p>
        </div>
      </div>
    </div>
  );
};
