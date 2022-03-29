import { orderListAPI } from '@api/services/orderAPI';
import OrderCard from '@components/Card/OrderCard';
import Layout from '@components/Layout';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';
import { addSearchParams, removeSearchParams } from '@utils/urlUtls';
import { Grid, List, Row, Space, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const OrderHistory = () => {
  const { Title } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi] = useContext(MessageContext);
  const [page, setPage] = useState<number>(1);
  const [totalRecord, setTotalRecord] = useState<number>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const defPg = 5;

  const getOrders = (isMounted = true) => {
    setLoading(true);
    orderListAPI(location.search)
      .then((res) => {
        if (isMounted) {
          setData(res.data?.results);
          setTotalRecord(res.data?.count);
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
    getOrders(isMounted);

    return () => {
      isMounted = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (page !== undefined) {
      if (page > 1) {
        setSearchParams(
          addSearchParams(searchParams, {
            limit: String(defPg),
            offset: (page - 1) * defPg,
          })
        );
      } else {
        setSearchParams(
          removeSearchParams(
            new URLSearchParams(
              addSearchParams(searchParams, {
                limit: String(defPg),
              })
            ),
            'offset'
          )
        );
      }
    } else
      setSearchParams(addSearchParams(searchParams, { limit: String(defPg) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchParams]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };

  const ListItem = (item) => {
    return (
      <List.Item>
        <OrderCard
          order={item}
          onClick={() => {
            navigate(`/order/${item.id}`);
          }}
        />
      </List.Item>
    );
  };

  const SkeletonCard = () => {
    const getSekeletons = () => {
      let skeletons = [];
      for (var i = 0; i < 3; i++) {
        skeletons.push(<OrderCard loading={loading} />);
      }
      return skeletons;
    };
    return <>{getSekeletons()}</>;
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
          <Title level={screens.md ? 3 : 5}>Order History</Title>
          <Space direction='vertical' size={20} className='full-width'>
            {loading ? (
              SkeletonCard()
            ) : (
              <List
                rowKey='id'
                dataSource={data}
                renderItem={ListItem}
                pagination={{
                  current: page,
                  onChange: (page) => {
                    setPage(page);
                  },
                  pageSize: defPg,
                  total: totalRecord,
                }}
              />
            )}
          </Space>
        </Space>
      </Row>
    </Layout>
  );
};

export default OrderHistory;
