import React, { useState } from 'react';
import { IconContext } from "react-icons";
import { IoAddCircleOutline } from "react-icons/io5";
import { Modal, Form, DatePicker, Select, Button, Table, ConfigProvider, Flex, message, Spin } from 'antd';
import dayjs from 'dayjs';

import axios from 'axios'

import themeConfig from '../styles/themeConfigTable';
import { getFormattedDate } from '../components/utils';
import { useFetchData } from '../components/useFetchData';
import { useFetchFormData } from '../components/useFetchFormData';
import useVisitasDataStore from '../context/VisitasData';
import useFormDataStore from '../context/FormData';

// For the table
const columns = [
  {
    key: 'data',
    title: 'Data',
    dataIndex: 'data',
    width: '15%',
    fixed: 'left',
    className: 'fixed-column', 
    sorter: (a, b) => a.data.localeCompare(b.data)          
  },
  {
    key: 'comprador',
    title: 'Comprador',
    dataIndex: 'comprador',
    width: '15%',
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

export default function Visitas() {  
    const date = getFormattedDate();
    const [form] = Form.useForm();

    const [modalOpen, setModalState] = useState(false)
    const [modalTrigger, setModalTrigger] = useState(false)

    const [showComprador, setShowComprador] = useState(false)
    const [tipoComprador, setTipoComprador] = useState()
    const [options, setOptions] = useState([])
    const [placeholder, setPlaceholder] = useState()

    const { trigger, data, filters, selectedOption } = useVisitasDataStore(state => state);
    const { updateVisitasFetchTrigger, updateSelectedOption } = useVisitasDataStore();
    const { hasFetched, doctors, pharmacies } = useFormDataStore((state) => state) 
    
    // If the form data fetch didnt happen, then fetch the data, 
    // update the store and set the form's selects
    useFetchFormData(!hasFetched)

    const openModal = () => {
        setModalState(true)
    }

    const handleModalConfirm = async (values) => {
        const values_formatted = {
            ...values,
            date: values.date.format('DD-MM-YYYY')
        }

        console.log('Received values of form: ', values_formatted)
        setModalState(false)
        setShowComprador(false)
        form.resetFields()

        try {
            const response = await axios.post(process.env.REACT_APP_API_PATH + "/visitas/registar", values_formatted, { headers: { 'Content-Type': 'application/json' } })

            if(response.status === 200) {
                message.success("Registado com sucesso")
                console.log('Form submitted successfully:', response.data);
                setModalTrigger(true);
            } else {
                message.error("Oops! Ocorreu algum erro...")
                console.error('Form submission failed:', response.status);
            }

        } catch (error) {
            message.error("Oops! Ocorreu algum erro...")
            console.error('Error submitting form:', error);
        }
    }

    const handleModalCancel = () => {
        setModalState(false)
        setShowComprador(false)
        form.resetFields()
    }

    const handleComprador = (value, option) => {
        // Clear the Comprador field when Tipo_comprador changes or is cleared
        // Reset Comprador state and field
        form.setFieldsValue({ Comprador: undefined });

        setShowComprador(false); // Hide by default
        
        if (value) {    
            setShowComprador(true); 
            setTipoComprador(option.label)
            setPlaceholder(`Selecione um ${option.label}`)
            setOptions(value === 'Médico' ? doctors : pharmacies);
        }
    }


    const [form_filtros] = Form.useForm();
    const onFinish = (values) => {
        const values_formatted = {
            ...values,
            date: values.date.format('DD-MM-YYYY')
        }
        
        // Update selected option with the latest form input
        updateSelectedOption(values_formatted)
        // Set a trigger to fetch data
        updateVisitasFetchTrigger();
    };
  
    const { loading } = useFetchData('/visitas', modalTrigger || !trigger, selectedOption)

    if (loading) {
        return <Spin fullscreen tip="Carregando dados..." />;
    }

    return (
        <div id="contact">
            <div>
                <h1>Visitas Agendadas</h1>

                <div id="data-import">
                    {date}

                    <IconContext.Provider value={{ size: '1.5rem' }}>  
                        <Button icon={<IoAddCircleOutline />} onClick={openModal} style={{padding: 0, margin: 0, background: 'none', border: 'none', boxShadow: 'none'}}/>
                    </IconContext.Provider>

                    <Modal title="Agende a sua visita" open={modalOpen} footer={null} closeIcon={null}>
                        <Form 
                            form={form}
                            layout='vertical'
                            onFinish={handleModalConfirm}
                            initialValues={{date: dayjs(),}}
                        >
                            <Form.Item
                                label="Date"
                                name="date"
                                rules={[{ required: true, message: 'Por favor selecione uma data' }]}
                            >
                                    <DatePicker placeholder='Insira uma data' style={{width: '100%'}} format="DD-MM-YYYY"/>
                            </Form.Item>

                            <Form.Item
                                label="Entidade de Saúde"
                                name="Entidade"
                                hasFeedback
                                rules={[{ required: true, message: 'Por favor selecione uma entidade' }]}
                            >
                                <Select 
                                    allowClear
                                    options={compradores}
                                    placeholder="Selecione uma entidade de saúde"
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
                                        optionLabelProp='label'
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
            
            <div style={{padding: '1rem'}}>
                <ConfigProvider theme={themeConfig}>
                <div className='dashboard-card'>

                    <div style={{ marginBottom: '1rem' }}>
                        <Form
                            name="table_delegados"
                            onFinish={onFinish}
                            layout="vertical"
                            initialValues={{
                                ...selectedOption,
                                date: dayjs(selectedOption.date, 'DD-MM-YYYY')  // Convert string to dayjs object
                            }}
                            form={form_filtros}
                        >
                            <div className="costum-form" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                <Form.Item className='large-select' label="Data" name="date">
                                        <DatePicker 
                                            placeholder='Insira uma data'
                                            style={{width: '100%'}}
                                            onChange={() => form_filtros.submit()}
                                            format="DD-MM-YYYY"
                                        />
                                </Form.Item>
                        
                                <Form.Item className="large-select" label='Comprador' name='comprador'>
                                    <Select                       
                                        placeholder="Comprador"
                                        options={filters.compradores} 
                                        onChange={() => form_filtros.submit()}
                                        showSearch
                                        filterOption={(input, option) => 
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                                </Form.Item>
                                
                                
                                <Form.Item className="large-select" label='Distrito' name='distrito'>
                                    <Select                     
                                        placeholder="Distrito"
                                        options={filters.distritos} 
                                        onChange={() => form_filtros.submit()}
                                        showSearch
                                        filterOption={(input, option) => 
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                                </Form.Item>

                                <Form.Item className="large-select" label='Região' name='regiao'>
                                    <Select                     
                                        placeholder="Região"
                                        options={filters.regioes} 
                                        onChange={() => form_filtros.submit()}
                                        showSearch
                                        filterOption={(input, option) => 
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                                </Form.Item>
                            </div>
                        </Form>
                    </div>
                    <Table 
                        columns={columns}
                        dataSource={data}
                        scroll={{x: 'max-content'}}
                        pagination={{ pageSize: 7, showSizeChanger: false }}
                        showSorterTooltip={false}                             
                    />
                    </div>
                </ConfigProvider>        
            </div>
        </div>
    );
}
