import React, { useState } from 'react';
import { IoAddCircleOutline } from "react-icons/io5";
import { Modal, Form, DatePicker, Select, Button, Table, ConfigProvider, Flex } from 'antd';

import themeConfig from '../styles/themeConfig';
import { getFormattedDate } from '../components/utils';

// For the table
const columns = [
  {
    key: 'data',
    title: 'Data',
    dataIndex: 'data',
    width: '15%',
    fixed: 'left',
    filters: [
      {
        text: 'Edward King 1',
        value: 'Edward King 1',
      },
      {
        text: 'Edward King 31',
        value: 'Edward King 31',
      },
      {
        text: 'Edward King 2',
        value: 'Edward King 2',
      },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.data.startsWith(value),
    sorter: (a, b) => a.data.localeCompare(b.data)          
  },
  {
    key: 'comprador',
    title: 'Comprador',
    dataIndex: 'comprador',
    width: '15%',
    filters: [
        {
          text: 'Médico 1',
          value: 'Médico 1',
        },
        {
          text: 'Médico 31',
          value: 'Médico 31',
        },
        {
          text: 'Farmácia 2',
          value: 'Farmácia 2',
        },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.comprador.startsWith(value),
    sorter: (a, b) => a.comprador.localeCompare(b.comprador)          
  },
  {
    key: 'distrito',
    title: 'Distrito',
    dataIndex: 'distrito',
    width: '15%',
    sorter: (a, b) => a.distrito.localeCompare(b.distrito)          
  },
  {
    key: 'regiao',
    title: 'Região',
    dataIndex: 'regiao',
    width: '15%',
    sorter: (a, b) => a.regiao.localeCompare(b.regiao)
  },
  {
    key: 'freguesia',
    title: 'Freguesia',
    dataIndex: 'freguesia',
    width: '15%',
    sorter: (a, b) => a.freguesia.localeCompare(b.freguesia)
  },
  {
    key: 'morada',
    title: 'Morada',
    dataIndex: 'morada',
    width: '15%',
  },
];

const dataSource = Array.from({
  length: 100,
}).map((_, i) => ({
  key: i,
  data: `12/01/2025 ${i}`,
  comprador: `Médico ${i}`,
  distrito: `Distrito ${i}`,
  regiao: `Região ${i}`,      
  freguesia: `Freguesia ${i}`,
  morada: `Rua ${i}`,
}));

const compradores = [
    {
        label: 'Médico',
        value: 'Médico',
    },
    {
        label: 'Farmácia',
        value: 'Farmácia',
    }
]

const medicos = [
    {
        label: 'Médico 1',
        value: 'médico_1',
    },
    {
        label: 'Médico 2',
        value: 'médico_2',
    }
]

const farmacias = [
    {
        label: 'Farmácia 1',
        value: 'farmácia_1',
    },
    {
        label: 'Farmácia 2',
        value: 'farmácia_2',
    }
]

export default function Visitas() {  
    const date = getFormattedDate();

    const [modalOpen, setModalState] = useState(false)

    const [showComprador, setComprador] = useState(false)
    const [tipoComprador, setTipoComprador] = useState()
    const [options, setOptions] = useState([])
    const [placeholder, setPlaceholder] = useState()

    const [form] = Form.useForm();
    
    const openModal = () => {
        setModalState(true)
    }

    const handleModalConfirm = (values) => {
        console.log('Received values of form: ', values)
        setModalState(false)
        setComprador(false)
        form.resetFields()
    }

    const handleModalCancel = () => {
        setModalState(false)
        setComprador(false)
        form.resetFields()
    }

    const handleComprador = (value, option) => {
        // Clear the Comprador field when Tipo_comprador changes or is cleared
        form.setFieldsValue({ Comprador: undefined });

        setComprador(value)
        if (value) {    
            setTipoComprador(option.label)
            setPlaceholder(`Selecione um ${option.label}`)
            setOptions(value === 'Médico' ? medicos : farmacias);
        }
    }

    return (
        <div id="contact">
            <div>
                <h1>Visitas Agendadas</h1>

                <div id="data-import">
                    {date}
                
                    <Button icon={<IoAddCircleOutline />} onClick={openModal} style={{padding: 0, margin: 0, background: 'none', border: 'none', boxShadow: 'none'}}/>
                    
                    <Modal title="Agende a sua visita" open={modalOpen} footer={null} closeIcon={null}>
                        <Form 
                            form={form}
                            layout='vertical'
                            onFinish={handleModalConfirm}
                        >
                            <Form.Item
                                label="Data"
                                name="Data"
                                rules={[{ required: true, message: 'Por favor selecione uma data' }]}
                            >

                                <DatePicker placeholder='Insira uma data' style={{width: '100%'}} />
                            </Form.Item>

                            <Form.Item
                                label="Tipo de Comprador"
                                name="Tipo_comprador"
                                hasFeedback
                                rules={[{ required: true, message: 'Por favor selecione um tipo de comprador' }]}
                            >
                                <Select 
                                    allowClear
                                    options={compradores}
                                    placeholder="Selecione um tipo de comprador"
                                    onChange={handleComprador}/>
                            </Form.Item>

                            {showComprador && (
                                <Form.Item
                                    label={tipoComprador}
                                    name="Comprador"
                                    hasFeedback
                                    rules={[{ required: true, message: `Por favor selecione um comprador` }]}
                                >
                                    <Select 
                                        allowClear
                                        options={options}
                                        placeholder={placeholder}/>
                                </Form.Item>
                            )}

                            <Form.Item>
                                <Flex gap="large">
                                    <Button type="primary" htmlType="submit">
                                        Confirmar
                                    </Button>
                                    <Button danger onClick={handleModalCancel}>
                                        Cancelar
                                    </Button>   
                                </Flex>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
            
            <ConfigProvider theme={themeConfig}>
                <Table 
                    columns={columns}
                    dataSource={dataSource}
                    scroll={{x: 'max-content'}}
                    pagination={{ pageSize: 7, showSizeChanger: false }}
                    showSorterTooltip={false}                             
                />
            </ConfigProvider>        
        </div>
    );
}
