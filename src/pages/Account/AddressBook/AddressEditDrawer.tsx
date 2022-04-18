import { addressDelAPI, addressUpdAPI } from '@api/services/addressAPI';
import Button from '@components/Button';
import SpinCircle from '@components/Spin/SpinCircle';
import { MessageContext } from '@contexts/MessageContext';
import { getCities, getPostcodes, getStates } from '@utils/addressUtils';
import { removeInvalidData, sortByOrder } from '@utils/arrayUtils';
import { serverErrMsg } from '@utils/messageUtils';
import {
  Col,
  DrawerProps,
  Form,
  Grid,
  Input,
  Row,
  Select,
  Space,
  Switch,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useContext, useEffect, useState } from 'react';
import Drawer from '@components/Drawer';
interface AddressAddEditProps extends DrawerProps {
  data?: any;
  postcode?: any;
  loading?: boolean;
  onUpdate?: () => void;
}

const AddressEditDrawer = ({
  data,
  postcode,
  loading,
  onUpdate = () => null,
  ...props
}: AddressAddEditProps) => {
  const { TextArea } = Input;
  const { Option } = Select;
  const [addressForm] = useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [messageApi] = useContext(MessageContext);
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  useEffect(() => {
    setState(data?.postcode.state);
    setCity(data?.postcode.city);
  }, [data]);

  const handleAddAddress = (values) => {
    let { city, state, ...record } = values;
    record = removeInvalidData(record);
    setSubmitLoading(true);
    addressUpdAPI(data.id, record)
      .then((res) => {
        messageApi.open({
          type: 'success',
          content: 'Your address has been updated.',
        });
        setSubmitLoading(false);
        addressForm.resetFields();
        onUpdate();
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setSubmitLoading(false);
          showServerErrMsg();
        }
      });
  };

  const handleDeleteAddress = () => {
    setSubmitLoading(true);
    addressDelAPI(data.id)
      .then((res) => {
        messageApi.open({
          type: 'success',
          content: 'Your address has been deleted.',
        });
        setSubmitLoading(false);

        onUpdate();
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setSubmitLoading(false);
          showServerErrMsg();
        }
      });
  };

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  return (
    <Drawer
      title='Edit Address Information'
      width={screens.md ? 500 : '100%'}
      {...props}
    >
      <Space direction='vertical' size={30} className='full-width'>
        <SpinCircle spinning={loading || submitLoading}>
          <Form
            form={addressForm}
            name='addressForm'
            onFinish={handleAddAddress}
            labelCol={{ span: 6 }}
            labelAlign='left'
          >
            <Space direction='vertical' className='full-width'>
              <Form.Item
                label='Contact Name'
                name='contact_name'
                rules={[
                  {
                    required: true,
                    message: 'Please enter the contact name.',
                  },
                ]}
                initialValue={data?.contact_name}
              >
                <Input placeholder='Please enter the contact name' />
              </Form.Item>

              <Form.Item
                label='Contact Number'
                name='contact_num'
                rules={[
                  {
                    required: true,
                    message: 'Please enter the contact number.',
                  },
                ]}
                initialValue={data?.contact_num}
              >
                <Input placeholder='Please enter the contact number' />
              </Form.Item>

              <Form.Item
                label='State'
                name='state'
                rules={[
                  {
                    required: true,
                    message: 'Please select the state.',
                  },
                ]}
                initialValue={data?.postcode.state}
              >
                <Select
                  showSearch
                  filterOption
                  placeholder='Please select the state'
                  onChange={(value: string) => {
                    setState(value);
                    addressForm.setFieldsValue({ city: undefined });
                    addressForm.setFieldsValue({ postcode: undefined });

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
                    message: 'Please select the city.',
                  },
                ]}
                initialValue={data?.postcode.city}
              >
                <Select
                  showSearch
                  filterOption
                  placeholder='Please select the city'
                  disabled={!state}
                  onChange={(value: string) => {
                    setCity(value);
                    addressForm.setFieldsValue({ postcode: undefined });
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
                    message: 'Please select the postal code.',
                  },
                ]}
                initialValue={data?.postcode.postcode}
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
                initialValue={data?.address}
              >
                <TextArea
                  rows={4}
                  placeholder='Please enter your address'
                  showCount
                  maxLength={128}
                  autoSize={{ minRows: 4, maxRows: 12 }}
                />
              </Form.Item>
              <Form.Item
                label='Default Address'
                name='default'
                valuePropName='checked'
                initialValue={data?.default}
              >
                <Switch disabled={data?.default} />
              </Form.Item>

              <Row justify='space-between'>
                <Col>
                  <Button
                    type='primary'
                    color='error'
                    onClick={handleDeleteAddress}
                    disabled={submitLoading}
                  >
                    Delete
                  </Button>
                </Col>
                <Col>
                  <Space size={10}>
                    <Button
                      disabled={submitLoading}
                      onClick={() => {
                        props.onClose(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type='primary'
                      htmlType='submit'
                      disabled={submitLoading}
                    >
                      Save
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Space>
          </Form>
        </SpinCircle>
      </Space>
    </Drawer>
  );
};

export default AddressEditDrawer;
