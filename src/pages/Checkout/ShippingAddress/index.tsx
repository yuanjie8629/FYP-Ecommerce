import { addressDefaultAPI } from '@api/services/addressAPI';
import Button from '@components/Button';
import AddressCard, { AddressInfo } from '@components/Card/AddressCard';
import NoAddressCard from '@components/Card/AddressCard/NoAddressCard';
import PickupCard from '@components/Card/AddressCard/PickupCard';
import MainCard from '@components/Card/MainCard';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { getUserId } from '@utils/storageUtils';
import { CardProps, Col, Grid, Row, Space, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import AddressSelectDrawer from './AddressSelectDrawer';
import PickupForm from './PickupForm';
import ShippingAddressForm from './ShippingAddressForm';

interface ShippingAddressProps extends CardProps {
  onSave?: (address?: AddressInfo) => void;
  onPickup?: (location: string) => void;
  onEdit?: () => void;
}

const ShippingAddress = ({
  onSave = () => null,
  onPickup = () => null,
  onEdit = () => null,
  ...props
}: ShippingAddressProps) => {
  const { Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [addressLoading, setAddressLoading] = useState(false);
  const [address, setAddress] = useState<AddressInfo & { id?: number }>();
  const [addAddress, setAddAddress] = useState(false);
  const [userAddress, setUserAddress] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [messageApi] = useContext(MessageContext);
  const [showSelectDrawer, setShowSelectDrawer] = useState(false);
  const [showPickup, setShowPickup] = useState(false);
  const [pickup, setPickup] = useState('');
  const [addressCard, setAddressCard] = useState(false);
  const [noAddress, setNoAddress] = useState(false);

  const getDefaultAddress = (isMounted: boolean = true) => {
    setAddressLoading(true);
    addressDefaultAPI()
      .then((res) => {
        if (isMounted) {
          setAddress({
            id: res.data?.id,
            contactName: res.data?.contact_name,
            contactNum: res.data?.contact_num,
            address: res.data?.address,
            state: res.data?.postcode?.state,
            city: res.data?.postcode?.city,
            postcode: res.data?.postcode?.postcode,
            default: res.data?.default,
          });
          setAddressLoading(false);
          setUserAddress(true);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          if (err.response?.status === 400) {
            setNoAddress(true);
          } else {
            showServerErrMsg();
          }
          setAddressLoading(false);
        }
      });
  };

  useEffect(() => {
    let isMounted = true;
    if (getUserId()) {
      getDefaultAddress(isMounted);
      setAddressCard(true);
    } else {
      setAddAddress(true);
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (confirm && !pickup) {
      onSave(address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirm, pickup]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  return (
    <MainCard {...props}>
      <Space direction='vertical' size={20} className='full-width'>
        <Row justify='space-between' align='middle'>
          <Col>
            <Title level={5}>
              {pickup || showPickup ? 'Pickup' : 'Shipping Address'}
            </Title>
          </Col>
          {confirm && (
            <Col>
              <MdEdit
                size={20}
                onClick={() => {
                  setAddAddress(true);
                  setConfirm(false);
                  setPickup('');
                  setShowPickup(false);
                  setAddressCard(false);
                  onEdit();
                }}
                style={{ cursor: 'pointer' }}
              />
            </Col>
          )}
        </Row>
        {addressCard && !noAddress && (
          <AddressCard
            address={address}
            loading={addressLoading}
            showDefault={false}
            extra={
              !confirm &&
              getUserId() && (
                <Button
                  type='link'
                  color='info'
                  onClick={() => {
                    setShowSelectDrawer(true);
                  }}
                >
                  Change
                </Button>
              )
            }
          />
        )}
        {noAddress && <NoAddressCard />}
        {addAddress && (
          <ShippingAddressForm
            address={!userAddress ? address : undefined}
            onSelectAddress={() => {
              setAddAddress(false);
              setAddressCard(true);
            }}
            onSubmit={(values) => {
              setAddress({
                id: values?.id,
                contactName: values.contact_name,
                contactNum: values.contact_num,
                address: values.address,
                state: values.state,
                city: values.city,
                postcode: values.postcode,
                default: values.default,
              });
              setAddAddress(false);
              setConfirm(true);
              setUserAddress(false);
              setAddressCard(true);
              setNoAddress(false);
            }}
            onPickup={() => {
              setShowPickup(true);
              setAddAddress(false);
              setNoAddress(false);
            }}
          />
        )}
        {pickup && confirm && <PickupCard location={pickup} />}
        {showPickup && (
          <PickupForm
            onSelectAddress={() => {
              setShowPickup(false);
              setAddAddress(true);
            }}
            onSubmit={(values) => {
              setPickup(values);
              setShowPickup(false);
              setConfirm(true);
              onPickup(values);
              setNoAddress(false);
            }}
          />
        )}
        {addressCard && !confirm && (
          <>
            <Space direction={screens.xs ? 'vertical' : 'horizontal'}>
              <Button
                onClick={() => {
                  setAddAddress(true);
                  setAddressCard(false);
                  setNoAddress(false);
                }}
              >
                Add New Address
              </Button>
              <Button
                onClick={() => {
                  setAddressCard(false);
                  setShowPickup(true);
                  setNoAddress(false);
                }}
              >
                Select Pickup
              </Button>
            </Space>
          </>
        )}
        {addressCard && !confirm && !noAddress && !addressLoading && (
          <Row justify='end'>
            <Col>
              <Button
                type='primary'
                size='large'
                style={{ width: 100 }}
                onClick={() => {
                  setConfirm(true);
                  setNoAddress(false);
                }}
              >
                Save
              </Button>
            </Col>
          </Row>
        )}
      </Space>
      <AddressSelectDrawer
        selected={address?.id}
        visible={showSelectDrawer}
        onClose={() => {
          setShowSelectDrawer(false);
        }}
        onSelect={(selected) => {
          setAddress(selected);
          setUserAddress(true);
        }}
      />
    </MainCard>
  );
};

export default ShippingAddress;
