import { accDetailsAPI } from '@api/services/authAPI';
import Button from '@components/Button';
import Layout from '@components/Layout';
import SpinCircle from '@components/Spin/SpinCircle';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { custCat, genderCat } from '@utils/optionUtils';
import { findRoutePath } from '@utils/routingUtils';
import { Col, Descriptions, Grid, Row, Space, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddressBook = () => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [messageApi] = useContext(MessageContext);
  const navigate = useNavigate();
  const getUserDetails = (isMounted = true) => {
    setLoading(true);
    accDetailsAPI()
      .then((res) => {
        if (isMounted) {
          setData(res.data);
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
    getUserDetails(isMounted);

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
      <Row justify='center' style={{ padding: 20 }}>
        <Space
          direction='vertical'
          align='center'
          style={{ marginTop: 50, width: screens.md ? 500 : '90%' }}
          size={50}
          className='full-width'
        >
          <Title level={screens.md ? 3 : 5}>Address Book</Title>
          <Space direction='vertical' size={20}></Space>
        </Space>
      </Row>
    </Layout>
  );
};

export default AddressBook;
