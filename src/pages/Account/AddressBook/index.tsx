import { addressListAPI, postcodeListAPI } from '@api/services/addressAPI';
import Button from '@components/Button';
import Layout from '@components/Layout';
import SpinCircle from '@components/Spin/SpinCircle';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { Card, Col, Grid, List, Row, Space, Tag, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { HiLocationMarker } from 'react-icons/hi';
import AddressAddDrawer from './AddressAddDrawer';
import AddressAddModal from './AddressAddModal';
import AddressEditDrawer from './AddressEditDrawer';
import AddressEditModal from './AddressEditModal';

const AddressBook = () => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [data, setData] = useState([]);
  const [postcode, setPostcode] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi] = useContext(MessageContext);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState();
  const getPostcodes = (isMounted = true) => {
    postcodeListAPI()
      .then((res) => {
        if (isMounted) {
          setPostcode(res.data);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setLoading(false);
          showServerErrMsg();
        }
      });
  };

  const getAddresses = (isMounted = true) => {
    setLoading(true);
    addressListAPI()
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
    setLoading(true);
    getPostcodes(isMounted);
    getAddresses(isMounted);

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
    setTimeout(() => messageApi.destroy(), 5000);
  };

  const ListItem = (item) => (
    <List.Item>
      <Row
        style={{ borderRadius: 12, margin: '10px 0', padding: 20 }}
        className='full-width bg-grey-50'
      >
        <Col span={3}>
          <HiLocationMarker size={20} className='color-primary' />
        </Col>
        <Col span={18} style={{ textAlign: 'start' }}>
          <Space direction='vertical'>
            <Text strong>{item.contact_name}</Text>
            <Text type='secondary'>{item.contact_num}</Text>
            <Text>{item.address}</Text>
            <Text>{`${item.postcode.state}, ${item.postcode.city}, ${item.postcode.postcode}`}</Text>
            {item.default && <Tag color='success'>Default</Tag>}
          </Space>
        </Col>
        <Col span={3}>
          <Button
            type='link'
            color='info'
            onClick={() => {
              setSelected(item);
              setShowEdit(true);
            }}
          >
            Edit
          </Button>
        </Col>
      </Row>
    </List.Item>
  );

  return (
    <Layout>
      <Row justify='center' style={{ padding: 20 }}>
        <Space
          direction='vertical'
          style={{
            marginTop: 50,
            width: screens.md ? 500 : '90%',
            textAlign: 'center',
          }}
          size={50}
          className='full-width'
        >
          <Title level={screens.md ? 3 : 5}>Address Book</Title>
          <Space direction='vertical' size={20} className='full-width'>
            <SpinCircle spinning={loading}>
              <Card
                hoverable
                onClick={() => {
                  setShowAdd(true);
                }}
              >
                <Text strong className='color-primary'>
                  + Add Address
                </Text>
              </Card>
              <List rowKey='id' dataSource={data} renderItem={ListItem} />
            </SpinCircle>
          </Space>
        </Space>
      </Row>
      {screens.md ? (
        <AddressAddModal
          visible={showAdd}
          loading={loading}
          postcode={postcode}
          onCancel={() => {
            setShowAdd(false);
          }}
          onUpdate={() => {
            getAddresses();
            setShowAdd(false);
          }}
        />
      ) : (
        <AddressAddDrawer
          visible={showAdd}
          loading={loading}
          postcode={postcode}
          onClose={() => {
            setShowAdd(false);
          }}
          onUpdate={() => {
            getAddresses();
            setShowAdd(false);
          }}
        />
      )}
      {screens.md ? (
        <AddressEditModal
          visible={showEdit}
          data={selected}
          loading={loading}
          postcode={postcode}
          onCancel={() => {
            setShowEdit(false);
          }}
          onUpdate={() => {
            getAddresses();
            setShowEdit(false);
          }}
        />
      ) : (
        <AddressEditDrawer
          visible={showAdd}
          loading={loading}
          postcode={postcode}
          onClose={() => {
            setShowAdd(false);
          }}
          onUpdate={() => {
            getAddresses();
            setShowAdd(false);
          }}
        />
      )}
    </Layout>
  );
};

export default AddressBook;
