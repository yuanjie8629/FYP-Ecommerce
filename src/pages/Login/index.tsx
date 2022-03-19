import React, { useContext, useState } from 'react';
import { Alert, Form, Input, Row, Space, Typography } from 'antd';
import Button from '@components/Button';
import { useForm } from 'antd/lib/form/Form';
import { loginAPI } from '@api/services/authAPI';
import Layout from '@components/Layout';
import './Login.less';
import { useNavigate } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import { MessageContext } from '@contexts/MessageContext';
import { clearCart } from '@utils/storageUtils';

const Login = () => {
  const { Text, Title } = Typography;
  const [loginForm] = useForm();
  const [loading, setLoading] = useState(false);
  const [loginErr, setLoginErr] = useState<React.ReactNode>();
  const [messageApi] = useContext(MessageContext);
  const navigate = useNavigate();
  const handleLogin = async (values) => {
    setLoading(true);
    await loginAPI({
      email: values.email,
      password: values.password,
    })
      .then((res) => {
        messageApi.open({
          key: 'successLogin',
          type: 'success',
          content: 'You have successfully login.',
        });
        clearCart();
        navigate(findRoutePath('home'));
      })
      .catch((e) => {
        if (e.response?.status === 401) {
          setLoginErr('Invalid username or password. Please try again.');
        } else {
          messageApi.open({
            key: 'err',
            type: 'error',
            content: 'Something went wrong. Please try again.',
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Layout>
      <Row justify='center' style={{ marginTop: 50, padding: 20 }}>
        <div style={{ width: 500 }}>
          <Form
            name='loginForm'
            form={loginForm}
            layout='vertical'
            onFinish={handleLogin}
          >
            <Space
              direction='vertical'
              size={20}
              style={{ textAlign: 'center' }}
              className='full-width'
            >
              <Title level={4}>Login</Title>
              {loginErr && (
                <Alert
                  message={<Text type='danger'>{loginErr}</Text>}
                  type='error'
                  showIcon
                />
              )}
              <div>
                <Space
                  direction='vertical'
                  style={{ textAlign: 'center' }}
                  className='full-width'
                >
                  <Form.Item
                    name='email'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter your email.',
                        whitespace: true,
                      },
                    ]}
                  >
                    <Input size='large' placeholder='Email' type='email' />
                  </Form.Item>
                  <Form.Item
                    name='password'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter your password.',
                      },
                    ]}
                  >
                    <Input.Password size='large' placeholder='Password' />
                  </Form.Item>
                </Space>
              </div>

              <Button htmlType='submit' type='primary' block loading={loading}>
                Login
              </Button>

              <Button
                type='link'
                color='info'
                className='login-right-align'
                onClick={() => {
                  navigate(findRoutePath('forgotPass'));
                }}
              >
                Forgot Password
              </Button>
            </Space>
          </Form>
        </div>
      </Row>
    </Layout>
  );
};

export default Login;
