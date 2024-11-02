import React from 'react';
import { Dropdown, Space, Button, message } from 'antd';

// It receives the list of products state
const AddProdutoComponent = ({produtos, setProdutos, isEditing}) => {
  
  // Items for the Dropdown menu
  const produtos_items = [
    { key: '1', label: 'Produto 1' },
    { key: '2', label: 'Produto 2' },
    { key: '3', label: 'Produto 3' },
  ];

  // Function to add selected product to the list
  const addProduto = (p) => {
    const selectedProduct = produtos_items.find(item => item.key === p.key);

    // Check if the product (based on key) is already in the list
    if (selectedProduct && !produtos.some(produto => produto.key === selectedProduct.key)) {
        setProdutos([...produtos, { key: selectedProduct.key, label: selectedProduct.label }]);
    } else {
        message.info(`O produto "${selectedProduct.label}" já se encontra na lista`)
    }
  };

  return (
      <div style={{ display: 'flex', justifyContent: 'left', marginTop: '14px' }}>
        <Dropdown 
            disabled={isEditing}  
            menu={{
                items: produtos_items,
                onClick: addProduto,
            }}
        >
            <Space>
                <Button
                    type="primary"
                    className='add-button'
                    disabled={isEditing}  
                    style={{
                        backgroundColor: '#F7D4D4',
                        color: '#4A0000',
                        border: 'none',
                        borderRadius: '16px',
                        padding: '0 24px',
                    }}
                >
                    Adicionar Produto
                </Button>
            </Space>
            
        </Dropdown>

        {/* Responsive CSS */}
        <style>
            {`
            @media (max-width: 420px) {
                .add-button {
                    white-space: normal; /* Allow text to wrap */
                    text-align: center;  /* Center align text when wrapping */
                    padding: 0 16px;     /* Adjust padding for narrow screens */
                    height: 52px
                }
            }
            `}
        </style>

      </div>
  );
};

export default AddProdutoComponent;
