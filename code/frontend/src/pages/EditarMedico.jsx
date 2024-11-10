import React, { useState } from 'react';
import { Form, Select, Card, Button, Input, Row, Col, Tag, ConfigProvider, message, AutoComplete } from 'antd';
import { useNavigate, useLocation } from "react-router-dom";
import {useAuth} from '../context/Auth';

import axios from 'axios'

import { getFormattedDate } from '../components/utils';
import useConfirmModal from '../components/confirmModal';
import themeConfig from '../styles/themeConfigForm';
import useFormDataStore from '../context/FormData';
import { useFetchFormData } from '../components/useFetchFormData';

const states = [
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

export default function EditarMedico() {
    const date = getFormattedDate();
    const {state} = useAuth();
    const navigate = useNavigate();
    const location = useLocation()

    // Get state from Zustand store
    const { hasFetched, instituitions, specialties, districts, hmr_regions, parishes } = useFormDataStore((state) => state) 

    // If the form data fetch didnt happen, then fetch the data, 
    // update the store and set the form's selects
    useFetchFormData(!hasFetched)

    const [fetchTrigger, setFetchTrigger] = useState(false)

    // State to control edit mode
    const [isEditing, setIsEditing] = useState(false);
    
    // Predefined data for the form
    const predefinedValues = {
        Nome: 'John',
        Instituicao: 'Inativo',
        Especialidade: 'Ativo',
        Distrito: 'Indisponivel',
        Regiao: 'Inativo',
        Freguesia: 'Inativo',
        Morada: 'Ativo',
        Contacto: '123456789',
        Estado: [{label:'Ativo', value:'green'}],
        Notas: 'Some default notes here...',
    };

    const [form] = Form.useForm();

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

    return(
        <ConfigProvider theme={themeConfig}>
        {contextHolder}
            <div id="contact" style={{height: '100%'}}>
                <div>
                    <div id="title-edit">
                        <div>
                            <h1>Médico A</h1>
                            <div style={{ marginBottom: "1rem" }}>{date}</div>                        
                        </div>
                        <Form.Item>
                            <div className="edit-container">
                                {isEditing ? (
                                <>
                                    <Button type="primary" onClick={handleSubmitIsEdit}>
                                        Guardar
                                    </Button>
                                    <Button danger onClick={() => navigate("/medicos/", { state: { shouldFetchData: fetchTrigger } })}>
                                        Voltar
                                    </Button>
                                </>
                                ) : (
                                <>
                                    {state.isAdmin && <Button type="primary" onClick={() => setIsEditing(true)}>
                                        Editar
                                    </Button>}
                                    <Button danger onClick={() => navigate("/medicos/")}>
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
                                        <Input allowClear placeholder="Nome"  disabled={!isEditing}/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Instituição"
                                        name="Instituicao"
                                        hasFeedback
                                        rules={[{
                                            required: true,
                                            message: 'Por favor insira uma instituição'}]}
                                    >

                                        <AutoComplete
                                            allowClear
                                            options={instituitions}
                                            placeholder="Insira uma instituição"
                                            disabled={!isEditing}
                                            filterOption={(inputValue, option) =>
                                                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        /> 
                                    </Form.Item>

                                    <Form.Item
                                        label="Especialidade"
                                        name="Especialidade"
                                        hasFeedback
                                        rules={[{
                                            required: true,
                                            message: 'Por favor insira uma especialidade'}]}
                                    >

                                        <AutoComplete
                                            allowClear
                                            options={specialties}
                                            placeholder="Insira uma especialidade"
                                            disabled={!isEditing}
                                            filterOption={(inputValue, option) =>
                                                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        />  
                                    </Form.Item>

                                    <Form.Item
                                        label="Distrito"
                                        name="Distrito"
                                        hasFeedback
                                        rules={[{
                                            required: true,
                                            message: 'Por favor insira um distrito'}]}>

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
                                        label="Região HMR"
                                        name="Regiao"
                                        hasFeedback
                                        rules={[{
                                            required: true,
                                            message: 'Por favor insira uma região',}]}
                                    >

                                        <AutoComplete
                                            allowClear
                                            options={hmr_regions}
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
                                        rules={[{
                                            required: true,
                                            message: 'Por favor insira uma freguesia'}]}
                                    >
                                        
                                        <AutoComplete
                                            allowClear
                                            options={parishes}
                                            placeholder="Insira uma freguesia"
                                            disabled={!isEditing}
                                            filterOption={(inputValue, option) =>
                                                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        />
                                    </Form.Item>
                                </Card>
                            </Col>

                            <Col xs={24} sm={24} md={12} style={{ display: 'flex', flexDirection: 'column' }}>
                                <Card style={{ flex: 1}}>        
                                    <Form.Item
                                        label="Morada"
                                        name="Morada"
                                        hasFeedback
                                        rules={[{
                                            required: true,
                                            message: 'Por favor insira uma morada'}]}
                                    >

                                        <Input allowClear placeholder="Insira uma morada" disabled={!isEditing}/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Contacto"
                                        name="Contacto"
                                        hasFeedback
                                        rules={[{
                                            required: true,
                                            message: 'Por favor insira um contacto'}]}>

                                        <Input allowClear placeholder="Insira um contacto" disabled={!isEditing}/>
                                    </Form.Item>

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
                                            labelInValue
                                            onChange={changeState}
                                            filterOption={(input, option) => 
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Notas"
                                        name="Notas">
                                        <Input.TextArea rows={10} style={{ maxHeight: 150, overflow: 'auto' }} disabled={!isEditing}/> 
                                    </Form.Item>                            
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </ConfigProvider>
    )
}
