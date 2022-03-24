import React, { useState } from 'react';
import { DrawerProps, Form, Input, Space, Typography } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import Button from '@components/Button';
import { forgotPassAPI } from '@api/services/authAPI';
import { useForm } from 'antd/lib/form/Form';
import LoginDrawer from './LoginDrawer';
import CheckEmail from './CheckEmail';

interface ForgotPassProps extends DrawerProps {
  onBack?: () => void;
}

const ForgotPass = ({ onBack = () => null, ...props }: ForgotPassProps) => {
  const { Text } = Typography;
  const [forgotPass] = useForm();
  const [loading, setLoading] = useState(false);
  const [showCheckEmail, setShowCheckEmail] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const handleSubmit = (values) => {
    setLoading(true);
    forgotPassAPI(values.email)
      .then(() => {
        setShowCheckEmail(true);
      })
      .catch((err) => {
        if (err.response?.status === 400)
          setErrMsg(err.response?.data.email[0]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <LoginDrawer
      {...props}
      title='Forgot Password'
      closeIcon={
        <LeftOutlined
          className='color-grey'
          size={30}
          onClick={() => {
            props.onClose(null);
          }}
        />
      }
    >
      {!showCheckEmail ? (
        <Form
          name='forgotPass'
          form={forgotPass}
          layout='vertical'
          onFinish={handleSubmit}
        >
          <Space direction='vertical' size={20} style={{ textAlign: 'center' }}>
            <Text>
              Please enter your email address below and we will send you further
              insturctions on how to reset your password.
            </Text>
            <div>
              <Form.Item
                name='email'
                rules={[
                  {
                    required: true,
                    message: 'Please enter valid email address.',
                    type: 'email',
                  },
                ]}
                help={errMsg
                  .split('.')
                  .map((msg) => msg !== '' && <p>{`${msg}.`}</p>)}
                validateStatus={errMsg && 'error'}
              >
                <Input placeholder='Email address' style={{ width: '90%' }} />
              </Form.Item>
            </div>
            <Button htmlType='submit' type='primary' loading={loading}>
              Reset Password
            </Button>
          </Space>
        </Form>
      ) : (
        <CheckEmail
          email={forgotPass.getFieldValue('email')}
          onOk={() => {
            props.onClose(null);
            onBack();
          }}
        />
      )}
    </LoginDrawer>
  );
};

export default ForgotPass;
