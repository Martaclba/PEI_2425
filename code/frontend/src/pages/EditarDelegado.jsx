import React, { useState } from 'react';
import { Form, Select, Card, Button, Input, ConfigProvider } from 'antd';
import { useNavigate } from "react-router-dom";

import themeConfig from '../styles/themeConfigForm';

const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };

const options = [
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

const onFinish = (values) => {
  console.log('Received values of form: ', values);
};

export default function EditarDelegado() {
  const currentDate = new Date();
  const date_options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const date = currentDate.toLocaleDateString('pt-BR', date_options);

  let navigate = useNavigate();
  
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
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <div id="contact" style={{ height: '100%' }}>
        <div>
          <div id="title-edit">
            <h1>Editar Delegado</h1>
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
          <div style={{marginBottom:"1rem"}}>{date}</div>
        </div>

        <div style={{ width: '100%', height: '80%', justifySelf: 'center', alignContent: 'center' }}>
          <Card>
            <Form
              name="validate_other"
              {...formItemLayout}
              onFinish={onFinish}
              layout="vertical"
              initialValues={predefinedValues}
            >
              <Form.Item label="Nome" style={{ marginBottom: 0 }}>
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
                  <Input allowClear placeholder="Último" disabled={!isEditing}/>
                </Form.Item>
              </Form.Item>

              <Form.Item
                label="Distrito"
                name="Distrito"
                hasFeedback
                rules={[{ required: true, message: 'Por favor insira um distrito' }]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder="Insira um distrito"
                  options={options}
                  disabled={!isEditing}
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>

              <Form.Item
                label="Região HMR"
                name="Regiao"
                hasFeedback
                rules={[{ required: true, message: 'Por favor insira, pelo menos, uma região' }]}
              >
              <Select
                  allowClear
                  mode="multiple"
                  placeholder="Insira uma região"
                  options={options}
                  disabled={!isEditing}
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>

              <Form.Item label="Freguesia" name="Freguesia" hasFeedback>
                <Select
                  allowClear
                  mode="multiple"
                  placeholder="Insira uma freguesia"
                  options={options}
                  disabled={!isEditing}
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
}
