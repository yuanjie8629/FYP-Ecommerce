import { orderSearchAPI } from '@api/services/orderAPI';
import Button from '@components/Button';
import Layout from '@components/Layout';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { Alert, Form, Grid, Input, Row, Space, Typography } from 'antd';
import { useContext, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';

const OrderSearch = () => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [messageApi] = useContext(MessageContext);

  const handleOrderSearch = (values) => {
    setLoading(true);
    orderSearchAPI(values.email, values.id)
      .then((res) => {
        setInvalid(false);
        setLoading(false);
        navigate({
          pathname: `/order/${values.id}`,
          search: createSearchParams({ email: values.email }).toString(),
        });
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          if (err.response?.status === 404) {
            setInvalid(true);
            setLoading(false);
            return;
          }
          setLoading(false);
          showServerErrMsg();
        }
      });
  };

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  return (
    <Layout>
      <Row justify='center' style={{ padding: 20 }}>
        <Space
          direction='vertical'
          style={{
            marginTop: 50,
            width: screens.md ? 500 : '90%',
            textAlign: 'center',
          }}
          size={50}
          className='full-width'
        >
          <Title level={screens.md ? 3 : 5}>Search Order</Title>
          <Form
            name='searchOrderForm'
            onFinish={handleOrderSearch}
            style={{ textAlign: 'start' }}
          >
            <Space direction='vertical' size={20} className='full-width'>
              {invalid && (
                <Alert
                  type='error'
                  showIcon
                  message={
                    <Text type='danger'>Invalid Order ID or Email.</Text>
                  }
                />
              )}
              <Form.Item
                name='id'
                rules={[
                  {
                    required: true,
                    message: 'Please enter the order ID sent to your email.',
                  },
                ]}
              >
                <Input placeholder='Order ID' />
              </Form.Item>
              <Form.Item
                name='email'
                rules={[
                  {
                    required: true,
                    message:
                      'Please enter the email address entered when placing the order.',
                  },
                ]}
              >
                <Input type='email' placeholder='Email' />
              </Form.Item>
              <Button type='primary' block htmlType='submit' loading={loading}>
                Search
              </Button>
            </Space>
          </Form>
        </Space>
      </Row>
    </Layout>
  );
};

export default OrderSearch;
