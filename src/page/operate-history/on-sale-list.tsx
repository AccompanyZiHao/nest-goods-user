import {
  Button,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Select,
  Table,
  TimePicker,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import './booking_history.css';
import { inventoryList, unbind } from '../../interface/interfaces';
import { GoodsSearchResult } from '../goods-list/index';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { goodsTypeList } from '../../const/goodsType';
import { getUserInfo } from '../user-info';

export interface SearchForm {
  goodsName: string;
  location: string;
  goodsType: number;
}

interface OnSaleListResult {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  note: string;
  createTime: string;
  updateTime: string;
  goods: GoodsSearchResult;
}

export function OnSaleList() {
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [list, setList] = useState<Array<OnSaleListResult>>([]);
  // 更新列表
  const [refresh, setRefresh] = useState(false);

  const searchHandle = async (values: SearchForm) => {
    const userInfo = await getUserInfo();
    const res = await inventoryList(
      { ...values, username: userInfo.username },
      pageNo,
      pageSize
    );

    const { data } = res.data;
    if (res.status === 201 || res.status === 200) {
      setList(
        data.list.map((item: OnSaleListResult) => {
          return {
            key: item.id,
            ...item,
          };
        })
      );
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
      location: form.getFieldValue('location'),
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
    {
      title: '货架位置',
      dataIndex: 'location',
    },
    {
      title: '上架数量',
      dataIndex: 'quantity',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      onFilter: (value, record) => record.status.startsWith(value as string),
      filters: [
        {
          text: '审核通过',
          value: '审核通过',
        },
        {
          text: '审核驳回',
          value: '审核驳回',
        },
        {
          text: '申请中',
          value: '申请中',
        },
        {
          text: '已解除',
          value: '已解除',
        },
      ],
    },
    {
      title: '上架时间',
      dataIndex: 'createTime',
      render(_, record) {
        return dayjs(new Date(record.createTime)).format('YYYY-MM-DD hh:mm:ss');
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '操作',
      render: (_, record) =>
        record.status === '申请中' ? (
          <div>
            <Popconfirm
              title="解除申请"
              description="确认解除吗？"
              onConfirm={() => changeStatus(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <a href="#">解除上架</a>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];

  return (
    <div id="onSaleList-container">
      <div className="onSaleList-form">
        <Form
          form={form}
          onFinish={searchHandle}
          name="search"
          layout="inline"
          colon={false}
        >
          <Form.Item label="商品名称" name="goodsName">
            <Input />
          </Form.Item>

          <Form.Item label="货架位置" name="location">
            <Input />
          </Form.Item>

          <Form.Item label="商品类型" name="goodsType" style={{ width: 200 }}>
            <Select options={goodsTypeList}></Select>
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="onSaleList-table">
        <Table
          columns={columns}
          dataSource={list}
          pagination={{
            current: pageNo,
            pageSize: pageSize,
            onChange: changePage,
          }}
        />
      </div>
    </div>
  );
}
