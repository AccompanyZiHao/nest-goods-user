import { UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout as logoutApi, getUserInfo as userInfoApi } from '../../interface/interfaces';
import { BASE_URL, DEFAULT_IMAGE } from '../../const/base';
import { Dropdown, MenuProps } from 'antd';

interface UserInfoType {
  username: string;
  headPic: string;
  [key: string]: string;
}

export const getUserInfo = async (): Promise<UserInfoType> => {
  const userInfoStr = localStorage.getItem('user_info');

  if (userInfoStr) {
    return JSON.parse(userInfoStr);
  }

  const res = await userInfoApi();
  const { data } = res.data;

  setUserInfo(data);

  return data;
};

export const setUserInfo = (data: Object) => {
  localStorage.setItem('user_info', JSON.stringify(data));
};

const DefaultInfo = () => {
  return (
    <Link to={'/update_info'}>
      <UserOutlined className="icon" />
    </Link>
  );
};

export const UserInfo = () => {
  const [user, setUse] = useState<UserInfoType>({
    username: '',
    headPic: '',
  });
  useEffect(() => {
    getUserInfo().then((user) => {
      setUse(user);
    });
  }, []);

  if (!user.nickName) {
    return <DefaultInfo />;
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link to={'/update_info'} style={{ textDecoration: 'none' }}>
          个人资料
        </Link>
      ),
    },
    {
      key: '2',
      label: <Logout />,
    },
  ];
  return (
    <Dropdown
      menu={{ items }}
      placement="bottom"
      arrow={{ pointAtCenter: true }}
    >
      <div className="dsf aic jcc">
        {user?.nickName}
        <img
          src={BASE_URL + (user?.headPic || DEFAULT_IMAGE)}
          alt=""
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
        />
      </div>
    </Dropdown>
  );
};

function Logout() {
  const navigate = useNavigate();
  const logoutHandle = async() => {
    // const res = await logoutApi();
    // const { data } = res;
    // console.log('data:===', data);
    sessionStorage.clear();
    navigate('login');
  };
  return <div onClick={logoutHandle}>退出</div>;
}
