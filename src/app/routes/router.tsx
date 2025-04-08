import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { DiaryPage } from '@pages/diary';
import { ErrorPage } from '@pages/error';
import { FriendsForestPage } from '@pages/friends-forest';
import { MindTreePage } from '@pages/mind-tree';
import { Mypage } from '@pages/mypage';
import { Layout } from '@shared/components';
import { RouterPath } from '@shared/constants';

// Layout import

const router = createBrowserRouter([
  {
    path: RouterPath.ROOT,
    element: <Layout />,
    children: [
      {
        path: RouterPath.MAIN,
        element: <MindTreePage />,
      },
      {
        path: RouterPath.DIARY,
        element: <DiaryPage />,
      },
      {
        path: RouterPath.FORESTS,
        element: <FriendsForestPage />,
      },
      {
        path: RouterPath.MYPAGE,
        element: <Mypage />,
      },
    ],
  },
  {
    path: RouterPath.ERROR,
    element: <ErrorPage />, // ❗ Layout 없이 단독 페이지
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
