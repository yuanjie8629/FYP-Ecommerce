import { addSearchParams, removeSearchParams } from '@utils/urlUtls';
import {
  Pagination as AntdPagination,
  PaginationProps as AntdPaginationProps,
} from 'antd';
import { useSearchParams } from 'react-router-dom';

export interface PaginationProps extends AntdPaginationProps {}

const Pagination = ({ defaultCurrent = 1, ...props }: PaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <AntdPagination
      defaultCurrent={defaultCurrent}
      defaultPageSize={12}
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
      {...props}
    />
  );
};

export default Pagination;
