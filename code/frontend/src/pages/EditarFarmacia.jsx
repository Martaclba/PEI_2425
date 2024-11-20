import React, { useState, useEffect }  from 'react';
import { Form, Select, Card, Button, Input, Tag, Row, Col, List, ConfigProvider, message, AutoComplete, Spin } from 'antd';
import { useNavigate, useLocation } from "react-router-dom"

import axios from 'axios'

import {useAuth} from '../context/Auth';
import AddProdutoComponent from '../components/AddProduto';
import { getFormattedDate } from '../components/utils';
import useConfirmModal from '../components/confirmModal';
import themeConfig from '../styles/themeConfigForm';
import useFormDataStore from '../context/FormData';
import { useFetchFormData } from '../components/useFetchFormData';
import { useFetchUser } from '../components/useFetchUser';

const states = [
    {
      value: 'Indisponível',
      label: 'Indisponível',
    },
    {
      value: 'Inativo',
      label: 'Inativo',
    },
    {
      value: 'Ativo',
      label: 'Ativo',
    },
  ];

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
  
    // Set color based on the value
    const colorMap = {
      Ativo: 'green',     
      Inativo: 'volcano',         
      Indisponível: 'blue',       
    };
  
    return (
      <Tag
        key={value}
        color={colorMap[value] || 'blue'}
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
    const [form] = Form.useForm();

    const {state} = useAuth();
    const navigate = useNavigate()
    const location = useLocation()

    // Get state from Zustand store
    const { hasFetched, districts, regions, towns } = useFormDataStore((state) => state) 

    // If the form data fetch didnt happen, then fetch the data, 
    // update the store and set the form's selects
    useFetchFormData(!hasFetched)

    // Fetch the user's info
    const { data, loading } = useFetchUser(location.pathname, 'doctor')

    // State to control edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [fetchTrigger, setFetchTrigger] = useState(false)
    const [isFormValid, setIsFormValid] = useState(false);

    // State for the product list
    const [produtos, setProdutos] = useState([{ key: '1', label: 'Produto 1' }]); 

    // Function to remove a product from the list
    const deleteProduto = (key) => {
        setProdutos(produtos.filter(produto => produto.key !== key));
    };

    // Update the "Produtos" form field whenever "produtos" state changes
    useEffect(() => {
        form.setFieldsValue({ Produtos: produtos });
    }, [produtos, form]);

    // This is needed because of the use of ConfigProvider
    const { showConfirm, contextHolder } = useConfirmModal();
    const changeState = async (value) => {    
        if (value.length !== 0 && value[0] === 'Inativo'){
            try{
                // Wait for the user’s response
                const confirmed = await showConfirm();
                if (confirmed) {
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
          const response = await axios.put(process.env.REACT_APP_API_PATH + location.pathname, values)
        
          if(response.status === 200){
            message.success("Editado com sucesso")
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

    const handleSubmitIsEdit = () => {
        setIsEditing(false);
        // Submit the form programmatically 
        form.submit(); 
    };

    const handleEditClick = async () => {
        setIsEditing(true);
        try {
          await form.validateFields(); 
        } catch (errorInfo) {
          
        }
    };

    // Function to check form validity when editing
    const checkFormValidity = () => {
        const hasErrors = form.getFieldsError().some(({ errors }) => errors.length > 0);
        setIsFormValid(!hasErrors);
    };

    if (loading) {
        return <Spin fullscreen tip="Carregando dados..." />;
    }

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
                                    <Button type="primary" onClick={handleSubmitIsEdit} disabled={!isFormValid}>
                                        Guardar
                                    </Button>
                                    <Button danger onClick={() => navigate("/farmacias/")}>
                                        Voltar
                                    </Button>
                                </>
                                ) : (
                                <>
                                {state.isAdmin && <Button type="primary" onClick={handleEditClick}>
                                    Editar
                                </Button>}
                                <Button danger onClick={() => navigate("/farmacias/", { state: { shouldFetchData: fetchTrigger } })}>
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
                            onFinish={onFinish}
                            layout='vertical'
                            initialValues={data}
                            onFieldsChange={checkFormValidity}
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
                                                message: 'Por favor insira um distrito',},]}
                                        >

                                            <AutoComplete
                                                allowClear
                                                options={districts}
                                                placeholder="Insira um distrito"
                                                disabled={!isEditing}
                                                filterOption={(inputValue, option) =>
                                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                                }
                                            /> 
                                        </Form.Item>

                                        <Form.Item
                                            label="Região"
                                            name="Regiao"
                                            hasFeedback
                                            rules={[{
                                                required: true,
                                                message: 'Por favor insira uma região',},]}
                                        >

                                            <AutoComplete
                                                allowClear
                                                options={regions}
                                                placeholder="Insira uma região"
                                                disabled={!isEditing}
                                                filterOption={(inputValue, option) =>
                                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                                }
                                            />  
                                        </Form.Item>

                                        <Form.Item
                                            label="Freguesia"
                                            name="Freguesia"
                                            hasFeedback
                                        >

                                            <AutoComplete
                                                allowClear
                                                options={towns}
                                                placeholder="Insira uma freguesia"
                                                disabled={!isEditing}
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
                                                <Input allowClear placeholder="Insira uma rua" disabled={!isEditing}/>
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
                                                    <Input maxLength={8} allowClear placeholder="Insira um código postal" disabled={!isEditing}/>
                                                </Form.Item>

                                                <Form.Item
                                                    name="Edificio"
                                                    hasFeedback
                                                    style={{ flex: 0.6 }}
                                                >
                                                    <Input allowClear placeholder="Insira um edifício" disabled={!isEditing}/>
                                                </Form.Item>  
                                            </div>                                  
                                        </Form.Item>

                                        <Form.Item label="Contacto" style={{ marginBottom: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                                <Form.Item
                                                    name="Telefone"
                                                    hasFeedback
                                                    rules={[{
                                                        required: true,
                                                        message: 'Por favor insira um telefone'}]}
                                                    style={{ flex: 0.4}}
                                                >
                                                    <Input allowClear placeholder="Insira um telefone" disabled={!isEditing}/>
                                                </Form.Item>

                                                <Form.Item
                                                    name="Email"
                                                    hasFeedback
                                                    rules={[{type: 'email', message: 'Formato inválido'}]}                            
                                                    style={{ flex: 0.6}}

                                                >
                                                    <Input allowClear placeholder="Insira um email" disabled={!isEditing}/>
                                                </Form.Item>
                                            </div>
                                        </Form.Item>                                        
                                    </Card>
                                </Col>

                                <Col xs={24} sm={24} md={12} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Card style={{ flex: 1}}>     
                                        <Form.Item
                                            label="Estado"
                                            name="Estado"
                                            rules={[{
                                                    required: true,                                                                       
                                                    message: 'Por favor defina um estado'}]}>
                                            <Select
                                                allowClear                                    
                                                mode='multiple'  
                                                maxCount={1}       
                                                tagRender={tagRender}
                                                placeholder="Insira um estado"
                                                options={states}
                                                disabled={!isEditing}                                      
                                                onChange={changeState}/>
                                        </Form.Item>

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
