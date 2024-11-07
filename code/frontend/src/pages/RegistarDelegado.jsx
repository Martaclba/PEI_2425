import React, { useState } from 'react';
import { Form, Select, Card, Button, Input, Flex, message } from 'antd';
import { useNavigate } from "react-router-dom"

import axios from 'axios';

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



export default function RegistarDelegado() {
    const date = getFormattedDate();

    const navigate = useNavigate()
    
    const [fetchTrigger, setFetchTrigger] = useState(false)

    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
    
        try {
            const response = await axios.post("http://localhost:5000/delegados/registar/", values)
        
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
                <h1>Registar Delegado</h1>

                <div>
                    {date}                    
                </div>
            </div>

            <div style={{width: '100%', height: '80%', justifySelf: 'center', alignContent: 'center'}}>
                <Card>
                        <Form  
                            name="validate_other"
                            // {...formItemLayout}
                            onFinish={onFinish}
                            layout='vertical'
                        >

                            <Form.Item label="Nome" style={{ marginBottom: 0 }}>
                                <Form.Item
                                    name="Primeiro"
                                    hasFeedback
                                    rules={[{ required: true, message: "Insira o primeiro nome" }]}
                                    style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                                >
                                    <Input allowClear placeholder="Primeiro" />
                                </Form.Item>

                                <Form.Item
                                    name="Ultimo"
                                    hasFeedback
                                    rules={[{ required: true, message: "Insira o último nome" }]}
                                    style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                                >
                                    <Input allowClear placeholder="Último" />
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
                                    placeholder="Insira uma região"
                                    options={options}
                                    filterOption={(input, option) => 
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                            </Form.Item>

                            <Form.Item
                                label="Freguesia"
                                name="Freguesia"
                                hasFeedback>
                                
                                <Select 
                                    allowClear
                                    placeholder="Insira uma freguesia"
                                    options={options}
                                    filterOption={(input, option) => 
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                            </Form.Item>

                            <Form.Item>
                                <Flex gap="large">
                                    <Button type="primary" htmlType="submit">
                                        Confirmar
                                    </Button>
                                    <Button danger onClick={() => navigate("/delegados/", { state: { shouldFetchData: fetchTrigger } })}>
                                        Voltar
                                    </Button>   
                                </Flex>
                            </Form.Item>
                        </Form>
                    </Card>                    
                </div>
        </div>
    )
};
