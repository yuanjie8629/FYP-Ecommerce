import { addressDefaultAPI } from '@api/services/addressAPI';
import Button from '@components/Button';
import AddressCard, { AddressInfo } from '@components/Card/AddressCard';
import MainCard from '@components/Card/MainCard';
import Layout from '@components/Layout';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { getUserId } from '@utils/storageUtils';
import { Col, Row, Space, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import OrderSummary from './Order Summary';
import ShippingAddress from './ShippingAddress';

const Checkout = () => {
  const { Text, Title } = Typography;

  const [messageApi] = useContext(MessageContext);
  const [address, setAddress] = useState<AddressInfo>();

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
    setTimeout(() => messageApi.destroy(), 5000);
  };

  return (
    <Layout>
      <Space
        direction='vertical'
        size={20}
        className='full-width'
        style={{ padding: 20 }}
      >
        <Row gutter={[20, 20]}>
          <Col xs={24} md={12}>
            <ShippingAddress
              onSave={(address) => {
                setAddress(address);
              }}
            />
          </Col>
          <Col xs={24} md={12}>
            <div>
              <OrderSummary />
            </div>
          </Col>
        </Row>
      </Space>
    </Layout>
  );
};

export default Checkout;
