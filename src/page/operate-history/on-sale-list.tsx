import { Button, DatePicker, Form, Input, Modal, Popconfirm, Select, Table, Tag, TimePicker, message } from 'antd';
import { useEffect, useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import { inventoryList, unbind } from '../../interface/interfaces';
import { GoodsSearchResult } from '../goods-list/index';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { getUserInfo } from '../user-info';
import { CategorySelect } from './CategorySelect';

export interface SearchForm {
  goodsName: string;
  // location: string;
  goodsType: number;
}

interface OnSaleListResult {
  request_id: number;
  startTime: string;
  endTime: string;
  request_status: number;
  request_type: number;
  refuse_reason: string;
  createTime: string;
  updateTime: string;
  goods: GoodsSearchResult;
}

const { confirm } = Modal;

export const showConfirm = (
  {
    title = '提示',
    content = '确认撤回这条申请吗？',
  }: {
    title?: string;
    content?: string;
  },
  callback: () => void
) => {
  confirm({
    title,
    content: <div>{content}</div>,
    onOk() {
      callback();
    },
  });
};

export function OnSaleList() {
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [list, setList] = useState<Array<OnSaleListResult>>([]);
  const [total, setTotal] = useState<number>();
  // 更新列表
  const [refresh, setRefresh] = useState(false);

  const searchHandle = async (values: SearchForm) => {
    const userInfo = await getUserInfo();
    const res = await inventoryList({ ...values, username: userInfo.username }, pageNo, pageSize);

    const { data } = res.data;
    if (res.status === 201 || res.status === 200) {
      setList(
        data.list.map((item: OnSaleListResult) => {
          return {
            key: item.request_id,
            ...item,
          };
        })
      );

      setTotal(data.totalCount);
    } else {
      message.error(data || '系统繁忙，请稍后再试');
    }
  };

  const [form] = useForm();

  const changePage = function (pageNo: number, pageSize: number) {
    setPageNo(pageNo);
    setPageSize(pageSize);
  };

  useEffect(() => {
    searchHandle({
      goodsName: form.getFieldValue('goodsName'),
      goodsType: form.getFieldValue('goodsType'),
      // location: form.getFieldValue('location'),
    });
  }, [pageNo, pageSize, refresh]);

  async function changeStatus(id: number) {
    const res = await unbind(id);

    if (res.status === 201 || res.status === 200) {
      message.success('状态更新成功');
      setRefresh(!refresh);
    } else {
      message.error(res.data.data);
    }
  }

  const columns: ColumnsType<OnSaleListResult> = [
    {
      title: '商品名称',
      dataIndex: 'goods',
      render(_, record) {
        return record.goods.name;
      },
    },
    // {
    //   title: '货架位置',
    //   dataIndex: 'location',
    // },
    {
      title: '申请类型',
      dataIndex: 'request_type',
      render(_, record) {
        return record.request_type === 1 ? '上架' : '下架';
      },
    },
    {
      title: '数量',
      dataIndex: 'request_quantity',
    },
    {
      title: '审核状态',
      dataIndex: 'request_status',
      render(_, record) {
        return {
          1: <Tag color="processing">审核中</Tag>,
          2: <Tag color="success">审核通过</Tag>,
          3: <Tag color="error">审核不通过</Tag>,
          4: <Tag color="default">用户已撤消</Tag>,
        }[record.request_status];
      },
    },
    {
      title: '上架时间',
      dataIndex: 'createTime',
      render(_, record) {
        return dayjs(new Date(record.createTime)).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '备注',
      dataIndex: 'refuse_reason',
    },
    {
      title: '操作',
      width: 160,
      render: (_, record) =>
        record.request_status === 1 ? (
          <Button
            size="small"
            onClick={() => {
              showConfirm({}, () => {
                changeStatus(record.request_id);
              });
            }}
          >
            撤回申请
          </Button>
        ) : null,
    },
  ];

  return (
    <div id="container">
      <div className="form">
        <Form form={form} onFinish={searchHandle} name="search" layout="inline" colon={false}>
          <Form.Item label="商品名称" name="goodsName">
            <Input />
          </Form.Item>

          {/* <Form.Item label="货架位置" name="location">
            <Input />
          </Form.Item> */}

          <Form.Item label="商品类型" name="goodsType" style={{ width: 200 }}>
            {/* <Select options={}></Select> */}
            <CategorySelect />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="table">
        <Table
          columns={columns}
          dataSource={list}
          pagination={{
            current: pageNo,
            pageSize: pageSize,
            onChange: changePage,
            total,
          }}
        />
      </div>
    </div>
  );
}
