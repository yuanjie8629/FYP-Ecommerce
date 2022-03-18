import { packagePrevAPI } from '@api/services/productAPI';
import { serverErrMsg } from '@utils/messageUtils';
import { Empty, message, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ItemCard from './ItemCard';
import SkeletonItem from './SkeletonItem';
import './ItemCard.less';
interface AllPackageProps {
  onChange?: (total: number) => void;
}

const AllPackage = ({ onChange = () => null, ...props }: AllPackageProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    packagePrevAPI(location.search)
      .then((res) => {
        if (isMounted) {
          console.log(res.data.results);
          setList(res.data.results);
          onChange(res.data.count);
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
  }, []);

  const showServerErrMsg = () => {
    messageApi.open(serverErrMsg);
    setTimeout(() => message.destroy('serverErr'), 3000);
  };

  return (
    <div style={{ margin: 10 }}>
      {contextHolder}
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
  );
};

export default AllPackage;