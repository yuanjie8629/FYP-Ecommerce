import { Modal, ModalProps, Result } from 'antd';
import { useState } from 'react';

interface ErrorModalProps extends ModalProps {
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  extra?: React.ReactNode;
}

const ErrorModal = ({
  title,
  subTitle,
  extra,
  visible,
  onOk,
  onCancel,
  ...props
}: ErrorModalProps) => {
  const [showModal, setShowModal] = useState(visible);

  const handleClose = () => {
    setShowModal(false);
  };
  return (
    <Modal
      visible={showModal || visible}
      onOk={handleClose}
      onCancel={handleClose}
      footer={null}
      closable={false}
      maskClosable={false}
      centered
      {...props}
    >
      <Result status='error' title={title} subTitle={subTitle} extra={extra} />
    </Modal>
  );
};

export default ErrorModal;
