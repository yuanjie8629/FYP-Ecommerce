import { addressAddAPI, postcodeListAPI } from '@api/services/addressAPI';
import Button from '@components/Button';
import { AddressInfo } from '@components/Card/AddressCard';
import { MessageContext } from '@contexts/MessageContext';
import { getCities, getPostcodes, getStates } from '@utils/addressUtils';
import { removeInvalidData, sortByOrder } from '@utils/arrayUtils';
import { serverErrMsg } from '@utils/messageUtils';
import { getUserId } from '@utils/storageUtils';
import { Checkbox, Col, Form, Input, Row, Select, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useContext, useEffect, useState } from 'react';
import ShippingAddressFormSkeleton from './ShippingAddressFormSkeleton';

interface ShippingAddressFormProps {
  address?: AddressInfo;
  onSubmit?: (values) => void;
  onSelectAddress?: () => void;
  onPickup?: () => void;
}

const ShippingAddressForm = ({
  address,
  onSubmit = () => null,
  onSelectAddress = () => null,
  onPickup = () => null,
}: ShippingAddressFormProps) => {
  const { Option } = Select;
  const { TextArea } = Input;
  const [addressForm] = useForm();
  const [postcode, setPostcode] = useState([]);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageApi] = useContext(MessageContext);
  const [submitLoading, setSubmitLoading] = useState(false);

  const getPostcodeList = (isMounted = true) => {
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
  };

  useEffect(() => {
    let isMounted = true;
    getPostcodeList(isMounted);
    if (address) {
      addressForm.setFieldsValue({
        contact_name: address.contactName,
        contact_num: address.contactNum,
        address: address.address,
        state: address.state,
        city: address.city,
        postcode: address.postcode,
      });
      setState(address.state);
      setCity(address.city);
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const handleAddAddress = async (values) => {
    let { city, state, ...data } = values;
    data = removeInvalidData(data);
    setSubmitLoading(true);
    await addressAddAPI(data)
      .then((res) => {
        messageApi.open({
          key: 'addressUpdSuccess',
          type: 'success',
          content: 'New address has been added.',
        });
        setSubmitLoading(false);

        onSubmit({
          id: res.data?.id,
          ...values,
        });
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setSubmitLoading(false);
          showServerErrMsg();
        }
      });
  };

  return !loading ? (
    <Form
      form={addressForm}
      name='addressForm'
      labelCol={{ span: 6 }}
      labelAlign='left'
      onFinish={(values) => {
        let { address_book, ...data } = values;
        if (address_book) {
          handleAddAddress(data);
        } else {
          onSubmit(data);
        }
      }}
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
          <Input />
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
          <Input placeholder='012-3456789' />
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

        {getUserId() && (
          <>
            <Form.Item name='address_book' valuePropName='checked'>
              <Checkbox>Add to address book</Checkbox>
            </Form.Item>
            <Button
              onClick={() => {
                onSelectAddress();
              }}
            >
              Select Address
            </Button>
          </>
        )}

        <Row
          gutter={10}
          justify={!getUserId() ? 'space-between' : 'end'}
          style={{ marginTop: getUserId() ? 0 : 20 }}
        >
          {!getUserId() && (
            <Col>
              <Button
                disabled={submitLoading}
                onClick={() => {
                  onPickup();
                }}
              >
                Select Pickup
              </Button>
            </Col>
          )}
          <Col>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              loading={submitLoading}
            >
              Save
            </Button>
          </Col>
        </Row>
      </Space>
    </Form>
  ) : (
    <ShippingAddressFormSkeleton />
  );
};

export default ShippingAddressForm;
