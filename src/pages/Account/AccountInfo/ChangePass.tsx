import { Col, Row, Form, Typography, Space, Input, Alert } from 'antd';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';
import ColorCard from '@components/Card/ColorCard';
import { useContext, useState } from 'react';
import { MdCancel, MdCheckCircle } from 'react-icons/md';
import { IconBaseProps } from 'react-icons';
import { useForm } from 'antd/lib/form/Form';
import {
  checkLength,
  hasDigit,
  hasLowerCaseLetter,
  hasSymbolLetter,
  hasUpperCaseLetter,
} from '@utils/strUtils';
import { changePassAPI } from '@api/services/authAPI';
import SuccessModal from '@components/Modal/SuccessModal';
import { removeInvalidData } from '@utils/arrayUtils';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import Layout from '@components/Layout';

const ChangePass = () => {
  const { Text, Title } = Typography;
  const navigate = useNavigate();
  const [changePassForm] = useForm();
  const [hasNumberic, setHasNumeric] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasSymbol, setHasSymbol] = useState(false);
  const [passInRange, setPassInRange] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [newPassErrMsg, setNewPassErrMsg] = useState([]);
  const [passErrMsg, setPassErrMsg] = useState('');
  const [messageApi] = useContext(MessageContext);

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

  const handleChangePass = (values) => {
    console.log(values);
    values = removeInvalidData(values);
    setSubmitLoading(true);
    changePassAPI(values)
      .then((res) => {
        setSuccessModal(true);
        setSubmitLoading(false);
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          if (err.response?.status === 400) {
            if (err.response?.data?.error === 'invalid_password') {
              setPassErrMsg('The password entered is invalid');
              setSubmitLoading(false);
              return;
            }
            if (err.response?.data?.password) {
              setNewPassErrMsg(err.response?.data?.password);
            }
            return;
          }
          setSubmitLoading(false);
          showServerErrMsg();
        }
      });
  };

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
    setTimeout(() => messageApi.destroy(), 5000);
  };

  return (
    <Layout>
      <Row justify='center' style={{ marginTop: 50, padding: 20 }}>
        <div style={{ width: 500 }}>
          <Space direction='vertical' size={20} className='full-width'>
            <Title level={4} className='center-flex'>
              Change Password
            </Title>
            {passErrMsg && (
              <Alert
                message={<Text type='danger'>{passErrMsg}</Text>}
                type='error'
                showIcon
              />
            )}

            <ColorCard backgroundColor='grey' bodyStyle={{ padding: 15 }}>
              <Space direction='vertical' size={0}>
                <Text>Your password must fulfill the following criteria:</Text>
                {passValidation.map((err, index) => (
                  <PassCriteriaList
                    key={`passCriteriaList-${index}`}
                    errMsg={err.message}
                    validation={err.validation}
                  />
                ))}
              </Space>
            </ColorCard>
            <Form
              name='changePass'
              form={changePassForm}
              layout='vertical'
              onFinish={handleChangePass}
            >
              <Space direction='vertical' size={10} className='full-width'>
                <Form.Item
                  name='password'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your password to update.',
                    },
                  ]}
                >
                  <Input.Password
                    placeholder='Old Password'
                    onChange={() => {
                      setPassErrMsg('');
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name='new_password'
                  rules={[
                    {
                      required: true,
                      validator: (_, value) => {
                        if (value.trim() === '')
                          return Promise.reject(
                            new Error('Please enter new password.')
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
                  validateStatus={newPassErrMsg.length > 0 && 'error'}
                  help={newPassErrMsg.map((errMsg) => (
                    <ul className='text-sm'>
                      <li style={{ textAlign: 'justify' }}>{errMsg}</li>
                    </ul>
                  ))}
                >
                  <Input.Password
                    placeholder='New Password'
                    maxLength={16}
                    onChange={(e) => {
                      const pass = e.target.value.trim();
                      changePassForm.setFieldsValue({
                        new_password: pass,
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
                  name='confirm_pass'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter again the password entered.',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('new_password') === value) {
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
                    placeholder='Confirm New Password'
                    maxLength={16}
                  />
                </Form.Item>
                <Button
                  htmlType='submit'
                  type='primary'
                  block
                  loading={submitLoading}
                >
                  Reset Password
                </Button>
              </Space>
            </Form>
          </Space>

          <SuccessModal
            visible={successModal}
            title={<Title level={5}>Change Password Successful</Title>}
            subTitle={
              <Text type='secondary' className='text-sm'>
                You can now use the new password to login your account.
              </Text>
            }
            extra={[
              <Button type='primary' onClick={() => navigate('/')}>
                Got it
              </Button>,
            ]}
          />
        </div>
      </Row>
    </Layout>
  );
};

export default ChangePass;
