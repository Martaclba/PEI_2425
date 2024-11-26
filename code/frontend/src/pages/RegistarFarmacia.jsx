import React, { useState, useEffect }  from 'react';
import { Form, Select, Card, Button, Input, Flex, Tag, Row, Col, List, message, AutoComplete } from 'antd';
import { useNavigate } from "react-router-dom"

import axios from 'axios';

import AddProdutoComponent from '../components/AddProduto';
import { getFormattedDate } from '../components/utils';
import useFormDataStore from '../context/FormData';
import { useFetchFormData } from '../components/useFetchFormData';


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
        Estado: [{label:'Ativo', value:'green'}],
    };
    
    // Update the "Produtos" form field whenever "produtos" state changes
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue({ Produtos: produtos });
    }, [produtos, form]);

    // Get state from Zustand store
    const { hasFetched, districts, regions, towns } = useFormDataStore((state) => state) 

    // If the form data fetch didnt happen, then fetch the data, 
    // update the store and set the form's selects
    useFetchFormData(!hasFetched)

    const [fetchTrigger, setFetchTrigger] = useState(false)

    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
    
        try {
            const response = await axios.post(process.env.REACT_APP_API_PATH + "/farmacias/registar/", values, { headers: { 'Content-Type': 'application/json' } })
        
            if (response.status === 200){
                message.success("Registada com sucesso")
                console.log('Form submitted successfully:', response.data);
                setFetchTrigger(true);
            } else {
                message.error("Oops! Ocorreu algum erro...")
                console.error('Form submission failed:', response.status);
            }
        } catch (error) {
            message.error("Oops! Ocorreu algum erro...")
            console.error('Error submitting form:', error);
        }
    };
    
    const handleSelect = (fieldName, option) => {
        // Update the form field with the label when an option is selected
        form.setFieldValue(fieldName, option.label);
    };

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
                                            message: 'Por favor insira um distrito',}]}>

                                        <AutoComplete
                                            allowClear
                                            options={districts}
                                            placeholder="Insira um distrito"
                                            onSelect={(value, option) => handleSelect('Distrito', option)}
                                            filterOption={(inputValue, option) =>
                                                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        />  
                                    </Form.Item>

                                    <Form.Item
                                        label="Região HMR"
                                        name="Regiao"
                                        hasFeedback
                                        rules={[{
                                            required: true,
                                            message: 'Por favor insira uma região',}]}>

                                        <AutoComplete
                                            allowClear
                                            options={regions}
                                            placeholder="Insira uma região"
                                            onSelect={(value, option) => handleSelect('Regiao', option)}
                                            filterOption={(inputValue, option) =>
                                                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        />   
                                    </Form.Item>

                                    <Form.Item
                                        label="Freguesia"
                                        name="Freguesia"
                                        hasFeedback>
                                        
                                        <AutoComplete
                                            allowClear
                                            options={towns}
                                            placeholder="Insira uma freguesia"
                                            onSelect={(value, option) => handleSelect('Freguesia', option)}
                                            filterOption={(inputValue, option) =>
                                                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        />     
                                    </Form.Item>

                                    <Form.Item label="Morada" style={{ marginBottom: 0 }}>                                        
                                        <Form.Item
                                            name="Rua"
                                            hasFeedback
                                            rules={[{
                                                required: true,
                                                message: 'Por favor insira uma rua'}]}
                                        >
                                            <Input allowClear placeholder="Insira uma rua" />
                                        </Form.Item>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                        <Form.Item
                                            name="Codigo_postal"
                                            hasFeedback
                                            rules={[
                                                {required: true, message: 'Por favor insira um código postal'},
                                                {pattern: /^\d{4}-\d{3}$/, message: 'Por favor utilize o formato dddd-ddd'}
                                            ]}
                                            style={{ flex: 0.4 }}
                                        >
                                            <Input maxLength={8} allowClear placeholder="Insira um código postal" />
                                        </Form.Item>

                                        <Form.Item
                                            name="Edificio"
                                            hasFeedback
                                            style={{ flex: 0.6 }}
                                        >
                                            <Input allowClear placeholder="Insira um edifício" />
                                        </Form.Item>  
                                        </div>                                  
                                    </Form.Item>

                                    <Form.Item label="Contacto" style={{ marginBottom: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                            <Form.Item
                                                name="Telefone"
                                                hasFeedback
                                                rules={[
                                                    {pattern: /^\d{9}$/, message: 'Por favor insira 9 digitos'},
                                                    {required: true, message: 'Por favor insira um telefone'}
                                                ]}
                                                style={{ flex: 0.4}}
                                            >
                                                <Input allowClear placeholder="Insira um telefone" />
                                            </Form.Item>

                                            <Form.Item
                                                name="Email"
                                                hasFeedback
                                                rules={[{type: 'email', message: 'Formato inválido'}]}                            
                                                style={{ flex: 0.6}}

                                            >
                                                <Input allowClear placeholder="Insira um email" />
                                            </Form.Item>
                                        </div>
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
                                            <Button danger onClick={() => navigate("/farmacias/", { state: { shouldFetchData: fetchTrigger } })}>
                                                Voltar
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
