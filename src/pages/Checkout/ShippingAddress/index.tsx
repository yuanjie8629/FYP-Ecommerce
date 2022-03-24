import { addressDefaultAPI } from '@api/services/addressAPI';
import Button from '@components/Button';
import AddressCard, { AddressInfo } from '@components/Card/AddressCard';
import MainCard from '@components/Card/MainCard';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { getUserId } from '@utils/storageUtils';
import { CardProps, Col, Row, Space, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import AddressSelectDrawer from './AddressSelectDrawer';
import ShippingAddressForm from './ShippingAddressForm';

interface ShippingAddressProps extends CardProps {
  onSave?: (address?: AddressInfo) => void;
}

const ShippingAddress = ({
  onSave = () => null,
  ...props
}: ShippingAddressProps) => {
  const { Title } = Typography;
  const [addressLoading, setAddressLoading] = useState(false);
  const [address, setAddress] = useState<AddressInfo & { id?: number }>();
  const [addAdress, setAddAddress] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [messageApi] = useContext(MessageContext);
  const [showSelectDrawer, setShowSelectDrawer] = useState(false);

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
        }
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          showServerErrMsg();
          setAddressLoading(false);
        }
      });
  };

  useEffect(() => {
    let isMounted = true;
    getUserId() && getDefaultAddress(isMounted);
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (confirm) {
      onSave(address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, confirm]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
    setTimeout(() => messageApi.destroy(), 5000);
  };

  return (
    <MainCard {...props}>
      <Space direction='vertical' size={20} className='full-width'>
        <Row justify='space-between' align='middle'>
          <Col>
            <Title level={5}>Shipping Address</Title>
          </Col>
          {confirm && (
            <Col>
              <MdEdit
                size={20}
                onClick={() => {
                  setConfirm(false);
                  setAddAddress(true);
                }}
              />
            </Col>
          )}
        </Row>
        {getUserId() && !addAdress ? (
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
        ) : (
          <ShippingAddressForm
            address={confirm ? address : undefined}
            onSelectAddress={() => {
              setAddAddress(false);
            }}
            onSubmit={(values) => {
              console.log(values);
              setAddress({
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
            }}
          />
        )}
        {!addAdress && !confirm && (
          <Button
            onClick={() => {
              setAddAddress(true);
            }}
          >
            Add New Address
          </Button>
        )}
        {!confirm && !addAdress && (
          <Row justify='end'>
            <Col>
              <Button
                type='primary'
                size='large'
                style={{ width: 100 }}
                onClick={() => {
                  setConfirm(true);
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
        }}
      />
    </MainCard>
  );
};

export default ShippingAddress;
