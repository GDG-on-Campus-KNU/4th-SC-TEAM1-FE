export const LoggedOut = () => {
  return (
    <div className="flex min-h-screen w-full animate-fade-in flex-col items-center justify-center bg-gradient-to-b from-[#fdfcfb] to-[#e2ebe5] text-center">
      <h1 className="animate-fade-in-up mb-4 text-3xl font-bold leading-snug text-gray-800">
        감정 일기로 나를 돌보는 공간,
        <br />
        <span className="text-primary">토닥</span>
      </h1>

      <p className="animate-fade-in-up mb-8 max-w-md text-gray-600 delay-100">
        매일의 감정을 기록하며,
        <br />
        당신만의 마음나무를 키워보세요.
        <br />
        친구들과 따뜻한 마음도 나눌 수 있어요.
      </p>

      <div className="animate-fade-in-up mb-10 flex flex-col gap-3 delay-200 sm:flex-row sm:gap-4">
        <button className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90">
          로그인
        </button>
        <button className="rounded-full border border-primary px-6 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10">
          회원가입
        </button>
      </div>

      <div className="animate-fade-in-up flex flex-col items-center gap-4 text-sm text-gray-600 delay-300">
        <div className="flex items-center gap-2">
          <span>🌱</span>
          <span>감정 기록이 나무로 자라나요</span>
        </div>
        <div className="flex items-center gap-2">
          <span>💌</span>
          <span>이웃과 마음을 나눠요</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🤖</span>
          <span>AI 친구가 응원해줘요</span>
        </div>
      </div>
    </div>
  );
};
