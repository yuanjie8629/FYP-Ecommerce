import React, { useState } from 'react';
import { Alert, Col, Form, Input, message, Row, Space, Typography } from 'antd';
import Button from '@components/Button';
import { useForm } from 'antd/lib/form/Form';
import { registerAPI } from '@api/services/authAPI';
import { MdCancel, MdCheckCircle } from 'react-icons/md';
import { IconBaseProps } from 'react-icons/lib';
import ColorCard from '@components/Card/ColorCard';
import {
  checkLength,
  hasDigit,
  hasLowerCaseLetter,
  hasSymbolLetter,
  hasUpperCaseLetter,
} from '@utils/strUtils';
import Layout from '@components/Layout';

const Register = () => {
  const { Text, Title } = Typography;
  const [registerForm] = useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [hasNumberic, setHasNumeric] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasSymbol, setHasSymbol] = useState(false);
  const [passInRange, setPassInRange] = useState(false);
  const [errMsg, setErrMsg] = useState([]);
  const [sameEmailMsg, setSameEmailMsg] = useState('');

  const passValidation = [
    {
      code: 'password_length_validation',
      message: '8 to 16 characters',
      validation: passInRange,
    },
    {
      code: 'password_no_number',
      message: 'At least 1 digit',
      validation: hasNumberic,
    },
    {
      code: 'password_no_upper',
      message: 'At least 1 uppercase letter',
      validation: hasUpperCase,
    },
    {
      code: 'password_no_lower',
      message: 'At least 1 lowercase letter',
      validation: hasLowerCase,
    },
    {
      code: 'password_no_symbol',
      message: 'At least 1 symbol',
      validation: hasSymbol,
    },
  ];

  const Icon = ({ match, ...props }: IconBaseProps & { match: boolean }) =>
    match ? (
      <MdCheckCircle className='color-success' />
    ) : (
      <MdCancel className='color-error' />
    );

  interface PassCriteriaListProps {
    errMsg: string;
    validation: boolean;
  }

  const PassCriteriaList = ({ errMsg, validation }: PassCriteriaListProps) => {
    return (
      <Row align='middle' gutter={5}>
        <Col className='center-flex'>
          <Icon match={validation} />
        </Col>
        <Col>
          <Text>{errMsg}</Text>
        </Col>
      </Row>
    );
  };

  const handleRegister = async (values) => {
    setLoading(true);
    await registerAPI({
      email: values.email,
      password: values.password,
      password2: values.confirmPass,
    })
      .then((res) => {
        messageApi.open({
          key: 'successRegister',
          type: 'success',
          content: 'You have successfully register.',
        });
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          if (err.response?.data?.email)
            setSameEmailMsg(
              'The email already exists. Please log in with the email.'
            );
          if (err.response?.data?.password)
            setErrMsg(err.response?.data?.password);
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
            name='registerForm'
            form={registerForm}
            layout='vertical'
            onFinish={handleRegister}
          >
            {contextHolder}
            <Space
              direction='vertical'
              size={20}
              style={{ textAlign: 'center' }}
              className='full-width'
            >
              <Title level={4} className='color-primary'>
                Registration
              </Title>
              {sameEmailMsg && (
                <Alert
                  message={<Text type='danger'>{sameEmailMsg}</Text>}
                  type='error'
                  showIcon
                  style={{ textAlign: 'start' }}
                />
              )}
              <ColorCard
                backgroundColor='grey'
                bodyStyle={{ padding: 15, textAlign: 'start' }}
              >
                <Space direction='vertical' size={0}>
                  <Text>
                    Your password must fulfill the following criteria:
                  </Text>
                  {passValidation.map((err, index) => (
                    <PassCriteriaList
                      key={`passCriteriaList-${index}`}
                      errMsg={err.message}
                      validation={err.validation}
                    />
                  ))}
                </Space>
              </ColorCard>
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
                    <Input placeholder='Email' type='email' />
                  </Form.Item>
                  <Form.Item
                    name='password'
                    rules={[
                      {
                        required: true,
                        validator: (_, value) => {
                          if (value.trim() === '')
                            return Promise.reject(
                              new Error('Please enter your password.')
                            );

                          if (
                            !(
                              hasNumberic &&
                              hasUpperCase &&
                              hasLowerCase &&
                              hasSymbol
                            )
                          ) {
                            return Promise.reject(
                              new Error(
                                'The password must follow the criteria above.'
                              )
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                    validateStatus={errMsg.length > 0 && 'error'}
                    help={errMsg.map((errMsg) => (
                      <ul className='text-sm'>
                        <li style={{ textAlign: 'justify' }}>{errMsg}</li>
                      </ul>
                    ))}
                  >
                    <Input.Password
                      placeholder='Password'
                      maxLength={16}
                      onChange={(e) => {
                        const pass = e.target.value.trim();
                        registerForm.setFieldsValue({
                          password: pass,
                        });
                        if (hasDigit(pass)) setHasNumeric(true);
                        else setHasNumeric(false);
                        if (hasUpperCaseLetter(pass)) setHasUpperCase(true);
                        else setHasUpperCase(false);
                        if (hasLowerCaseLetter(pass)) setHasLowerCase(true);
                        else setHasLowerCase(false);
                        if (hasSymbolLetter(pass)) setHasSymbol(true);
                        else setHasSymbol(false);
                        if (checkLength(pass, 8, 16)) setPassInRange(true);
                        else setPassInRange(false);
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name='confirmPass'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter again the password entered.',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error('Password must be the same.')
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder='Confirm Password'
                      maxLength={16}
                    />
                  </Form.Item>
                </Space>
              </div>
              <Button htmlType='submit' type='primary' block loading={loading}>
                Register
              </Button>
            </Space>
          </Form>
        </div>
      </Row>
    </Layout>
  );
};

export default Register;
