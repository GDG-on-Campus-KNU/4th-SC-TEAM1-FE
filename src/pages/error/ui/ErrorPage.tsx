export const ErrorPage = () => {
  return (
    <div className='min-h-[200vh] flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-10 rounded-2xl shadow-xl text-center animate-pulse'>
        <div className='text-6xl mb-4'>❌</div>
        <h1 className='text-2xl font-bold text-red-600 mb-2'>오류가 발생했어요</h1>
        <p className='text-gray-600 mb-8'>문제를 해결 중이에요. 잠시 후 다시 시도해주세요.</p>
        <p className='text-lg text-blue-400'>
          아래로 스크롤해서 스크롤바 스타일이 잘 적용되었는지 확인해주세요 ↓↓↓
        </p>
      </div>
    </div>
  );
};
