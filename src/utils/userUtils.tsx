import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

export const getUserId = () => {
  let tkn: any = Cookies.get('access_token')
    ? jwtDecode(Cookies.get('access_token'))
    : null;
  return tkn?.user_id;
};

export const getUserEmail = () => {
  let tkn: any = Cookies.get('access_token')
    ? jwtDecode(Cookies.get('access_token'))
    : null;
  return tkn?.email;
};
