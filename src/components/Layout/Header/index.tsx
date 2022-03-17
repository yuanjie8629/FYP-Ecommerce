import {Layout, Row } from 'antd';
import React from 'react';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';


const Header = () => {
  const { Header } = Layout;
  const tkn: { name: string; role: string } = jwtDecode(
    Cookies.get('access_token')
  );

  return (
    <div className='header-fixed'>
      <Header>
        <Row
          align='middle'
          justify='space-between'
          style={{ height: 80 }}
        ></Row>
      </Header>
    </div>
  );
};

export default Header;
