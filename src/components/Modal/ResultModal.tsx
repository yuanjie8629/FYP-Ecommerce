import { Modal, ModalProps, Result } from 'antd';
import { ResultStatusType } from 'antd/es/result';
import { useState } from 'react';

interface ResultModalProps extends ModalProps {
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  extra?: React.ReactNode;
  status?: ResultStatusType;
}

const ResultModal = ({
  title,
  subTitle,
  extra,
  visible,
  status = 'success',
  onOk,
  onCancel,
  ...props
}: ResultModalProps) => {
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
      <Result status={status} title={title} subTitle={subTitle} extra={extra} />
    </Modal>
  );
};

export default ResultModal;
