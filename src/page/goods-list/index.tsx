import { Badge, Button, Form, Input, Image, Select, Table, message, Modal, Tag } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import './index.css';
import { ColumnsType } from 'antd/es/table';
import { useForm } from 'antd/es/form/Form';
import { createSaleOrder, searchGoodsList, unbind } from '../../interface/interfaces';
import { CreateModal } from './create-modal';
import { CategorySelect, getLocalCategoryData } from '../operate-history/CategorySelect';
import { BASE_URL, DEFAULT_IMAGE } from '../../const/base';
import dayjs from 'dayjs';

interface SearchGoods {
  name: string;
  id: number;
  kind: number;
}

export interface GoodsSearchResult {
  id: number;
  name: string;
  kind: number;
  img: string;
  num: number;
  saleNum: number;
  sellPrice: string;
  description: string;
  isSale: boolean;
  createTime: Date;
  updateTime: Date;
}

export function GoodsList() {
  // 列表数据
  const [goodsResult, setGoodsResult] = useState<Array<GoodsSearchResult>>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // 显示显示上下架弹窗
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // 上下架弹窗类型 2 下架 1 上架
  const [modalType, setModalType] = useState<2 | 1>();
  // 当前选中的商品信息
  const [currentGoods, setCurrentGoods] = useState<GoodsSearchResult>();

  const columns: ColumnsType<GoodsSearchResult> = useMemo(
    () => [
      {
        title: '商品 ID',
        dataIndex: 'id',
      },
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品类型',
        dataIndex: 'kind',
        render: (_, record) => {
          return <CategorySelect value={record.kind} disabled isText={true} />;
        },
      },
      {
        title: '商品图片',
        dataIndex: 'img',
        render: (_, record) => (
          <div>
            <Image width={100} src={BASE_URL + (record.img || DEFAULT_IMAGE)} />
          </div>
        ),
      },
      {
        title: '商品售价',
        dataIndex: 'sellPrice',
      },
      {
        title: '商品数量',
        dataIndex: 'num',
      },
      {
        title: '已上架数量',
        dataIndex: 'saleNum',
      },
      {
        title: '描述',
        dataIndex: 'description',
      },
      {
        title: '添加时间',
        dataIndex: 'createTime',
        render(_, record) {
          return dayjs(new Date(record.createTime)).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '上次更新时间',
        dataIndex: 'updateTime',
        render(_, record) {
          return dayjs(new Date(record.updateTime)).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '上架状态',
        dataIndex: 'isSale',
        render: (_, record) => (record.isSale ? <Tag color="success">已上架</Tag> : <Tag>未上架</Tag>),
      },
      {
        title: '操作',
        render: (_, record) => (
          <div>
            {record.isSale && record.saleNum > 0 && (
              <Button danger type="primary" onClick={() => onSaleHandler(record, 2)}>
                下架
              </Button>
            )}
            {(!record.saleNum || record.saleNum < record.num) && (
              <Button type="primary" onClick={() => onSaleHandler(record, 1)}>
                上架
              </Button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  const searchGoods = async (values: SearchGoods, initPage?: number) => {
    const res = await searchGoodsList(values.name, values.id, values.kind, initPage ? 1 : pageNo, pageSize);

    const { data } = res.data;
    if (res.status === 201 || res.status === 200) {
      setGoodsResult(
        data.goods.map((item: GoodsSearchResult) => {
          return {
            key: item.id,
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

  useEffect(() => {
    searchGoods({
      name: form.getFieldValue('name'),
      id: form.getFieldValue('id'),
      kind: form.getFieldValue('kind'),
    });
  }, [pageNo, pageSize]);

  const changePage = useCallback(function (pageNo: number, pageSize: number) {
    setPageNo(pageNo);
    setPageSize(pageSize);
  }, []);

  function onSaleHandler(record: GoodsSearchResult, type: 1 | 2) {
    setModalType(type);

    setIsCreateModalOpen(true);

    setCurrentGoods(record);
  }

  return (
    <div id="goods-list-container">
      <div className="goods-form">
        <Form form={form} onFinish={(e) => searchGoods(e, 1)} name="search" layout="inline" colon={false}>
          <Form.Item label="商品名称" name="name">
            <Input />
          </Form.Item>

          {/* <Form.Item label="商品ID" name="id">
            <Input />
          </Form.Item> */}

          <Form.Item label="商品类型" name="kind" style={{ width: 200 }}>
            <CategorySelect />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="goods-list-table">
        <Table
          columns={columns}
          dataSource={goodsResult}
          pagination={{
            current: pageNo,
            pageSize: pageSize,
            onChange: changePage,
            total,
          }}
        />
      </div>
      {currentGoods ? (
        <CreateModal
          type={modalType}
          goods={currentGoods}
          isOpen={isCreateModalOpen}
          handleClose={() => {
            setIsCreateModalOpen(false);
          }}
        ></CreateModal>
      ) : null}
    </div>
  );
}
