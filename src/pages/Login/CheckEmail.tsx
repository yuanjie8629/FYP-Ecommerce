import React from 'react';
import { Row, Space, Typography } from 'antd';
import Button from '@components/Button';
import EmailSuccess from '@assets/Login/emailSuccess.png';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import Layout from '@components/Layout';

const CheckEmail = () => {
  const { Text, Title } = Typography;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  return (
    <Layout>
      <Row justify='center' style={{ marginTop: 50, padding: 20 }}>
        <div style={{ width: 500 }}>
          <Space
            direction='vertical'
            size={20}
            align='center'
            style={{ textAlign: 'center' }}
            className='full-width'
          >
            <img src={EmailSuccess} alt='emailSuccess' width={120} />
            <Title level={5}>Check Your Email</Title>
            <Text>
              An email has been sent to the email address
              {searchParams.has('email') && (
                <>
                  ,{' '}
                  <Text className='color-primary'>
                    {searchParams.get('email')}
                  </Text>
                </>
              )}
              .
              <br />
              Please check and verify it.
            </Text>
            <Button
              htmlType='submit'
              type='primary'
              onClick={() => {
                navigate(findRoutePath('home'));
              }}
            >
              Got it
            </Button>
          </Space>
        </div>
      </Row>
    </Layout>
  );
};

export default CheckEmail;
