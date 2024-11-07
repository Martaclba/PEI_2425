import React, { useState, useEffect }  from 'react';
import { Form, Select, Card, Button, Input, Tag, Row, Col, List, ConfigProvider, message } from 'antd';
import { useNavigate, useLocation } from "react-router-dom"

import axios from 'axios'
import {useAuth} from '../context/Auth';
import AddProdutoComponent from '../components/AddProduto';
import { getFormattedDate } from '../components/utils';
import useConfirmModal from '../components/confirmModal';
import themeConfig from '../styles/themeConfigForm';

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
    const {state} = useAuth();
    const navigate = useNavigate()
    const location = useLocation()

    // State for the product list
    const [produtos, setProdutos] = useState([{ key: '1', label: 'Produto 1' }]); 

    // Function to remove a product from the list
    const deleteProduto = (key) => {
        setProdutos(produtos.filter(produto => produto.key !== key));
    };
    
    // State to control edit mode
    const [isEditing, setIsEditing] = useState(false);

    // State to control the field Estado
    // const [isInativo, setIsInativo] = useState(false);

    // Predefined data
    const predefinedValues = {
        Nome: 'Farmácia A',
        Distrito: '1',
        Regiao: ['1', '2'],
        Freguesia: ['3'],
        Morada: ['rua 123'],
        Contacto: ['973493749'],
        Estado: [{label:'Ativo', value:'green'}],
        Notas: ['janknffnkn kajsndkjfn kjsndknfna kajndfnsn'],
        Produtos: [{ key: '1', label: 'Produto 1' }]
    };

    // Update the "Produtos" form field whenever "produtos" state changes
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue({ Produtos: produtos });
    }, [produtos, form]);

    // This is needed because of the use of ConfigProvider
    const { showConfirm, contextHolder } = useConfirmModal();
    const changeState = async (value) => {    
        if (value.length !== 0 && value[0].label === 'Inativo'){
            try{
                // Wait for the user’s response
                const confirmed = await showConfirm();
                if (confirmed) {
                    // Disable the field if confirmed
                    // setIsInativo(true)  
                    console.log("Inactive state.");
                }
            } catch (error) {
                console.log("User cancelled the action.");
                form.setFieldsValue({ Estado: [] });
            }
        }
    }

    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
  
        try {
          const response = await axios.put("http://localhost:5000"+location.pathname, values)
        
          if(response.status === 200){
            message.success("Editado com sucesso")
            console.log('Form submitted successfully:', response.data);
          } else {
            message.error("Oops! Ocorreu algum erro...")
            console.error('Form submission failed:', response.status);
          }
        } catch (error) {
            message.error("Oops! Ocorreu algum erro...")
            console.error('Error submitting form:', error);
        } 
    };

    const handleSubmitIsEdit = () => {
        setIsEditing(false); 
        form.submit(); // Submit the form programmatically
      };

    return(
        <ConfigProvider theme={themeConfig}>
        {contextHolder}
            <div id="contact" style={{height: '100%'}}>
                <div>
                    <div id="title-edit">
                        <div>
                            <h1>Farmácia A</h1>
                            <div style={{ marginBottom: "1rem" }}>{date}</div>
                        </div>
                        <Form.Item>
                            <div className="edit-container">
                                {isEditing ? (
                                <>
                                    <Button type="primary" onClick={handleSubmitIsEdit}>
                                        Guardar
                                    </Button>
                                    <Button danger onClick={() => navigate("/farmacias/")}>
                                        Voltar
                                    </Button>
                                </>
                                ) : (
                                <>
                                {state.isAdmin && <Button type="primary" onClick={() => setIsEditing(true)}>
                                    Editar
                                </Button>}
                                <Button danger onClick={() => navigate("/farmacias/")}>
                                    Voltar
                                </Button>
                                </>
                                )}
                            </div>
                        </Form.Item>
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
                                                message: "Por favor insira um nome" }]}
                                        >
                                            <Input allowClear placeholder="Nome" disabled={!isEditing} />
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
                                            label="Região"
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
                                                    required: true,                                                                       
                                                    message: 'Por favor defina um estado'}]}>
                                            <Select
                                                mode='multiple'  
                                                maxCount={1}       
                                                disabled={!isEditing}                                      
                                                tagRender={tagRender}
                                                options={options2}
                                                labelInValue
                                                onChange={changeState}/>
                                        </Form.Item>
                                    </Card>
                                </Col>

                                <Col xs={24} sm={24} md={12} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Card style={{ flex: 1}}>        
                                        <Form.Item
                                            label="Notas"
                                            name="Notas">
                                            <Input.TextArea rows={10} style={{ maxHeight: '225px', overflow: 'auto' }} disabled={!isEditing}/> 
                                        </Form.Item>

                                        <Form.Item                            
                                            label="Produtos"
                                            name="Produtos"
                                        >
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
                                            </div>
                                        </Form.Item >
                                    </Card>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
        </ConfigProvider>
    )
}
