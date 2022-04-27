import { postcodeListAPI } from '@api/services/addressAPI';
import { posRegAPI } from '@api/services/custAPI';
import Button from '@components/Button';
import ColorCard from '@components/Card/ColorCard';
import Layout from '@components/Layout';
import ResultModal from '@components/Modal/ResultModal';
import SpinCircle from '@components/Spin/SpinCircle';
import { MessageContext } from '@contexts/MessageContext';
import { getCities, getPostcodes, getStates } from '@utils/addressUtils';
import { removeInvalidData, sortByOrder } from '@utils/arrayUtils';
import { getDt } from '@utils/dateUtils';
import { serverErrMsg } from '@utils/messageUtils';
import { custPositionCat, genderCat, maritalStatCat } from '@utils/optionUtils';
import {
  Col,
  DatePicker,
  Form,
  Grid,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import Checkbox from 'antd/es/checkbox';
import { useForm } from 'antd/es/form/Form';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PosReg = () => {
  const { Text, Title } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [posRegForm] = useForm();
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [messageApi] = useContext(MessageContext);
  const [successMsg, setSuccessMsg] = useState(false);
  const [pendingMsg, setPendingMsg] = useState(false);
  const [errMsg, setErrMsg] = useState({ type: undefined, message: undefined });

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    postcodeListAPI()
      .then((res) => {
        if (isMounted) {
          setPostcode(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setLoading(false);
          showServerErrMsg();
        }
      });
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const showErrMsg = (errMsg?: string) => {
    messageApi.open({ type: 'error', content: errMsg });
  };

  const handleSubmit = (values) => {
    let { city, state, ...data } = values;
    data.birthdate = getDt(data.birthdate);
    data = removeInvalidData(data);
    setSubmitLoading(true);
    posRegAPI(data)
      .then((res) => {
        setSubmitLoading(false);
        setSuccessMsg(true);
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setSubmitLoading(false);
          if (err.response?.data?.error?.code === 'duplicate_email') {
            setErrMsg({
              type: 'duplicate_email',
              message: err.response?.data?.error?.message,
            });
            showErrMsg(err.response?.data?.error?.message);
          } else if (err.response?.data?.error?.code === 'pending') {
            setPendingMsg(true);
          } else {
            showServerErrMsg();
          }
        }
      });
  };

  return (
    <Layout>
      <Row justify='center' style={{ padding: '20px 40px' }}>
        <Space
          direction='vertical'
          align='center'
          style={{ marginTop: 50, width: 500 }}
          size={30}
        >
          <Title level={screens.md ? 4 : 5}>
            Agent/Dropshipper Registration Form
          </Title>
          <Form
            name='posRegForm'
            layout='vertical'
            onFinish={handleSubmit}
            scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
            form={posRegForm}
          >
            <Space
              direction='vertical'
              size={40}
              style={{ textAlign: 'justify' }}
              className='full-width'
            >
              <ColorCard backgroundColor='grey'>
                <Space direction='vertical' size={20} className='full-width'>
                  <Text strong className='text-lg'>
                    1. Basic Information
                  </Text>
                  <Space direction='vertical' size={5} className='full-width'>
                    <Form.Item
                      label='Customer Name'
                      name='name'
                      rules={[
                        {
                          required: true,
                          message: 'Please enter the customer name.',
                        },
                      ]}
                    >
                      <Input placeholder='e.g. Tan Yuan Jie' />
                    </Form.Item>

                    <Form.Item
                      label='Gender'
                      name='gender'
                      rules={[
                        {
                          required: true,
                          message: 'Please select the customer gender.',
                        },
                      ]}
                    >
                      <Radio.Group options={genderCat} />
                    </Form.Item>
                    <Form.Item
                      label='Birthdate'
                      name='birthdate'
                      rules={[
                        {
                          required: true,
                          message: 'Please select the customer birthdate.',
                        },
                      ]}
                    >
                      <DatePicker className='full-width' />
                    </Form.Item>

                    <Form.Item
                      label='Marital Status'
                      name='marital_status'
                      rules={[
                        {
                          required: true,
                          message: 'Please enter your marital status.',
                        },
                      ]}
                    >
                      <Radio.Group options={maritalStatCat} />
                    </Form.Item>
                  </Space>
                </Space>
              </ColorCard>
              <ColorCard backgroundColor='grey'>
                <Space direction='vertical' size={20} className='full-width'>
                  <Text strong className='text-lg'>
                    2. Contact Information
                  </Text>
                  <Space direction='vertical' size={5} className='full-width'>
                    <Form.Item
                      label='Phone Number'
                      name='phone_num'
                      rules={[
                        {
                          required: true,
                          message: 'Please enter your phone number.',
                        },
                      ]}
                    >
                      <Input placeholder='eg. 0123456789' />
                    </Form.Item>

                    <Form.Item
                      label='Email Address'
                      name='email'
                      validateStatus={
                        errMsg.type === 'duplicate_email' ? 'error' : undefined
                      }
                      help={
                        errMsg.type === 'duplicate_email'
                          ? errMsg.message
                          : undefined
                      }
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value) {
                              return Promise.reject(
                                "Please enter customer's email address."
                              );
                            }
                            if (errMsg.type === 'duplicate_email') {
                              return Promise.reject(errMsg.message);
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                      required
                    >
                      <Input
                        type='email'
                        placeholder='e.g. xxxxx@gmail.com'
                        onChange={(e) => {
                          setErrMsg({ type: undefined, message: undefined });
                        }}
                      />
                    </Form.Item>
                  </Space>
                </Space>
              </ColorCard>
              <ColorCard backgroundColor='grey'>
                <Space direction='vertical' size={20} className='full-width'>
                  <Text strong className='text-lg'>
                    3. Address
                  </Text>
                  <Space direction='vertical' size={5} className='full-width'>
                    <SpinCircle spinning={loading}>
                      <Form.Item
                        label='State'
                        name='state'
                        rules={[
                          {
                            required: true,
                            message: 'Please select your state.',
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          filterOption
                          placeholder='Please select the state'
                          onChange={(value: string) => {
                            setState(value);
                            posRegForm.resetFields(['city', 'postcode']);
                            setCity('');
                          }}
                        >
                          {sortByOrder(getStates(postcode)).map(
                            (state: string) => (
                              <Option key={state}>{state}</Option>
                            )
                          )}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label='City'
                        name='city'
                        rules={[
                          {
                            required: true,
                            message: 'Please select your city.',
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          filterOption
                          placeholder='Please select the city'
                          disabled={!state}
                          onChange={(value: string) => {
                            setCity(value);
                            posRegForm.resetFields(['postcode']);
                          }}
                        >
                          {sortByOrder(getCities(postcode, state)).map(
                            (city: string) => (
                              <Option key={city}>{city}</Option>
                            )
                          )}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label='Postal Code'
                        name='postcode'
                        rules={[
                          {
                            required: true,
                            message: 'Please select your postal code.',
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          filterOption
                          placeholder='Please select the postal code'
                          disabled={!state || !city}
                        >
                          {sortByOrder(getPostcodes(postcode, city)).map(
                            (postcode: string) => (
                              <Option value={postcode} key={postcode}>
                                {postcode}
                              </Option>
                            )
                          )}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label='Address'
                        name='address'
                        rules={[
                          {
                            required: true,
                            message: 'Please enter your address.',
                          },
                        ]}
                      >
                        <TextArea
                          rows={4}
                          placeholder='Please enter address'
                          showCount
                          maxLength={128}
                          autoSize={{ minRows: 4, maxRows: 12 }}
                        />
                      </Form.Item>
                    </SpinCircle>
                  </Space>
                </Space>
              </ColorCard>
              <ColorCard backgroundColor='grey'>
                <Space direction='vertical' size={20} className='full-width'>
                  <Text strong className='text-lg'>
                    4. Employment Details
                  </Text>
                  <Space direction='vertical' size={5} className='full-width'>
                    <Form.Item
                      label='Current Occupation'
                      name='occupation'
                      rules={[
                        {
                          required: true,
                          message: 'Please enter your current occupation.',
                        },
                      ]}
                    >
                      <Input placeholder='e.g. Marketing Manager' />
                    </Form.Item>
                    <Form.Item label='Company Name' name='company'>
                      <Input placeholder='e.g. SHRF Food Industries Sdn Bhd' />
                    </Form.Item>
                  </Space>
                </Space>
              </ColorCard>
              <ColorCard backgroundColor='grey'>
                <Space direction='vertical' size={20} className='full-width'>
                  <Text strong className='text-lg'>
                    5. Position
                  </Text>
                  <Space direction='vertical' size={5} className='full-width'>
                    <Form.Item
                      name='position'
                      rules={[
                        {
                          required: true,
                          message: 'Please select your position.',
                        },
                      ]}
                    >
                      <Radio.Group options={custPositionCat} />
                    </Form.Item>
                  </Space>
                </Space>
              </ColorCard>
              <Form.Item
                name='declaration'
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject(
                          'Please confirm your declaration.'
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                valuePropName='checked'
              >
                <Checkbox>
                  <Text>
                    DECLARATION
                    <br />I hereby declare that the information provided is true
                    and correct. I also understand that any willful dishonesty
                    may render for refusal of this application or immediate
                    termination of employment.
                  </Text>
                </Checkbox>
              </Form.Item>
              <Row justify='end'>
                <Col>
                  <Button
                    type='primary'
                    htmlType='submit'
                    loading={submitLoading}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </Space>
          </Form>
        </Space>
      </Row>
      <ResultModal
        visible={successMsg || pendingMsg}
        status={successMsg ? 'success' : 'info'}
        title={
          <Title level={5}>
            {successMsg
              ? 'We have received your application.'
              : 'You have applied for the registration before.'}
          </Title>
        }
        subTitle={
          <Text type='secondary' className='text-sm'>
            {successMsg
              ? 'Our team will review your application and get back to you soon.'
              : 'Our team are yet to review your application, we will get back to you soon once reviewed.'}
          </Text>
        }
        extra={[
          <Button
            type='primary'
            onClick={() => {
              navigate('/');
            }}
          >
            Got it
          </Button>,
        ]}
      />
    </Layout>
  );
};

export default PosReg;
