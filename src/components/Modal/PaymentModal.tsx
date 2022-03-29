import { Modal, ModalProps, Space, Spin, Typography } from 'antd';

const PaymentModal = (props: ModalProps) => {
  const { Text } = Typography;
  return (
    <Modal
      footer={null}
      closable={false}
      maskClosable={false}
      centered
      width={220}
      {...props}
    >
      <Space direction='vertical' className='full-width center-flex'>
        <Spin spinning />
        <Text>Redirecting to payment...</Text>
      </Space>
    </Modal>
  );
};

export default PaymentModal;
