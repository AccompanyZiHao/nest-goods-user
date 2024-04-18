import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Register } from './page/register/Register';
import { Login } from './page/login/Login';
import { UpdatePassword } from './page/update_password/UpdatePassword';
import { ErrorPage } from './page/error/ErrorPage';
import { Index } from './page/index/index';
import { UpdateInfo } from './page/update_info/UpdateInfo';
import { Menu } from './page/menu/Menu';
import { GoodsList } from './page/goods-list';
import { OnSaleList } from './page/operate-history/on-sale-list';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

//
const routes = [
  {
    path: '/',
    element: <Index></Index>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'update_info',
        element: <UpdateInfo />,
      },
      {
        path: '/',
        element: <Menu />,
        children: [
          {
            path: '/',
            element: <GoodsList />,
          },
          {
            path: 'goods-list',
            element: <GoodsList />,
          },
          {
            path: 'history',
            element: <OnSaleList />,
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'register',
    element: <Register />,
  },
  {
    path: 'update_password',
    element: <UpdatePassword />,
  },
];
export const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const App = (
  <ConfigProvider locale={zhCN}>
    <RouterProvider router={router} />
  </ConfigProvider>
);

root.render(App);
