import React, { useState } from 'react';
import { Form, Input, Row, Space, Typography } from 'antd';
import Button from '@components/Button';
import { forgotPassAPI } from '@api/services/authAPI';
import { useForm } from 'antd/lib/form/Form';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import Layout from '@components/Layout';

const ForgotPass = () => {
  const { Text, Title } = Typography;
  const [forgotPass] = useForm();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (values) => {
    setLoading(true);
    forgotPassAPI(values.email)
      .then(() => {
        navigate({
          pathname: findRoutePath('checkEmail'),
          search: createSearchParams({ email: values.email }).toString(),
        });
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
    <Layout>
      <Row justify='center' style={{ marginTop: 50, padding: 20 }}>
        <div style={{ width: 500 }}>
          <Form
            name='forgotPass'
            form={forgotPass}
            layout='vertical'
            onFinish={handleSubmit}
          >
            <Space
              direction='vertical'
              size={20}
              style={{ textAlign: 'center' }}
            >
              <Title level={4} className='color-primary'>
                Forgot Password
              </Title>
              <Text>
                Please enter your email address below and we will send you
                further insturctions on how to reset your password.
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
        </div>
      </Row>
    </Layout>
  );
};

export default ForgotPass;
