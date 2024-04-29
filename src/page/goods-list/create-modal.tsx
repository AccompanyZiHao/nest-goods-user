import { DatePicker, Form, Input, InputNumber, Modal, Select, TimePicker, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { createSaleOrder } from '../../interface/interfaces';
import { GoodsSearchResult } from './index';
import { useMemo } from 'react';

interface CreateModalProps {
  isOpen: boolean;
  handleClose: Function;
  goods: GoodsSearchResult;
  type: 2 | 1;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
export interface CreateSelfRequestFormParams {
  goodsId: number;
  quantity: number;
  location: number;
}

export function CreateModal(props: CreateModalProps) {
  const [form] = useForm<CreateSelfRequestFormParams>();

  // 上下架文案
  const text = useMemo(() => (props.type === 1 ? '上架' : '下架'), [props.type]);

  const handleOk = async function () {
    const values = form.getFieldsValue();
    values.goodsId = props.goods.id;

    const res = await createSaleOrder({
      ...values,
      status: props.type,
    });

    if (res.status === 201 || res.status === 200) {
      message.success(text + '审核提交成功，请等待');
      form.resetFields();
      props.handleClose();
    } else {
      message.error(res.data.data);
    }
  };

  const onCancel = () => {
    form.resetFields();
    props.handleClose();
  };

  return (
    <Modal title={`${text}商品`} open={props.isOpen} onOk={handleOk} onCancel={onCancel}>
      <Form form={form} colon={false} {...layout}>
        <Form.Item label="商品名称">{props.goods?.name}</Form.Item>

        {props.type === 1 ? (
          <Form.Item label="库存数量">{props.goods.num - props.goods?.saleNum}</Form.Item>
        ) : (
          <Form.Item label="已上架数量">{props.goods?.saleNum}</Form.Item>
        )}

        <Form.Item label={`${text}数量`} name="quantity" rules={[{ required: true, message: '请填写数量!' }]}>
          <InputNumber />
        </Form.Item>
        {/* <Form.Item
          label="货架位置"
          name="location"
          rules={[{ required: true, message: 'Please input your location!' }]}
        >
          <Input />
        </Form.Item> */}
        <Form.Item label="备注" name="note">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
