import { itemPrevAPI } from '@api/services/productAPI';
import Layout from '@components/Layout';
import { MessageContext } from '@contexts/MessageContext';
import { serverErrMsg } from '@utils/messageUtils';

import { addSearchParams, removeSearchParams } from '@utils/urlUtls';
import { Pagination, Space, Row, Col, Empty } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ItemCard from './ItemCard';
import SkeletonItem from './SkeletonItem';

const SearchItem = () => {
  const [itemCount, setItemCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [messageApi] = useContext(MessageContext);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    itemPrevAPI(`?name=${searchParams.get('name')}`)
      .then((res) => {
        if (isMounted) {
          setList(res.data.results);
          setItemCount(res.data.count);
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
  }, [searchParams]);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
  };
  return (
    <Layout>
      <Space direction='vertical' size={20} className='full-width'>
        <div style={{ margin: 15 }}>
          <Row gutter={[40, 40]} className='item-list'>
            {loading ? (
              <SkeletonItem total={12} />
            ) : list.length > 0 ? (
              list.map((data) => <ItemCard info={data} />)
            ) : (
              <Row justify='center' className='full-width'>
                <Empty />
              </Row>
            )}
          </Row>
        </div>
        {itemCount > 0 && (
          <Row justify='end'>
            <Col>
              <Pagination
                defaultCurrent={1}
                total={itemCount}
                onChange={(page) => {
                  if (page > 1) {
                    setSearchParams(
                      addSearchParams(searchParams, {
                        offset: (page - 1) * 12,
                      })
                    );
                  } else {
                    setSearchParams(removeSearchParams(searchParams, 'offset'));
                  }
                }}
              />
            </Col>
          </Row>
        )}
      </Space>
    </Layout>
  );
};

export default SearchItem;
