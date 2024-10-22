import React, { useState }  from 'react';
import { Form, Select, Card, Button, Input, Flex, Tag, Row, Col, List } from 'antd';
import { useNavigate } from "react-router-dom"

import AddProdutoComponent from '../components/AddProduto';

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

export default function RegistarFarmacia() {
    const currentDate = new Date();
    const date_options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const date = currentDate.toLocaleDateString('pt-BR', date_options);
  
    let navigate = useNavigate()

    // State for the product list (initialy empty)
    const [produtos, setProdutos] = useState([]); 

    // Function to remove a product from the list
    const deleteProduto = (key) => {
        setProdutos(produtos.filter(produto => produto.key !== key));
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
                        name="validate_other"
                        {...formItemLayout}
                        onFinish={onFinish}
                        layout='vertical'
                    >

                        <Row gutter={16} style={{ display: 'flex' }}>
                            <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
                                <Card style={{flex: 1}}>
                                    <Form.Item label="Nome" name="Nome" style={{ marginBottom: 0 }}>
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
                                        label="Instituicao"
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
                                            type: 'number',
                                            message: 'Por favor insira um contacto',},]}>

                                        <Select 
                                            allowClear
                                            showSearch
                                            placeholder="Insira uma morada"
                                            options={options}
                                            filterOption={(input, option) => 
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                                    </Form.Item>
                                </Card>
                            </Col>

                            <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
                                <Card style={{ flex: 1}}>        
                                    <Form.Item
                                        label="Notas"
                                        name="Notas">
                                        <Input.TextArea rows={10} style={{ maxHeight: '225px', overflow: 'auto' }}/> 
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


                                    </Form.Item>

                                    <Form.Item
                                        label="Estado"
                                        name="Estado">

                                        <Select 
                                            allowClear
                                            mode='multiple'         
                                            disabled                                       
                                            tagRender={tagRender}
                                            defaultValue={[{label:'Ativo', value:'green'}]}                                        
                                            placeholder="Insira um estado"
                                            options={options}
                                            filterOption={(input, option) => 
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                                    </Form.Item>
                                </Card>

                                <Card style={{ flex: 1}}>        
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
