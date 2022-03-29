import MainCard from '@components/Card/MainCard';
import { ShipmentType } from '@components/Card/OrderCard';
import { CardProps, Col, Row, Skeleton, Space, Steps, Typography } from 'antd';
import {
  HiCheckCircle,
  HiClipboardCheck,
  HiCube,
  HiTruck,
} from 'react-icons/hi';

interface OrderInfoProps extends CardProps {
  shipmentType?: ShipmentType;
  status?: string;
}

const OrderStatus = ({
  shipmentType,
  status,
  loading,
  ...props
}: OrderInfoProps) => {
  const { Title } = Typography;
  const { Step } = Steps;

  const shipmentSteps = [
    { status: 'toShip', value: 0 },
    { status: 'shipping', value: 1 },
    { status: 'completed', value: 2 },
  ];

  const pickupSteps = [
    { status: 'toPickup', value: 1 },
    { status: 'completed', value: 2 },
  ];

  return (
    <MainCard {...props}>
      <Space
        direction='vertical'
        size={50}
        style={{ textAlign: 'start' }}
        className='full-width'
      >
        <Row justify='space-between' align='middle'>
          <Col>
            <Title level={5}>Order Status</Title>
          </Col>
        </Row>

        {loading ? (
          <Skeleton title={null} paragraph={{ rows: 2, width: '100%' }} />
        ) : shipmentType === 'shipping' ? (
          <Steps
            labelPlacement='vertical'
            size='small'
            current={
              shipmentSteps.find((step) => step.status === status)?.value
            }
          >
            <Step
              icon={<HiClipboardCheck />}
              title={status !== 'unpaid' ? 'Paid' : 'Unpaid'}
              status={status === 'unpaid' ? 'error' : undefined}
            />
            <Step icon={<HiTruck />} title='Shipped' />
            <Step icon={<HiCheckCircle />} title='Completed' />
          </Steps>
        ) : (
          <Steps
            labelPlacement='vertical'
            current={pickupSteps.find((step) => step.status === status)?.value}
          >
            <Step
              icon={<HiClipboardCheck />}
              title={status !== 'unpaid' ? 'Paid' : 'Unpaid'}
              status={status === 'unpaid' ? 'error' : undefined}
            />
            <Step icon={<HiCube />} title='To Pickup' />
            <Step icon={<HiCheckCircle />} title='Completed' />
          </Steps>
        )}
      </Space>
    </MainCard>
  );
};

export default OrderStatus;
