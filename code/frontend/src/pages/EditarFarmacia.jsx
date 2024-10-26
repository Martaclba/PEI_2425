import React, { useState }  from 'react';
import { Form, Select, Card, Button, Input, Flex, Tag, Row, Col, List, ConfigProvider } from 'antd';
import { useNavigate } from "react-router-dom"

import AddProdutoComponent from '../components/AddProduto';
import { getFormattedDate } from '../components/utils';

const formItemLayout = { labelCol: {span: 6,}, wrapperCol: { span: 14,},};

const options= [
    {
        value: '1',
        label: 'Jack',
    },
    {
        value: '2',
        label: 'Lucy',
    },
    {
        value: '3',
        label: 'Tom',
    },
];

const options2= [
    {
    value: 'blue',
    label: 'Indisponível',
    },
    {
    value: 'volcano',
    label: 'Inativo',
    },
    {
    value: 'green',
    label: 'Ativo',
    },
];

const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginInlineEnd: 4,
        }}
      >
        {label}
      </Tag>
    );
};

export default function EditarFarmacia() {
    const date = getFormattedDate();

    let navigate = useNavigate()

    // State for the product list (initialy empty)
    const [produtos, setProdutos] = useState([{ key: '1', label: 'Produto 1' }]); 

    // Function to remove a product from the list
    const deleteProduto = (key) => {
        setProdutos(produtos.filter(produto => produto.key !== key));
    };

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };
    
    // State to control edit mode
      const [isEditing, setIsEditing] = useState(false);
    
      // Predefined data
      const predefinedValues = {
        Nome: {
          Primeiro: 'John',
          Ultimo: 'Doe',
        },
        Distrito: '1',
        Regiao: ['1', '2'],
        Freguesia: ['3'],
        Morada: ['rua 123'],
        Contacto: ['973493749'],
        Estado: [{label:'Ativo', value:'green'}],
        Notas: ['janknffnkn kajsndkjfn kjsndknfna kajndfnsn']
      };

    return(
        <ConfigProvider
        theme={{
          "components": {
            "Select": {
              "colorBgContainerDisabled": "rgba(255,255,255)",
              "colorTextDisabled": "rgb(0,0,0)"
            },
            "Input": {
              "colorTextDisabled": "rgb(0,0,0)",
              "colorBgContainerDisabled": "rgb(255,255,255)",
            }
          }
        }}>
        <div id="contact" style={{height: '100%'}}>
        <div>
            <div id="title-edit">
                <h1>Registar Farmácia</h1>
                <Form.Item>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {isEditing ? (
                        <>
                            <Button type="primary" onClick={() => setIsEditing(false)}>
                            Guardar
                            </Button>
                            <Button danger onClick={() => navigate("/delegados/")}>
                            Voltar
                            </Button>
                        </>
                        ) : (
                        <>
                        <Button type="primary" onClick={() => setIsEditing(true)}>
                            Editar
                        </Button>
                        <Button danger onClick={() => navigate("/delegados/")}>
                            Voltar
                        </Button>
                        </>
                        )}
                    </div>
                </Form.Item>
            </div>
            <div style={{marginBottom:"1rem",marginTop:"1rem"}}>
                {date}                    
            </div>
        </div>

        <div style={{width: '100%', height: '80%', justifySelf: 'center', alignContent: 'center'}}>
                    <Form  
                        name="validate_other"
                        {...formItemLayout}
                        onFinish={onFinish}
                        layout='vertical'
                        initialValues={predefinedValues}
                    >

                        <Row gutter={16} style={{ display: 'flex' }}>
                            <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
                                <Card style={{flex: 1}}>
                                    <Form.Item label="Nome" name="Nome" style={{ marginBottom: 0 }}>
                                        <Form.Item
                                            name={['Nome', 'Primeiro']}
                                            hasFeedback
                                            rules={[{ required: true, message: "Insira o primeiro nome" }]}
                                            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                                        >
                                            <Input allowClear placeholder="Primeiro" disabled={!isEditing} />
                                        </Form.Item>

                                        <Form.Item
                                            name={['Nome', 'Ultimo']}
                                            hasFeedback
                                            rules={[{ required: true, message: "Insira o último nome" }]}
                                            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                                        >
                                            <Input allowClear placeholder="Último"  disabled={!isEditing}/>
                                        </Form.Item>
                                    </Form.Item>

                                    <Form.Item
                                        label="Distrito"
                                        name="Distrito"
                                        hasFeedback
                                        rules={[{
                                            required: true,
                                            message: 'Por favor insira um distrito',},]}>

                                        <Select 
                                            allowClear
                                            showSearch
                                            placeholder="Insira um distrito"
                                            disabled={!isEditing}
                                            options={options}
                                            filterOption={(input, option) => 
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Região HMR"
                                        name="Regiao"
                                        hasFeedback
                                        rules={[{
                                            required: true,
                                            message: 'Por favor insira uma região',},]}>

                                        <Select 
                                            allowClear
                                            showSearch
                                            placeholder="Insira uma região"
                                            options={options}
                                            disabled={!isEditing}
                                            filterOption={(input, option) => 
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Freguesia"
                                        name="Freguesia"
                                        hasFeedback
                                        rules={[{
                                            required: true,
                                            message: 'Por favor insira uma freguesia',},]}>
                                        <Select 
                                            allowClear
                                            showSearch
                                            placeholder="Insira uma freguesia"
                                            options={options}
                                            disabled={!isEditing}
                                            filterOption={(input, option) => 
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Morada"
                                        name="Morada"
                                        hasFeedback
                                        rules={[{
                                            required: true,
                                            message: 'Por favor insira uma morada',},]}>

                                        <Select 
                                            allowClear
                                            showSearch
                                            placeholder="Insira uma morada"
                                            options={options}
                                            disabled={!isEditing}
                                            filterOption={(input, option) => 
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Contacto"
                                        name="Contacto"
                                        hasFeedback
                                        rules={[{
                                            required: true,
                                            type: 'number',
                                            message: 'Por favor insira um contacto',},]}>

                                        <Select 
                                            allowClear
                                            showSearch
                                            placeholder="Insira uma morada"
                                            options={options}
                                            disabled={!isEditing}
                                            filterOption={(input, option) => 
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Estado"
                                        name="Estado"
                                        rules={[{
                                                required: true,                                                                        // meter depois
                                                message: 'Por favor defina um estado'}]}>
                                        <Select
                                            mode='multiple'  
                                            maxCount={1}       
                                            disabled={!isEditing}                                      
                                            tagRender={tagRender}
                                            options={options2}
                                            defaultValue={[{label:'Ativo', value:'green'}]}/>
                                    </Form.Item>
                                </Card>
                            </Col>

                            <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
                                <Card style={{ flex: 1}}>        
                                    <Form.Item
                                        label="Notas"
                                        name="Notas">
                                        <Input.TextArea rows={10} style={{ maxHeight: '225px', overflow: 'auto' }} disabled={!isEditing}/> 
                                    </Form.Item>

                                    <Form.Item                            
                                        label="Produtos"
                                        name="Produtos">

                                        <List 
                                            id='Product_List'
                                            bordered
                                            dataSource={produtos}
                                            rows={10}
                                            style={{ maxHeight: '225px', overflow: 'auto' }}
                                            renderItem={(produto) => (
                                                <List.Item style={{ display: 'flex', justifyContent: 'space-between'}}>
                                                    {produto.label}

                                                    <div style={{ display: 'flex' }}>
                                                        <Button
                                                            disabled={!isEditing}
                                                            type="default"
                                                            style={{ backgroundColor: '#F0F3FA', color: '#4A4A4A', borderRadius: '12px' }}
                                                            onClick={() => deleteProduto(produto.key)}
                                                        >
                                                            Remover
                                                        </Button>
                                                    </div>
                                                </List.Item>
                                        )}/>
                                        
                                        {/* Pass down the state and set function to AddProduto_Component */}
                                        <AddProdutoComponent produtos={produtos} setProdutos={setProdutos}  isEditing={!isEditing}/>
                                    </Form.Item>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
            </div>
        </div>
        </ConfigProvider>
    )
};
