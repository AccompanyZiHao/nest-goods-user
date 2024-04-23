import {
  Badge,
  Button,
  Form,
  Input,
  Select,
  Table,
  message,
  Modal,
} from 'antd';
import { useCallback, useEffect, useMemo, useState } from "react";
import './index.css';
import { ColumnsType } from "antd/es/table";
import { useForm } from "antd/es/form/Form";
import { searchGoodsList, unbind } from '../../interface/interfaces';
import { CreateModal } from './create-modal';
import { goodsTypeList} from '../../const/goodsType'


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
  sellPrice: string;
  description: string;
  isSale: boolean;
  createTime: Date;
  updateTime: Date;
}

export function GoodsList() {
    const [pageNo, setPageNo] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentGoods, setCurrentGoods] =
      useState<GoodsSearchResult>();

    const [goodsResult, setGoodsResult] = useState<
      Array<GoodsSearchResult>
    >([]);

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
        },
        {
          title: '商品图片',
          dataIndex: 'img',
          render: (_, record) => (
            <div>
              <img src={record.img} alt="" />
            </div>
          ),
        },
        {
          title: '商品售价',
          dataIndex: 'sellPrice',
        },
        {
          title: '描述',
          dataIndex: 'description',
        },
        {
          title: '添加时间',
          dataIndex: 'createTime',
        },
        {
          title: '上次更新时间',
          dataIndex: 'updateTime',
        },
        {
          title: '上架状态',
          dataIndex: 'isSale',
          render: (_, record) =>
            record.isSale ? (
              <Badge status="error">已上架</Badge>
            ) : (
              <Badge status="success">未上架</Badge>
            ),
        },
        {
          title: '操作',
          render: (_, record) => (
            <div onClick={() => onSaleHandler(record, record.isSale)}>
              {record.isSale ? '下架' : '上架'}
            </div>
          ),
        },
      ],
      []
    );

    const searchGoods = (async (values: SearchGoods, initPage?: number) => {
      const res = await searchGoodsList(
        values.name,
        values.id,
        values.kind,
        initPage ? 1 : pageNo,
        pageSize
      );

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
    });

    const [form ]  = useForm();

    useEffect(() => {
        searchGoods({
          name: form.getFieldValue('name'),
          id: form.getFieldValue('id'),
          kind: form.getFieldValue('kind'),
        });
    }, [pageNo, pageSize]);

    const changePage = useCallback(function(pageNo: number, pageSize: number) {
        setPageNo(pageNo);
        setPageSize(pageSize);
    }, []);


    const  { confirm } = Modal
    function onSaleHandler(record: GoodsSearchResult, status: boolean) {
      if (status) {
        confirm({
          title: '提示',
          content: `确定要下架商品【${record.name}】吗？`,
          async onOk() {
            const res = await unbind(record.id);
            if (res.status === 201 || res.status === 200) {
              message.success('下架成功');
            }
          },
        });
      } else {
        setIsCreateModalOpen(true);
        setCurrentGoods(record);
      }
    }

    return (
      <div id="goods-list-container">
        <div className="goods-form">
          <Form
            form={form}
            onFinish={(e) => searchGoods(e, 1)}
            name="search"
            layout="inline"
            colon={false}
          >
            <Form.Item label="商品名称" name="name">
              <Input />
            </Form.Item>

            <Form.Item label="商品ID" name="id">
              <Input />
            </Form.Item>

            <Form.Item label="商品类型" name="kind" style={{ width: 200 }}>
              <Select options={goodsTypeList}></Select>
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
