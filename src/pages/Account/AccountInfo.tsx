import { accDetailsAPI } from '@api/services/accountAPI';
import Button from '@components/Button';
import Layout from '@components/Layout';
import SpinCircle from '@components/Spin/SpinCircle';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { Descriptions, Grid, message, Row, Space, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';

const ContactUs = () => {
  const { Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageAPI] = useContext(MessageContext);
  useEffect(() => {
    let mounted = true;

    setLoading(true);
    accDetailsAPI()
      .then((res) => {
        if (mounted) {
          setData(res.data);
          setLoading(false);
          console.log(data);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setLoading(false);
          showServerErrMsg();
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const showServerErrMsg = () => {
    messageAPI.open(serverErrMsg);
    setTimeout(() => message.destroy('serverErr'), 3000);
  };

  return (
    <Layout>
      <Row justify='center' style={{ padding: 20 }}>
        <Space
          direction='vertical'
          align='center'
          style={{ marginTop: 50, width: 500 }}
          size={50}
          className='full-width'
        >
          <Title level={screens.md ? 3 : 5}>Account Information</Title>
          <SpinCircle>
            <Descriptions
              bordered
              column={1}
              style={{ width: screens.md && 500 }}
            >
              <Descriptions.Item label='Email'>
                <Button type='link' href='mailto:fyp.shrf@gmail.com'>
                  fyp.shrf@gmail.com
                </Button>
              </Descriptions.Item>
              <Descriptions.Item label='Name'>+60 1234 56789</Descriptions.Item>
              <Descriptions.Item label='Phone'>
                +60 1234 56789
              </Descriptions.Item>
              <Descriptions.Item label='Gender'>Male</Descriptions.Item>
              <Descriptions.Item label='Birthdate'>Male</Descriptions.Item>
            </Descriptions>
          </SpinCircle>
        </Space>
      </Row>
    </Layout>
  );
};

export default ContactUs;
