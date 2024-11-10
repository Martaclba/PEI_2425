import React, { useState } from 'react';
import { Form, Card, Button, Input, ConfigProvider, message, AutoComplete } from 'antd';
import { useNavigate, useLocation } from "react-router-dom";

import axios from 'axios'

import themeConfig from '../styles/themeConfigForm';
import { getFormattedDate } from '../components/utils';
import useFormDataStore from '../context/FormData';
import { useFetchFormData } from '../components/useFetchFormData';


export default function EditarDelegado() {
  const [form] = Form.useForm();
  const date = getFormattedDate();

  const navigate = useNavigate();
  const location = useLocation();
  
  // Get state from Zustand store
  const { hasFetched, districts, hmr_regions, parishes } = useFormDataStore((state) => state) 

  // If the form data fetch didnt happen, then fetch the data, 
  // update the store and set the form's selects
  useFetchFormData(!hasFetched)

  // State to control edit mode
  const [isEditing, setIsEditing] = useState(false)
  const [fetchTrigger, setFetchTrigger] = useState(false)

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
    // Submit the form programmatically (execute onFinish)
    form.submit(); 
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <div id="contact" style={{ height: '100%' }}>
        <div>
          <div id="title-edit">
            <div>
              <h1>Delegado A</h1>
              <div style={{ marginBottom: "1rem" }}>{date}</div>
            </div>

            <Form.Item>
              <div className="edit-container">
                {isEditing ? (
                  <>
                    <Button type="primary" onClick={handleSubmitIsEdit}>
                      Guardar
                    </Button>
                    <Button danger onClick={() => navigate("/delegados/", { state: { shouldFetchData: fetchTrigger } })}>
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
        </div>

        <div style={{ width: '100%', height: '80%', justifySelf: 'center', alignContent: 'center' }}>
          <Card>
            <Form
              name="validate_other"
              onFinish={onFinish}
              layout="vertical"
              initialValues={predefinedValues}
              form={form}
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
                rules={[{ required: true, message: 'Por favor insira uma região' }]}
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
            </Form>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
}
