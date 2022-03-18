import { Modal as AntdModal, ModalProps } from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

export type LoginRegModalPayload = {
  onOk?: () => void;
  onCancel?: () => void;
  args?: any;
};

export const LoginRegModalComponent = {
  login: LoginModal,
  register: RegisterModal,
};

export type LoginRegModalType = 'login' | 'register';

export interface LoginRegModalContentProps extends ModalProps {
  onOk?: () => void;
  onCancel?: () => void;
  onSubmit?: (success: boolean) => void;
  args?: any;
}

export type LoginRegModalProps = Omit<ModalProps, 'onOk' | 'onCancel'> &
  LoginRegModalContentProps;

type LoginRegModalReturnProps = React.FC<Partial<LoginRegModalProps>> & {
  show?: (
    type: LoginRegModalType,
    LoginRegModalPayload?: LoginRegModalPayload
  ) => void;
};

const LoginRegModal: LoginRegModalReturnProps = memo(
  (props: LoginRegModalProps, _ref) => {
    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState<LoginRegModalType>(null);
    const [args, setArgs] = useState({});
    const payloadRef = useRef<LoginRegModalPayload>({});

    useEffect(() => {
      LoginRegModal.show = (
        type: LoginRegModalType,
        payload: LoginRegModalPayload
      ) => {
        setVisible(true);
        setModalType(type);
        payloadRef.current = payload;
        setArgs(payload?.args);
      };
    }, []);

    const handleOk = (method?: () => void) => () => {
      method && method();
      setVisible(false);
    };

    const handleCancel = (method?: () => void) => () => {
      method && method();
      setVisible(false);
    };

    const renderModal = () => {
      const ModalRender = LoginRegModalComponent[modalType]
        ? LoginRegModalComponent[modalType]
        : null;
      return (
        <ModalRender
          onOk={handleOk(payloadRef.current?.onOk)}
          onCancel={handleCancel(payloadRef.current?.onCancel)}
          onSubmit={(success) => {
            if (success) {
              setVisible(false);
            }
          }}
          args={args}
        />
      );
    };

    return (
      <AntdModal
        visible={visible}
        onOk={handleOk(payloadRef.current?.onOk)}
        onCancel={handleCancel(payloadRef.current?.onCancel)}
        footer={null}
        bodyStyle={{ padding: 30 }}
        destroyOnClose
        centered
        {...props}
      >
        {renderModal()}
      </AntdModal>
    );
  }
);

export default LoginRegModal;
