import { accDetailsAPI } from '@api/services/custAPI';
import Button from '@components/Button';
import Layout from '@components/Layout';
import SpinCircle from '@components/Spin/SpinCircle';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { custCat, genderCat } from '@utils/optionUtils';
import { Col, Descriptions, Grid, Row, Space, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import AccountInfoEditDrawer from './AccountInfoEditDrawer';
import AccountInfoEditModal from './AccountInfoEditModal';
import ChangePassDrawer from './ChangePassDrawer';
import ChangePassModal from './ChangePassModal';

const AccountInfo = () => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [messageApi] = useContext(MessageContext);
  const [showChangePass, setShowChangePass] = useState(false);
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
          <Title level={screens.md ? 3 : 5}>Account Information</Title>
          <Space direction='vertical' size={20}>
            <SpinCircle spinning={loading}>
              <Descriptions
                bordered
                column={1}
                style={{ width: screens.md ? 500 : '100%' }}
              >
                <Descriptions.Item label='Email'>
                  <Button type='link' href='mailto:fyp.shrf@gmail.com'>
                    {data['email'] ? (
                      data['email']
                    ) : (
                      <Text type='secondary'>Not Set</Text>
                    )}
                  </Button>
                </Descriptions.Item>
                <Descriptions.Item label='Name'>
                  {data['name'] ? (
                    data['name']
                  ) : (
                    <Text type='secondary'>Not Set</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label='Gender'>
                  {data['gender'] ? (
                    genderCat.find((cat) => cat.value === data['gender']).label
                  ) : (
                    <Text type='secondary'>Not Set</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label='Birthdate'>
                  {data['birthdate'] ? (
                    data['birthdate']
                  ) : (
                    <Text type='secondary'>Not Set</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label='Customer Type'>
                  {data['type'] ? (
                    custCat.find((cat) => cat.value === data['type']).label
                  ) : (
                    <Text type='secondary'>Not Set</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label='Password'>
                  {data['email'] ? (
                    <Button
                      type='link'
                      color='info'
                      onClick={() => {
                        setShowChangePass(true);
                      }}
                    >
                      Change
                    </Button>
                  ) : (
                    '-'
                  )}
                </Descriptions.Item>
              </Descriptions>
            </SpinCircle>
            <Row justify='end' align='middle'>
              <Col span={8}>
                <Button
                  type='primary'
                  block
                  onClick={() => {
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </Button>
              </Col>
            </Row>
          </Space>
        </Space>
      </Row>
      {screens.md ? (
        <AccountInfoEditModal
          visible={showEditModal}
          loading={loading}
          data={data}
          onCancel={() => {
            setShowEditModal(false);
          }}
          onUpdate={() => {
            getUserDetails();
            setShowEditModal(false);
          }}
        />
      ) : (
        <AccountInfoEditDrawer
          visible={showEditModal}
          loading={loading}
          data={data}
          onClose={() => {
            setShowEditModal(false);
          }}
          onUpdate={() => {
            setShowEditModal(false);
            getUserDetails();
          }}
        />
      )}
      {screens.md ? (
        <ChangePassModal
          visible={showChangePass}
          onCancel={() => {
            setShowChangePass(false);
          }}
        />
      ) : (
        <ChangePassDrawer
          visible={showChangePass}
          onClose={() => {
            setShowChangePass(false);
          }}
        />
      )}
    </Layout>
  );
};

export default AccountInfo;
