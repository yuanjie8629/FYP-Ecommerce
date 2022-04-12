import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Divider,
  DrawerProps,
  Form,
  Input,
  Space,
  Typography,
} from 'antd';
import Button from '@components/Button';
import { useForm } from 'antd/lib/form/Form';
import { loginAPI } from '@api/services/authAPI';
import { MessageContext } from '@contexts/MessageContext';
import { clearCart } from '@utils/storageUtils';
import LoginDrawer from './LoginDrawer';
import ForgotPass from './ForgotPass';
import { useNavigate } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';

interface LoginProps extends DrawerProps {
  remind?: boolean;
  onRegister?: () => void;
  onShowMe?: () => void;
}

const Login = ({
  remind,
  onRegister = () => null,
  onShowMe = () => null,
  ...props
}: LoginProps) => {
  const { Text } = Typography;
  const [loginForm] = useForm();
  const [loading, setLoading] = useState(false);
  const [loginErr, setLoginErr] = useState<React.ReactNode>();
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [messageApi] = useContext(MessageContext);
  const navigate = useNavigate();

  useEffect(() => {
    loginForm.resetFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onClose]);

  const handleLogin = async (values) => {
    setLoading(true);
    await loginAPI({
      username: values.email,
      password: values.password,
    })
      .then((res) => {
        messageApi.open({
          type: 'success',
          content: 'You have successfully login.',
        });
        clearCart();
        props.onClose(null);
        navigate(findRoutePath('home'));
      })
      .catch((e) => {
        if (e.response?.status === 401) {
          setLoginErr('Invalid username or password. Please try again.');
        } else {
          messageApi.open({
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
    <>
      <LoginDrawer {...props} title='Login'>
        {remind && (
          <>
            <Button
              block
              size='large'
              style={{ height: 50 }}
              onClick={() => {
                navigate(findRoutePath('checkout'));
              }}
            >
              Order without logging in
            </Button>
            <Divider style={{ margin: 0 }} />
          </>
        )}
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
                  label='Email'
                  name='email'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your email.',
                      whitespace: true,
                    },
                  ]}
                >
                  <Input size='large' type='email' />
                </Form.Item>
                <Form.Item
                  label='Password'
                  name='password'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your password.',
                    },
                  ]}
                >
                  <Input.Password size='large' />
                </Form.Item>
              </Space>
            </div>

            <Button
              htmlType='submit'
              type='primary'
              size='large'
              block
              loading={loading}
              style={{ height: 50 }}
            >
              Login
            </Button>

            <Button
              type='link'
              color='info'
              onClick={() => {
                setShowForgotPass(true);
              }}
              size='large'
            >
              Forgot Password
            </Button>
          </Space>
        </Form>
        <Divider style={{ margin: '10px 0' }}>
          <Text type='secondary'>OR</Text>
        </Divider>
        <Button
          size='large'
          block
          onClick={() => {
            onRegister();
          }}
          style={{ height: 50 }}
        >
          Register
        </Button>
      </LoginDrawer>
      <ForgotPass
        visible={showForgotPass}
        onClose={() => {
          setShowForgotPass(false);
        }}
        onBack={() => {
          props.onClose(null);
        }}
      />
    </>
  );
};

export default Login;
