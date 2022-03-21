import { addressAddAPI } from '@api/services/addressAPI';
import Button from '@components/Button';
import SpinCircle from '@components/Spin/SpinCircle';
import { MessageContext } from '@contexts/MessageContext';
import { getCities, getPostcodes, getStates } from '@utils/addressUtils';
import { removeInvalidData, sortByOrder } from '@utils/arrayUtils';
import { serverErrMsg } from '@utils/messageUtils';
import {
  Col,
  Form,
  Input,
  Modal,
  ModalProps,
  Row,
  Select,
  Space,
  Switch,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useContext, useState } from 'react';
interface AddressAddEditProps extends ModalProps {
  postcode?: any;
  loading?: boolean;
  onUpdate?: () => void;
}

const AddressAddModal = ({
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

  const handleAddAddress = (values) => {
    let { city, state, ...data } = values;
    data = removeInvalidData(data)
    setSubmitLoading(true);
    addressAddAPI(data)
      .then((res) => {
        messageApi.open({
          key: 'addressAddSuccess',
          type: 'success',
          content: 'New address has been added.',
        });
        setSubmitLoading(false);
        setTimeout(() => messageApi.destroy(), 5000);
        onUpdate()
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
    setTimeout(() => messageApi.destroy(), 5000);
  };

  return (
    <Modal
      centered
      footer={null}
      title={'Add Address'}
      destroyOnClose
      {...props}
    >
      <SpinCircle spinning={loading}>
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
            >
              <Input placeholder='Please enter the contact name'/>
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
            >
              <Select
                placeholder='Please select the state'
                onChange={(value: string) => {
                  setState(value);
                  addressForm.resetFields(['city', 'postcode']);
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
            >
              <Select
                placeholder='Please select the city'
                disabled={!state}
                onChange={(value: string) => {
                  setCity(value);
                  addressForm.resetFields(['postcode']);
                }}
              >
                {sortByOrder(getCities(postcode, state)).map((city: string) => (
                  <Option key={city}>{city}</Option>
                ))}
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
              initialValue={false}
            >
              <Switch />
            </Form.Item>

            <Row gutter={10} justify='end'>
              <Col>
                <Button
                  disabled={submitLoading}
                  onClick={() => {
                    props.onCancel(null);
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
                  Add
                </Button>
              </Col>
            </Row>
          </Space>
        </Form>
      </SpinCircle>
    </Modal>
  );
};

export default AddressAddModal;
