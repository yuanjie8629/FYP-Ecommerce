import { addressListAPI, postcodeListAPI } from '@api/services/addressAPI';
import Button from '@components/Button';
import AddressCard from '@components/Card/AddressCard';
import Layout from '@components/Layout';
import SpinCircle from '@components/Spin/SpinCircle';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { Card, Grid, List, Row, Space, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
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
    setLoading(true);
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
  };

  const ListItem = (item) => {
    return (
      <List.Item>
        <AddressCard
          address={item}
          extra={
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
          }
        />
      </List.Item>
    );
  };

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
          visible={showEdit}
          data={selected}
          loading={loading}
          postcode={postcode}
          onClose={() => {
            setShowEdit(false);
          }}
          onUpdate={() => {
            getAddresses();
            setShowEdit(false);
          }}
        />
      )}
    </Layout>
  );
};

export default AddressBook;
