import Button from '@components/Button';
import Layout from '@components/Layout';
import { findRoutePath } from '@utils/routingUtils';
import { Result, Row, Typography } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const RegisterSuccess = () => {
  const { Title } = Typography;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { Text } = Typography;
  useEffect(() => {
    if (!searchParams.has('email')) {
      console.log('gg');
      navigate('home');
    }
  }, [navigate, searchParams]);

  return (
    <Layout>
      <Row justify='center' style={{ marginTop: 50, padding: 20 }}>
        <div style={{ width: 500 }}>
          <Result
            status='success'
            title={<Title level={5}>You have successfully registered.</Title>}
            subTitle={
              <Text type='secondary'>
                You can now login with{' '}
                <Text strong className='color-info'>
                  {searchParams.get('email')}
                </Text>
              </Text>
            }
            extra={
              <Button
                type='primary'
                style={{ width: '70%' }}
                onClick={() => {
                  navigate(findRoutePath('login'));
                }}
              >
                Login
              </Button>
            }
          />
        </div>
      </Row>
    </Layout>
  );
};

export default RegisterSuccess;
