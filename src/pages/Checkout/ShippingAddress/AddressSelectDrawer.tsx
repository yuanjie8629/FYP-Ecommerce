import { Space, DrawerProps, Grid } from 'antd';
import AddressCard from '@components/Card/AddressCard';
import { useContext, useEffect, useState } from 'react';
import { addressListAPI } from '@api/services/addressAPI';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { getUserId } from '@utils/storageUtils';
import Drawer from '@components/Drawer';

interface AddressSelectDrawerProps extends DrawerProps {
  selected: number;
  onSelect?: (id) => void;
}

const AddressSelectDrawer = ({
  selected,
  onSelect = () => null,
  ...props
}: AddressSelectDrawerProps) => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [messageApi] = useContext(MessageContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    if (getUserId() && props.visible) {
      addressListAPI()
        .then((res) => {
          if (isMounted) {
            let list = [];
            res.data.forEach((address) => {
              list.push({
                id: address?.id,
                contact_name: address?.contact_name,
                contact_num: address?.contact_num,
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
    }

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
    <Drawer
      title='Change Address'
      width={screens.md ? 500 : '100%'}
      {...props}
    >
      <Space direction='vertical' size={30} className='full-width'>
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
