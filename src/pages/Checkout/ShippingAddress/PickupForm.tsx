import { pickupLocListAPI } from '@api/services/shipmentAPI';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { Button, Col, Form, Row, Select, Skeleton, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useContext, useEffect, useState } from 'react';

interface PickupFormProps {
  onSubmit?: (values) => void;
  onSelectAddress?: () => void;
}

const PickupForm = ({ onSubmit, onSelectAddress }: PickupFormProps) => {
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
    setTimeout(() => messageApi.destroy(), 5000);
  };

  return (
    <Form
      form={pickupForm}
      name='pickupForm'
      labelCol={{ span: 6 }}
      labelAlign='left'
      onFinish={(values) => {
        onSubmit(values.location);
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
            <Form.Item name='location'>
              <Select
                placeholder='Select Pickup Location'
                options={data.map((data) => {
                  return { value: data.location, label: data.location };
                })}
                style={{ width: '80%' }}
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
