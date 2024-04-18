import { InboxOutlined } from "@ant-design/icons";
import { message } from "antd";
import Dragger, { DraggerProps } from "antd/es/upload/Dragger";
import { BASE_URL } from "../../const/base";

interface HeadPicUploadProps {
    value?: string;
    onChange?: Function
}

let onChange: Function;

const props: DraggerProps = {
    name: 'file',
    action: BASE_URL + 'user/upload',
    onChange(info) {
        const { status } = info.file;
        if (status === 'done') {
            onChange(info.file.response.data);
            message.success(`${info.file.name} 文件上传成功`);
        } else if (status === 'error') {
            message.error(`${info.file.name} 文件上传失败`);
        }
    }
};

const dragger = <Dragger {...props}>
    <p className="ant-upload-drag-icon">
        <InboxOutlined />
    </p>
    <p className="ant-upload-text">点击或拖拽文件到这个区域来上传</p>
</Dragger>

export function HeadPicUpload(props: HeadPicUploadProps) {

    onChange = props.onChange!

    return props?.value ? (
      <div>
        <img src={BASE_URL + props.value} alt="头像" width="100" height="100" />
        {dragger}
      </div>
    ) : (
      <div>{dragger}</div>
    );
}
