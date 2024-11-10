import React, {useState} from 'react';
import { Form, Select, Card, Button, Input, Flex, Row, Col, Tag, message, AutoComplete } from 'antd';
import { useNavigate } from "react-router-dom"

import axios from 'axios'

import { getFormattedDate } from '../components/utils';
import useFormDataStore from '../context/FormData';
import { useFetchFormData } from '../components/useFetchFormData';

const states= [
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


export default function RegistarMedico() {
    const date = getFormattedDate();

    const navigate = useNavigate()

    // Get state from Zustand store
    const { hasFetched, instituitions, specialties, districts, hmr_regions, parishes } = useFormDataStore((state) => state) 

    // If the form data fetch didnt happen, then fetch the data, 
    // update the store and set the form's selects
    useFetchFormData(!hasFetched)

    const [fetchTrigger, setFetchTrigger] = useState(false)

    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
    
        try {
            const response = await axios.post("http://localhost:5000/medicos/registar/", values)
        
            if (response.status === 200){
                message.success("Registado com sucesso")
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

    return(
        <div id="contact" style={{height: '100%'}}>
            <div>
                <h1>Registar Médico</h1>

                <div>
                    {date}                    
                </div>
            </div>

            <div style={{width: '100%', height: '80%', justifySelf: 'center', alignContent: 'center'}}>
                        <Form  
                            name="validate_other"
                            onFinish={onFinish}
                            layout='vertical'
                            initialValues={{Estado: [{label:'Ativo', value:'green'}],}}
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
                                            <Input allowClear placeholder="Nome"/>
                                        </Form.Item>

                                        <Form.Item
                                            label="Instituição"
                                            name="Instituicao"
                                            hasFeedback
                                            rules={[{
                                                required: true,
                                                message: 'Por favor insira uma instituição'}]}>
                                            
                                            <AutoComplete
                                                allowClear
                                                options={instituitions}
                                                placeholder="Insira uma instituição"
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
                                                message: 'Por favor insira uma especialidade'}]}>

                                            <AutoComplete
                                                allowClear
                                                options={specialties}
                                                placeholder="Insira uma especialidade"
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
                                                message: 'Por favor insira uma região'}]}>
                                            
                                            <AutoComplete
                                                allowClear
                                                options={hmr_regions}
                                                placeholder="Insira uma região"
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
                                                message: 'Por favor insira uma freguesia'}]}>

                                            <AutoComplete
                                                allowClear
                                                options={parishes}
                                                placeholder="Insira uma freguesia"
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

                                            <Input allowClear placeholder="Insira uma morada"/>
                                        </Form.Item>

                                        <Form.Item
                                            label="Contacto"
                                            name="Contacto"
                                            hasFeedback
                                            rules={[{
                                                required: true,
                                                message: 'Por favor insira um contacto'}]}
                                        >

                                            <Input allowClear placeholder="Insira um contacto"/>
                                        </Form.Item>

                                        <Form.Item
                                            label="Estado"
                                            name="Estado">

                                            <Select 
                                                allowClear
                                                mode='multiple'         
                                                disabled                                     
                                                tagRender={renderDisabledTag}                                 
                                                placeholder="Insira um estado"
                                                options={states}
                                                filterOption={(input, option) => 
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                                        </Form.Item>

                                        <Form.Item
                                            label="Notas"
                                            name="Notas">
                                            <Input.TextArea rows={10} style={{ maxHeight: 150, overflow: 'auto' }}/> 
                                        </Form.Item>

                                        <Form.Item>
                                            <Flex gap="large">
                                                <Button type="primary" htmlType="submit">
                                                    Confirmar
                                                </Button>
                                                <Button danger onClick={() => navigate("/medicos/", { state: { shouldFetchData: fetchTrigger } })}>
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
