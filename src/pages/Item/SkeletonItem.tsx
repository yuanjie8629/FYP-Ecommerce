import React from 'react';
import { Skeleton, Col } from 'antd';

interface SkeletonItemProps {
  total: number;
}

const SkeletonItem = ({ total }: SkeletonItemProps) => {
  const getSekeletons = () => {
    let skeletons = [];
    for (let i = 0; i < total; i++) {
      skeletons.push(
        <Col
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 6 }}
          style={{ textAlign: 'center' }}
        >
          <Skeleton
            loading={true}
            active
            avatar={{ shape: 'square' }}
            paragraph={false}
            title={false}
          />
        </Col>
      );
    }
    return skeletons;
  };
  return <>{getSekeletons()}</>;
};

export default SkeletonItem;
