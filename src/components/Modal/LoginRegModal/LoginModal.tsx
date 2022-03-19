import React, { memo, useContext, useState } from 'react';
import { Alert, Form, Input, Space, Typography } from 'antd';
import Button from '@components/Button';
import { LoginRegModalContentProps } from '.';
import { useForm } from 'antd/lib/form/Form';
import { loginAPI } from '@api/services/authAPI';
import AuthModal from '../AuthModal';
import { MessageContext } from '@contexts/MessageContext';

const LoginModal = memo(
  ({ onOk, onCancel, onSubmit, ...props }: LoginRegModalContentProps, _ref) => {
    const { Text, Title } = Typography;
    const [loginForm] = useForm();
    const [loading, setLoading] = useState(false);
    const [loginErr, setLoginErr] = useState<React.ReactNode>();
    const [messageApi] = useContext(MessageContext)

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
          onSubmit(true);
        })
        .catch((e) => {
          onSubmit(false);
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
          {loginErr && (
            <Alert
              message={<Text type='danger'>{loginErr}</Text>}
              type='error'
              showIcon
            />
          )}
          <Button htmlType='submit' type='primary' block loading={loading}>
            Login
          </Button>

          <Button
            type='link'
            color='info'
            className='login-right-align'
            onClick={() => {
              AuthModal.show('forgotPass');
            }}
          >
            Forgot Password
          </Button>
        </Space>
        <AuthModal />
      </Form>
    );
  }
);

export default LoginModal;
