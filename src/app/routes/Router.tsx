import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { DiaryPage } from '@pages/diary';
import { ErrorPage } from '@pages/error';
import { FriendsForestPage } from '@pages/friends-forest';
import { FriendsForestDetailPage } from '@pages/friends-forest';
import { MindTreePage } from '@pages/mind-tree';
import { Mypage } from '@pages/mypage';
import { Layout } from '@shared/components';
import { RouterPath } from '@shared/constants';

import { PrivateRoute } from './PrivateRoute';

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
        element: (
          <PrivateRoute>
            <DiaryPage />
          </PrivateRoute>
        ),
      },
      {
        path: RouterPath.FORESTS,
        element: (
          <PrivateRoute>
            <FriendsForestPage />
          </PrivateRoute>
        ),
      },
      {
        path: RouterPath.FOREST_DETAIL,
        element: (
          <PrivateRoute>
            <FriendsForestDetailPage />
          </PrivateRoute>
        ),
      },
      {
        path: RouterPath.MYPAGE,
        element: (
          <PrivateRoute>
            <Mypage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: RouterPath.ERROR,
    element: <ErrorPage />,
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
