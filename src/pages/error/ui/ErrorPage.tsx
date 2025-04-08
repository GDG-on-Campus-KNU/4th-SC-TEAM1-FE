import { Link } from 'react-router-dom';

import { AnalyticsTracker } from '@shared/components';

import ErrorTodak from '../assets/error-todak.png';

export const ErrorPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16 text-center">
      <AnalyticsTracker />
      <img src={ErrorTodak} alt="페이지를 찾을 수 없음" className="w-60" />
      <h1 className="mb-2 text-2xl font-bold text-gray-800">앗! 길을 잃으셨어요</h1>
      <p className="mb-6 text-gray-600">
        요청하신 페이지를 찾을 수 없어요.
        <br />
        아래 버튼을 눌러 메인으로 돌아가보세요.
      </p>
      <Link
        to="/"
        className="rounded-full bg-primary px-6 py-2 text-white transition-colors hover:bg-primary/90"
      >
        메인으로 가기
      </Link>
    </div>
  );
};
