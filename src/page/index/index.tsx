import { Outlet, useNavigate } from 'react-router-dom';
import './index.css';

import { UserInfo } from '../user-info';

export function Index() {
  const navigate = useNavigate();
  return (
    <div id="index-container">
      <div className="header">
        <h1 onClick={() => navigate('/')}>超市系统</h1>
        <UserInfo />
      </div>
      <div className="body">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
