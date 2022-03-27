import {
  checkAutoAppliedVoucherAPI,
  checkVoucherAPI,
} from '@api/services/voucher';
import Button from '@components/Button';
import MainCard from '@components/Card/MainCard';
import SpinCircle from '@components/Spin/SpinCircle';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { getUserId } from '@utils/storageUtils';
import {
  CardProps,
  Col,
  Form,
  Grid,
  Input,
  Row,
  Space,
  Typography,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useContext, useEffect, useState } from 'react';

interface VoucherProps extends CardProps {
  cartPrice?: number;
  onApplyVoucher?: (code) => void;
}

const Voucher = ({
  cartPrice,
  onApplyVoucher = () => null,
  ...props
}: VoucherProps) => {
  const { Text, Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [voucherForm] = useForm();
  const [voucher, setVoucher] = useState('');
  const [messageApi] = useContext(MessageContext);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [validVoucher, setValidVoucher] = useState(false);
  const [autoApplyLoading, setAutoApplyLoading] = useState(false);

  const checkVoucher = (voucher, cartPrice) => {
    setLoading(true);
    checkVoucherAPI(voucher, cartPrice)
      .then((res) => {
        onApplyVoucher(voucher);
        setValidVoucher(true);
        setLoading(false);
        showVoucherAppliedMsg();
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          if (err.response?.status === 404) {
            setValidVoucher(false);
            if (err.response?.data?.detail === 'require_login')
              setErrMsg('Please login to apply voucher.');
            else if (err.response?.data?.detail === 'no_stock')
              setErrMsg('Sorry, this voucher has been fully redeemed.');
            else if (err.response?.data?.detail === 'invalid')
              setErrMsg('Sorry, this voucher is not valid.');
            else if (err.response?.data?.detail === 'exceed_limit') {
              setErrMsg(
                'Sorry, you have reached the redemption limit on this voucher.'
              );
            } else if (err.response?.data?.min_spend) {
              setErrMsg(
                `Sorry, the minimum spend to apply this voucher is RM${err.response?.data?.min_spend}.`
              );
            }
          } else {
            showServerErrMsg();
          }
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    let isMounted = true;
    if (getUserId() && cartPrice) {
      setAutoApplyLoading(true);
      checkAutoAppliedVoucherAPI()
        .then((res) => {
          if (isMounted) {
            setVoucher(res.data?.code);
            voucherForm.setFieldsValue({ voucher: res.data?.code });
            checkVoucher(res.data?.code, cartPrice);
            setAutoApplyLoading(false);
          }
        })
        .catch((err) => {
          if (![404, 401].includes(err.response?.status)) {
            showServerErrMsg();
          }
          setAutoApplyLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartPrice]);

  const handleApplyVoucher = () => {
    if (!voucher) {
      setErrMsg('Please enter the voucher code.');
      return;
    }
    checkVoucher(voucher, cartPrice);
  };

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const showVoucherAppliedMsg = () => {
    messageApi.open({
      key: 'voucherApplied',
      type: 'success',
      content: 'The voucher redeeemed successfully.',
    });
  };

  const showVoucherRemovedMsg = () => {
    messageApi.open({
      key: 'voucherRemoved',
      type: 'info',
      content: 'The voucher has been removed.',
    });
  };

  return (
    <MainCard {...props}>
      <SpinCircle spinning={autoApplyLoading}>
        <Form name='voucherForm' form={voucherForm}>
          <Space direction='vertical' size={20} className='full-width'>
            <Title level={5}>Voucher</Title>
            {getUserId() ? (
              <Row gutter={[10, 20]} justify={screens.xs ? 'end' : 'start'}>
                {!validVoucher ? (
                  <>
                    <Col xs={24} sm={18}>
                      <Form.Item
                        name='voucher'
                        help={errMsg}
                        validateStatus={errMsg ? 'error' : undefined}
                      >
                        <Input
                          placeholder='Enter Voucher Code'
                          value={voucher}
                          disabled={loading}
                          onChange={(e) => {
                            setVoucher(e.target.value);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Button
                        type='primary'
                        block
                        loading={loading}
                        onClick={handleApplyVoucher}
                      >
                        Apply
                      </Button>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col xs={24} sm={18}>
                      <Form.Item
                        name='voucher'
                        validateStatus='success'
                        hasFeedback
                      >
                        <Input value={voucher} disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Button
                        type='link'
                        color='error'
                        block
                        onClick={() => {
                          setVoucher('');
                          setErrMsg('');
                          setValidVoucher(false);
                          onApplyVoucher(undefined);
                          voucherForm.resetFields();
                          showVoucherRemovedMsg();
                        }}
                        style={{ height: 36, width: 60 }}
                      >
                        Remove
                      </Button>
                    </Col>
                  </>
                )}
              </Row>
            ) : (
              <Text strong type='secondary' className='text-lg'>
                Please login to apply voucher.
              </Text>
            )}
          </Space>
        </Form>
      </SpinCircle>
    </MainCard>
  );
};

export default Voucher;
