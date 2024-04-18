import { DatePicker, Form, Input, InputNumber, Modal, Select, TimePicker, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { createSaleOrder } from '../../interface/interfaces';
import { GoodsSearchResult } from './index';

interface CreateModalProps {
  isOpen: boolean;
  handleClose: Function;
  goods: GoodsSearchResult;
}

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
}

export interface CreateSaleOrderParams {
  goodsId: number;
  quantity: number;
  location: number
}

export function CreateModal(props: CreateModalProps) {
  const [form] = useForm<CreateSaleOrderParams>();

  const handleOk = async function () {
    const values = form.getFieldsValue();
    values.goodsId = props.goods.id;

    const res = await createSaleOrder(values);

    if (res.status === 201 || res.status === 200) {
      message.success('上架成功，等待审核');
      form.resetFields();
      props.handleClose();
    } else {
      message.error(res.data.data);
    }
  };

  return (
    <Modal
      title="上架商品"
      open={props.isOpen}
      onOk={handleOk}
      onCancel={() => props.handleClose()}
    >
      <Form form={form} colon={false} {...layout}>
        <Form.Item label="商品名称" name="goodsId">
          {props.goods.name}
        </Form.Item>

        <Form.Item
          label="商品数量"
          name="quantity"
          rules={[{ required: true, message: 'Please input your quantity!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="货架位置"
          name="location"
          rules={[{ required: true, message: 'Please input your location!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="备注" name="note">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
