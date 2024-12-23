import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
  Spin,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import './index.less';

interface infoVerify {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}
const TestVerifyInput: React.FC<infoVerify> = ({
  isModalOpen,
  handleOk,
  handleCancel,
}) => {
  const [loading, setloading] = useState(false);
  const [verifyNumber, setverifyNumber] = useState<any>('');
  const [isFocus, setisFocus] = useState(true);
  const formRef = useRef<any>();
  useEffect(() => {
    if (isModalOpen) {
      if (formRef.current) {
        setTimeout(() => {
          formRef.current.getFieldInstance('number').focus();
          setisFocus(true);
        }, 10);
      }
    }
  }, [isModalOpen, formRef]);
  const onFocus = () => {
    setisFocus(true);
  };
  const onInput = (e: any) => {
    const target = e.target.value;
    setverifyNumber(target);
    if (target?.length >= 6) {
      setloading(true);
      setTimeout(() => {
        setloading(false);
        handleOk();
        setverifyNumber('');
        console.log('formRef.current', formRef.current);
        formRef.current.setFieldsValue({ number: '' });
      });
    }
  };

  const renderInput = () => {
    return (
      <div className="number-box">
        {Array(6)
          .fill('')
          .map((_, index) => (
            <div
              className={`number-item ${
                isFocus && verifyNumber?.length === index ? 'isfocus' : ''
              }`}
            >
              {verifyNumber[index]}
            </div>
          ))}
        <Form className="input-item" ref={formRef}>
          <Form.Item name="number">
            <Input maxLength={6} onChange={onInput} onFocus={onFocus} />
          </Form.Item>
        </Form>
      </div>
    );
  };
  return (
    <Modal
      title="请输入验证码"
      width={480}
      zIndex={2000}
      footer={[]}
      centered
      forceRender
      destroyOnClose
      maskClosable={false}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className="verify-modal">
        <Spin spinning={loading} tip="校验中">
          <div className="modal-body">
            <div className="modal-tip">
              已发送6位验证码至 <a>xxxxxxx</a>
            </div>
            <div className="number-input">{renderInput()}</div>
          </div>
          <div className="modal-footer">
            <Button shape="round" type="primary">
              重新发送
            </Button>
          </div>
        </Spin>
      </div>
    </Modal>
  );
};

export default TestVerifyInput;
