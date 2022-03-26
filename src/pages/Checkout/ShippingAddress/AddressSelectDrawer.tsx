import { Drawer, Row, Col, Space, DrawerProps, Typography, Grid } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import AddressCard from '@components/Card/AddressCard';
import { useContext, useEffect, useState } from 'react';
import { addressListAPI } from '@api/services/addressAPI';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';

interface AddressSelectDrawerProps extends DrawerProps {
  selected: number;
  onSelect?: (id) => void;
}

const AddressSelectDrawer = ({
  selected,
  onSelect = () => null,
  ...props
}: AddressSelectDrawerProps) => {
  const { Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [messageApi] = useContext(MessageContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    addressListAPI()
      .then((res) => {
        if (isMounted) {
          let list = [];
          res.data.forEach((address) => {
            list.push({
              id: address?.id,
              contactName: address?.contact_name,
              contactNum: address?.contact_num,
              address: address?.address,
              state: address?.postcode?.state,
              city: address?.postcode?.city,
              postcode: address?.postcode?.postcode,
              default: address?.default,
            });
          });
          setData(list);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          setLoading(false);
          showServerErrMsg();
        }
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const SkeletonCard = () => {
    const getSekeletons = () => {
      let skeletons = [];
      for (var i = 0; i < 3; i++) {
        skeletons.push(<AddressCard loading={loading} />);
      }
      return skeletons;
    };
    return <>{getSekeletons()}</>;
  };

  return (
    <Drawer closable={false} width={screens.md ? 500 : '100%'} {...props}>
      <Space direction='vertical' size={30} className='full-width'>
        <Row
          align='top'
          style={{ paddingBottom: 20, borderBottom: '1px solid #e5e7eb' }}
        >
          <Col span={1} style={{ position: 'absolute', zIndex: 5 }}>
            <CloseOutlined
              className='color-grey'
              size={30}
              onClick={() => {
                props.onClose(null);
              }}
            />
          </Col>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Title level={5}>Change Address</Title>
          </Col>
        </Row>
        {loading
          ? SkeletonCard()
          : data.map((address) => (
              <AddressCard
                address={address}
                backgroundColor={address.id === selected ? 'success' : 'grey'}
                hoverable={address.id !== selected}
                onClick={() => {
                  if (address.id !== selected) {
                    onSelect(address);
                    props.onClose(null);
                  }
                }}
              />
            ))}
      </Space>
    </Drawer>
  );
};

export default AddressSelectDrawer;
