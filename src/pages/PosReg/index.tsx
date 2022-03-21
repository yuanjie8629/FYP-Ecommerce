import { postcodeListAPI } from '@api/services/addressAPI';
import Button from '@components/Button';
import Layout from '@components/Layout';
import SpinCircle from '@components/Spin/SpinCircle';
import { MessageContext } from '@contexts/MessageContext';
import { getCities, getPostcodes, getStates } from '@utils/addressUtils';
import { sortByOrder } from '@utils/arrayUtils';
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
  const [messageApi] = useContext(MessageContext);

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
    setTimeout(() => messageApi.destroy(), 5000);
  };

  return (
    <Layout>
      <Row justify='center' style={{ padding: '20px 80px' }}>
        <Space
          direction='vertical'
          align='center'
          style={{ marginTop: 50, width: 500 }}
          size={30}
        >
          <Title level={screens.md ? 4 : 5}>
            Agent/Dropshipper Registration Form
          </Title>
          <Form name='posRegForm' layout='vertical'>
            <Space
              direction='vertical'
              size={15}
              style={{ textAlign: 'justify' }}
              className='full-width'
            >
              <Space direction='vertical' size={15} className='full-width'>
                <Text strong className='text-lg'>
                  Basic Information
                </Text>
                <Form.Item
                  label='Customer Name'
                  name='custNm'
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

                <Form.Item label='Marital Status' name='maritalStat'>
                  <Radio.Group options={maritalStatCat} />
                </Form.Item>
              </Space>
              <Space direction='vertical' size={15} className='full-width'>
                <Text strong className='text-lg'>
                  Contact Information
                </Text>
                <Form.Item
                  label='Phone Number'
                  name='phoneNum'
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
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your email address.',
                    },
                  ]}
                >
                  <Input type='email' placeholder='e.g. xxxxx@gmail.com' />
                </Form.Item>
              </Space>
              <Space direction='vertical' size={15} className='full-width'>
                <Text strong className='text-lg'>
                  Emergency Contact
                </Text>
                <Form.Item
                  label='Name'
                  name='emerg'
                  rules={[
                    {
                      required: true,
                      message:
                        'Please enter the name of the emergency contact.',
                    },
                  ]}
                >
                  <Input placeholder='e.g. Loo Phaik Cheng' />
                </Form.Item>
                <Form.Item
                  label='Relationship'
                  name='relationship'
                  rules={[
                    {
                      required: true,
                      message:
                        'Please justify the relationship with the emergency contact.',
                    },
                  ]}
                >
                  <Input placeholder='e.g. Mother' />
                </Form.Item>
                <Form.Item
                  label='Contact Number'
                  name='emrgContact'
                  rules={[
                    {
                      required: true,
                      message:
                        'Please provide the contact number of the emergency contact.',
                    },
                  ]}
                >
                  <Input placeholder='eg. 0123456789' />
                </Form.Item>
              </Space>
              <Space direction='vertical' size={15} className='full-width'>
                <Text strong className='text-lg'>
                  Address
                </Text>
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
                      placeholder='Please select the state'
                      onChange={(value: string) => {
                        setState(value);
                        posRegForm.resetFields(['city', 'postcode']);
                        setCity('');
                      }}
                    >
                      {sortByOrder(getStates(postcode)).map((state: string) => (
                        <Option key={state}>{state}</Option>
                      ))}
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
                </SpinCircle>
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
              </Space>
              <Space direction='vertical' size={15} className='full-width'>
                <Text strong className='text-lg'>
                  Employment Details
                </Text>
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
              <Space direction='vertical' size={15} className='full-width'>
                <Text strong className='text-lg'>
                  Position
                </Text>
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
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your declaration.',
                  },
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
                  <Button type='primary' htmlType='submit'>
                    Submit
                  </Button>
                </Col>
              </Row>
            </Space>
          </Form>
        </Space>
      </Row>
    </Layout>
  );
};

export default PosReg;
