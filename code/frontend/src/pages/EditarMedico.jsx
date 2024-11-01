import React, { useState } from 'react';
import { Form, Select, Card, Button, Input, Row, Col, Tag, ConfigProvider } from 'antd';
import { useNavigate } from "react-router-dom";

import { getFormattedDate } from '../components/utils';
import useConfirmModal from '../components/confirmModal';
import themeConfig from '../styles/themeConfigForm';

// const formItemLayout = { labelCol: {span: 6,}, wrapperCol: { span: 14,},};

const options= [
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

const onFinish = (values) => {
    console.log('Received values of form: ', values);
};

export default function EditarMedico() {
    const date = getFormattedDate();
    const navigate = useNavigate();

    // State to control edit mode
    const [isEditing, setIsEditing] = useState(false);
    
    // State to control the field Estado
    // const [isInativo, setIsInativo] = useState(false);

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
                                    <Button danger onClick={() => navigate("/medicos/")}>
                                        Voltar
                                    </Button>
                                </>
                                ) : (
                                <>
                                    <Button type="primary" onClick={() => setIsEditing(true)}>
                                        Editar
                                    </Button>
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
                                        <Input allowClear placeholder="Nome"  disabled={!isEditing}/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Instituição"
                                        name="Instituicao"
                                        hasFeedback
                                        rules={[{
                                            required: true,
                                            message: 'Por favor insira uma instituição',},]}>

                                        <Select 
                                            allowClear
                                            showSearch
                                            placeholder="Insira uma instituição"
                                            options={options}
                                            disabled={!isEditing}
                                            filterOption={(input, option) => 
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Especialidade"
                                        name="Especialidade"
                                        hasFeedback
                                        rules={[{
                                            required: true,
                                            message: 'Por favor insira uma especialidade',},]}>

                                        <Select 
                                            allowClear
                                            showSearch
                                            placeholder="Insira uma especialidade"
                                            options={options}
                                            disabled={!isEditing}
                                            filterOption={(input, option) => 
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
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
                                            disabled={!isEditing}
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
                                            placeholder="Insira um contacto"
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
                                            allowClear
                                            mode='multiple'         
                                            maxCount={1}                                       
                                            tagRender={tagRender}
                                            placeholder="Insira um estado"
                                            options={options}
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
