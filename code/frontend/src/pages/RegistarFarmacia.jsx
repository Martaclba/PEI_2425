import React, { useState, useEffect }  from 'react';
import { Form, Select, Card, Button, Input, Flex, Tag, Row, Col, List } from 'antd';
import { useNavigate } from "react-router-dom"

import AddProdutoComponent from '../components/AddProduto';
import { getFormattedDate } from '../components/utils';

// const formItemLayout = { labelCol: {span: 6,}, wrapperCol: { span: 14,},};

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

const renderDisabledTag = (props) => {
    const { label, value, closable, onClose } = props;

    return (
        <Tag
            color={value}
            closable={closable}
            onClose={onClose}
            style={{ marginInlineEnd: 4 }}
        >
            {label}
        </Tag>
    );
};

const onFinish = (values) => {
    console.log('Received values of form: ', values);
};

export default function RegistarFarmacia() {
    const date = getFormattedDate();

    const navigate = useNavigate()

    // State for the product list (initialy empty)
    const [produtos, setProdutos] = useState([]); 

    // Function to remove a product from the list
    const deleteProduto = (key) => {
        setProdutos(produtos.filter(produto => produto.key !== key));
    };

    // Predefined data
    const predefinedValues = {
        Contacto: '2342213',
        Estado: [{label:'Ativo', value:'green'}],
    };
    
    // Update the "Produtos" form field whenever "produtos" state changes
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue({ Produtos: produtos });
    }, [produtos, form]);

    return(
        <div id="contact" style={{height: '100%'}}>
        <div>
            <h1>Registar Farmácia</h1>

            <div>
                {date}                    
            </div>
        </div>

        <div style={{width: '100%', height: '80%', justifySelf: 'center', alignContent: 'center'}}>
                    <Form  
                        form={form}
                        name="validate_other"
                        // {...formItemLayout}
                        onFinish={onFinish}
                        layout='vertical'
                        initialValues={predefinedValues}
                    >

                        <Row gutter={16} style={{ display: 'flex' }}>
                            <Col xs={24} sm={24} md={12} style={{ display: 'flex', flexDirection: 'column' }}>
                                <Card style={{flex: 1}}>
                                <Form.Item
                                        label="Nome" 
                                        name="Nome"
                                        hasFeedback
                                        rules={[{ 
                                            required: true, 
                                            message: "Insira um nome" }]}
                                    >
                                        <Input allowClear placeholder="Nome"/>
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
                                            filterOption={(input, option) => 
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Contacto"
                                        name="Contacto"
                                        hasFeedback
                                        rules={[{
                                            required: true,
                                            message: 'Por favor insira um contacto',},]}>

                                        <Select 
                                            allowClear
                                            showSearch
                                            placeholder="Insira uma morada"
                                            options={options}
                                            filterOption={(input, option) => 
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Estado"
                                        name="Estado">

                                        <Select
                                            mode='multiple'         
                                            disabled                                       
                                            tagRender={renderDisabledTag}/>
                                    </Form.Item>
                                </Card>
                            </Col>

                            <Col xs={24} sm={24} md={12} style={{ display: 'flex', flexDirection: 'column' }}>
                                <Card style={{ flex: 1}}>        
                                    <Form.Item
                                        label="Notas"
                                        name="Notas">
                                        <Input.TextArea rows={10} style={{ maxHeight: '225px', overflow: 'auto' }}/> 
                                    </Form.Item>

                                    <Form.Item                            
                                        label="Produtos"
                                        name="Produtos">
                                        
                                        <div>
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
                                            <AddProdutoComponent produtos={produtos} setProdutos={setProdutos}/>
                                        </div>
                                    </Form.Item>

                                    <Form.Item>
                                        <Flex gap="large">
                                            <Button type="primary" htmlType="submit">
                                                Confirmar
                                            </Button>
                                            <Button danger onClick={() => navigate("/farmacias/")}>
                                                Cancelar
                                            </Button>   
                                        </Flex>
                                    </Form.Item>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
            </div>
        </div>
    )
};
