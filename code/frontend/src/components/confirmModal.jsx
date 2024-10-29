import React from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';

const useConfirmModal = () => {
    const [modal, contextHolder] = Modal.useModal();
  
    const showConfirm = () => {
      return new Promise((resolve, reject) => {
        modal.confirm({
          title: 'De certeza que deseja desativar o estado?',
          icon: <ExclamationCircleFilled />,
          content: 'Esta ação é permanente e não pode ser revertida.',
          okText: 'Sim',
          okType: 'danger',
          cancelText: 'Não',
          onOk() {
            resolve(true);
          },
          onCancel() {
            reject(false);
          },
        });
      });
    };
  
    return { showConfirm, contextHolder };
  };

export default useConfirmModal;
