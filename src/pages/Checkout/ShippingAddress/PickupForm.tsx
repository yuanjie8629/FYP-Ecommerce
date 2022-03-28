import { pickupLocListAPI } from '@api/services/shipmentAPI';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { getUserId } from '@utils/storageUtils';
import { Button, Col, Form, Input, Row, Select, Skeleton, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useContext, useEffect, useState } from 'react';

interface PickupFormProps {
  onSubmit?: (values) => void;
  onSelectAddress?: () => void;
  onEmail?: (email: string) => void;
}

const PickupForm = ({
  onSubmit = () => null,
  onSelectAddress = () => null,
  onEmail = () => null,
}: PickupFormProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [messageApi] = useContext(MessageContext);
  const [pickupForm] = useForm();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    pickupLocListAPI()
      .then((res) => {
        if (isMounted) {
          setData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          showServerErrMsg();
          setLoading(false);
        }

        return () => {
          isMounted = false;
        };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  return (
    <Form
      form={pickupForm}
      name='pickupForm'
      labelCol={{ span: 6 }}
      labelAlign='left'
      onFinish={(values) => {
        let { email, ...data } = values;
        onSubmit(data);
        if (email) {
          onEmail(email);
        }
      }}
    >
      <Space direction='vertical' size={20} className='full-width'>
        {loading ? (
          <Skeleton
            active
            title={null}
            paragraph={{ rows: 3, width: '100%' }}
          />
        ) : (
          <>
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
            {!getUserId() && (
              <Form.Item
                label='Email Address'
                name='email'
                rules={[
                  {
                    required: true,
                    message: 'Please enter the your email address.',
                  },
                ]}
              >
                <Input type='email' placeholder='Please enter your email' />
              </Form.Item>
            )}

            <Form.Item
              name='location'
              label='Pickup Location'
              rules={[
                {
                  required: true,
                  message: 'Please select the pickup location.',
                },
              ]}
            >
              <Select
                placeholder='Select Pickup Location'
                options={data.map((data) => {
                  return { value: data.location, label: data.location };
                })}
              />
            </Form.Item>
            <Row gutter={10} justify='space-between'>
              <Col>
                <Button
                  onClick={() => {
                    onSelectAddress();
                  }}
                >
                  Add New Address
                </Button>
              </Col>
              <Col>
                <Button type='primary' htmlType='submit'>
                  Save
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Space>
    </Form>
  );
};

export default PickupForm;
