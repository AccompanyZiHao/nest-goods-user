import dayjs from 'dayjs';
import axios from 'axios';
import { RegisterUser } from '../page/register/Register';
import { UpdatePassword } from '../page/update_password/UpdatePassword';
import { UserInfo } from '../page/update_info/UpdateInfo';
import { message } from 'antd';
// import { SearchBooking } from "../page/booking_history/BookingHistory";
import { BASE_URL } from '../const/base';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
});

axiosInstance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem('access_token');

  if (accessToken) {
    config.headers.authorization = 'Bearer ' + accessToken;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    let { data, config } = response;

    if (data.code === 401 && !config?.url?.includes('/user/refresh')) {
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }
    return response;
  },
  async (error) => {
    if (!error?.response) {
      message.error(error.message);
      return error;
    }
    let { data, config } = error.response;

    if (data && data.code === 401 && !config.url.includes('/user/refresh')) {
      const res = await refreshToken();

      if (res.status === 200) {
        return axios(config);
      } else {
        message.error(res.data);

        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    } else {
      return error.response;
    }
  }
);

async function refreshToken() {
  const res = await axiosInstance.get('/user/refresh', {
    params: {
      refresh_token: localStorage.getItem('refresh_token'),
    },
  });
  localStorage.setItem('access_token', res.data.access_token);
  localStorage.setItem('refresh_token', res.data.refresh_token);
  return res;
}

export async function login(username: string, password: string) {
  return await axiosInstance.post('/user/login', {
    username,
    password,
  });
}

export async function registerCaptcha(email: string) {
  return await axiosInstance.get('/user/register-captcha', {
    params: {
      address: email,
    },
  });
}

export async function register(registerUser: RegisterUser) {
  return await axiosInstance.post('/user/register', registerUser);
}

export async function updatePasswordCaptcha(email: string) {
  return await axiosInstance.get('/user/update_password/captcha', {
    params: {
      address: email,
    },
  });
}

export async function updatePassword(data: UpdatePassword) {
  return await axiosInstance.post('/user/update_password', data);
}

export async function getUserInfo() {
  return await axiosInstance.get('/user/info');
}

export async function updateInfo(data: UserInfo) {
  return await axiosInstance.post('/user/update', data);
}

export async function updateUserInfoCaptcha(address: string) {
  return await axiosInstance.get('/user/update/captcha', {
    params: { address },
  });
}

export async function searchGoodsList(
  name: string,
  id: number,
  kind: number,
  pageNo: number,
  pageSize: number
) {
  return await axiosInstance.get('/goods/list', {
    params: {
      name: name?.trim(),
      id,
      kind,
      pageNo,
      pageSize,
    },
  });
}

export async function inventoryList(
  form: any,
  pageNo: number,
  pageSize: number
) {
  return await axiosInstance.get('/shelf-request/list', {
    params: {
      username: form.username,
      goodsName: form.goodsName?.trim(),
      goodsType: form.goodsType,
      pageNo: pageNo,
      pageSize: pageSize,
    },
  });
}

export async function unbind(id: number) {
  return await axiosInstance.get('/shelf-request/unbind/' + id);
}

export async function createSaleOrder(data) {
  return await axiosInstance.post('/shelf-request/create', data);
}

export async function categoryList() {
  return await axiosInstance.get('/category/list');
}

export async function logout() {
  return await axios.post('user/logout');
}
