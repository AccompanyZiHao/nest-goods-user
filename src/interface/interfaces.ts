import dayjs from 'dayjs';
import axios from "axios";
import { RegisterUser } from "../page/register/Register";
import { UpdatePassword } from "../page/update_password/UpdatePassword";
import { UserInfo } from "../page/update_info/UpdateInfo";
import { message } from "antd";
// import { SearchBooking } from "../page/booking_history/BookingHistory";
import { CreateSaleOrderParams } from '../page/goods-list/create-modal';
import { BASE_URL } from '../const/base';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
});

axiosInstance.interceptors.request.use(function (config) {
    const accessToken = localStorage.getItem('access_token');

    if(accessToken) {
        config.headers.authorization = 'Bearer ' + accessToken;
    }
    return config;
})

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
        let { data, config } = error.response;

        if (data.code === 401 && !config.url.includes('/user/refresh')) {

            const res = await refreshToken();


            if(res.status === 200) {
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
)

async function refreshToken() {
    const res = await axiosInstance.get('/user/refresh', {
        params: {
          refresh_token: localStorage.getItem('refresh_token')
        }
    });
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    return res;
}

export async function login(username: string, password: string) {
    return await axiosInstance.post('/user/login', {
        username, password
    });
}

export async function registerCaptcha(email: string) {
    return await axiosInstance.get('/user/register-captcha', {
        params: {
            address: email
        }
    });
}

export async function register(registerUser: RegisterUser) {
    return await axiosInstance.post('/user/register', registerUser);
}

export async function updatePasswordCaptcha(email: string) {
    return await axiosInstance.get('/user/update_password/captcha', {
        params: {
            address: email
        }
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
      name,
      id,
      kind,
      pageNo,
      pageSize,
    },
  });
}

export async function inventoryList(form: any, pageNo: number, pageSize: number) {
  return await axiosInstance.get('/inventory/list', {
    params: {
      username: form.username,
      goodsName: form.meetingRoomName,
      goodsId: form.meetingRoomPosition,
      goodsType: form.goodsType,
      pageNo: pageNo,
      pageSize: pageSize,
    },
  });
}

export async function unbind(id: number) {
    return await axiosInstance.get('/inventory/unbind/' + id);
}

export async function createSaleOrder(data: CreateSaleOrderParams) {
  return await axiosInstance.post('/inventory/createSaleOrder', data);
}

export async function logout(){
    return await axios.post('user/logout');
}
