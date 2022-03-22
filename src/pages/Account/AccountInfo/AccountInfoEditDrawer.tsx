import { accUpdAPI } from '@api/services/custAPI';
import Button from '@components/Button';
import SpinCircle from '@components/Spin/SpinCircle';
import { MessageContext } from '@contexts/MessageContext';
import { removeInvalidData } from '@utils/arrayUtils';
import { getDt } from '@utils/dateUtils';
import { serverErrMsg } from '@utils/messageUtils';
import { genderCat } from '@utils/optionUtils';
import {
  Alert,
  Col,
  DatePicker,
  Drawer,
  DrawerProps,
  Form,
  Grid,
  Input,
  Radio,
  Row,
  Space,
  Typography,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import moment from 'moment';
import { useContext, useState } from 'react';

interface AccountInfoEditProps extends DrawerProps {
  data?: any;
  loading?: boolean;
  onUpdate?: () => void;
}

const AccountInfoEditDrawer = ({
  data,
  loading,
  onUpdate = () => null,
  ...props
}: AccountInfoEditProps) => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [accountForm] = useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [messageApi] = useContext(MessageContext);

  const handleEditAcc = (values) => {
    if (values.birthdate) {
      values.birthdate = getDt(values.birthdate);
    }
    values = removeInvalidData(values);
    setSubmitLoading(true);
    accUpdAPI(values)
      .then((res) => {
        onUpdate();
        messageApi.open({
          key: 'accUpdSuccess',
          type: 'success',
          content: 'Your account information is updated.',
        });
        setSubmitLoading(false);
        setTimeout(() => messageApi.destroy(), 5000);
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          if (err.response?.data?.error === 'invalid_password') {
            setErrMsg('The password entered is invalid');
            setSubmitLoading(false);
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
    <Drawer closable={false} width={screens.md ? 500 : '100%'} {...props}>
      <Space direction='vertical' size={30} className='full-width'>
        <Row
          align='top'
          style={{ paddingBottom: 20, borderBottom: '1px solid #e5e7eb' }}
        >
          <Col span={1}>
            <CloseOutlined
              className='color-grey'
              size={30}
              onClick={() => {
                props.onClose(null);
              }}
            />
          </Col>
          <Col span={23} style={{ textAlign: 'center' }}>
            <Title level={5}>Edit Account Information</Title>
          </Col>
        </Row>
        <SpinCircle spinning={loading}>
          <Form
            form={accountForm}
            name='accountForm'
            layout='vertical'
            onFinish={handleEditAcc}
          >
            <Space direction='vertical' className='full-width'>
              {errMsg && (
                <Alert
                  message={<Text type='danger'>{errMsg}</Text>}
                  type='error'
                  showIcon
                />
              )}
              <Form.Item label='Email' name='email' initialValue={data.email}>
                <Input type='email' />
              </Form.Item>
              <Form.Item label='Name' name='name' initialValue={data.name}>
                <Input />
              </Form.Item>
              <Form.Item
                label='Birthdate'
                name='birthdate'
                initialValue={
                  data.birthdate && moment(data.birthdate, 'DD-MM-YYYY')
                }
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label='Gender'
                name='gender'
                initialValue={data.gender}
              >
                <Radio.Group options={genderCat} />
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
                <Input.Password
                  onChange={() => {
                    setErrMsg('');
                  }}
                />
              </Form.Item>

              <Row gutter={10} justify='end'>
                <Col>
                  <Button
                    disabled={submitLoading}
                    onClick={() => {
                      props.onClose(null);
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button
                    type='primary'
                    htmlType='submit'
                    loading={submitLoading}
                  >
                    Confirm
                  </Button>
                </Col>
              </Row>
            </Space>
          </Form>
        </SpinCircle>
      </Space>
    </Drawer>
  );
};

export default AccountInfoEditDrawer;
