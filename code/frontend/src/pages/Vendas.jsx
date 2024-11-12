import React, { useEffect, useState } from 'react';
import { IconContext } from "react-icons";
import { HiOutlineUpload } from "react-icons/hi";
import { IoAddCircleOutline } from "react-icons/io5";
import { Dropdown, Space, Upload, Button, Table, ConfigProvider, Select, Form } from 'antd';
import { useLocation } from "react-router-dom"
import { Column } from '@ant-design/plots';

import themeConfig from '../styles/themeConfigTable';
import UploadFileProps from '../components/UploadFile';
import { getFormattedDate } from '../components/utils';
import axios from 'axios'; 
import {useAuth} from '../context/Auth';



//Para os histogramas
const data = [
  { type: 'Jan', value: 0.16 },
  { type: 'Fev', value: 0.125 },
  { type: 'Mar', value: 0.24 },
  { type: 'Apr', value: 0.19 },
  { type: 'May', value: 0.22 },
  { type: 'Jun', value: 0.05 },
  { type: 'Jul', value: 0.01 },
  { type: 'Aug', value: 0.015 },
  { type: 'Sep', value: 0.05 },
  { type: 'Nov', value: 0.01 },
  { type: 'Dec', value: 0.015 },
];

const DemoColumn = () => {
  const config = {
    data,
    xField: 'type',
    yField: 'value',
    style: {
      fill: ({ type }) => {
        if (type === 'Jul' || type === 'Aug') {
          return '#22CBCC';
        }
        return '#2989FF';
      },
    },
    label: {
      text: (originData) => {
        const val = parseFloat(originData.value);
        if (val < 0.0) {
          return (val * 100).toFixed(1) + '%';
        }
        return '';
      },
      offset: 10,
    },
    legend: false,
  };
  return <Column {...config} />;
};

const options= [
  {
  value: '1',
  label: '2018',
  },
  {
  value: '2',
  label: '2019',
  },
  {
  value: '3',
  label: '2020',
  },
];


// For the tables
const columns_produto = [
  {
    key: 'produto',
    title: 'Produto',
    dataIndex: 'produto',
    fixed: 'left',
    className: 'fixed-column', 
    filters: [
      {
        text: 'Produto 1',
        value: 'Produto 1',
      },
      {
        text: 'Produto 31',
        value: 'Produto 31',
      },
      {
        text: 'Produto 2',
        value: 'Produto 2',
      },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.produto.startsWith(value),
    sorter: (a, b) => a.produto.localeCompare(b.produto)          
  },
  {
    key: 'janeiro',
    title: 'Jan',
    dataIndex: 'janeiro',
    sorter: (a, b) => a.janeiro - b.janeiro          
  },
  {
    key: 'fevereiro',
    title: 'Fev',
    dataIndex: 'fevereiro',
    sorter: (a, b) => a.fevereiro - b.fevereiro
  },
  {
    key: 'marco',
    title: 'Mar',
    dataIndex: 'marco',
    sorter: (a, b) => a.marco - b.marco
  },
  {
    key: 'abril',
    title: 'Abr',
    dataIndex: 'abril',
    sorter: (a, b) => a.abril - b.abril
  },
  {
    key: 'maio',
    title: 'Mai',
    dataIndex: 'maio',
    sorter: (a, b) => a.maio - b.maio
  },
  {
    key: 'junho',
    title: 'Jun',
    dataIndex: 'junho',
    sorter: (a, b) => a.junho - b.junho
  },
  {
    key: 'julho',
    title: 'Jul',
    dataIndex: 'junho',
    sorter: (a, b) => a.junho - b.junho
  },
  {
    key: 'agosto',
    title: 'Ago',
    dataIndex: 'agosto',
    sorter: (a, b) => a.agosto - b.agosto
  },
  {
    key: 'setembro',
    title: 'Set',
    dataIndex: 'setembro',
    sorter: (a, b) => a.setembro - b.setembro
  },
  {
    key: 'outubro',
    title: 'Out',
    dataIndex: 'outubro',
    sorter: (a, b) => a.outubro - b.outubro
  },
  {
    key: 'novembro',
    title: 'Nov',
    dataIndex: 'novembro',
    sorter: (a, b) => a.novembro - b.novembro
  },
  {
    key: 'dezembro',
    title: 'Dez',
    dataIndex: 'dezembro',
    sorter: (a, b) => a.dezembro - b.dezembro
  },
];

const dados_produto = Array.from({
  length: 100,
}).map((_, i) => ({
  key: i,
  produto: `Produto ${i}`,
  janeiro: i,
  fevereiro: i,
  marco: i,
  abril: i,
  maio: i,
  junho: i,
  julho: i,
  agosto: i,
  setembro: i,
  outubro: i,
  novembro: i,
  dezembro: i,
}));

const columns_brick = [
  {
    key: 'brick',
    title: 'Brick',
    dataIndex: 'brick',
    fixed: 'left',
    className: 'fixed-column', 
    filters: [
      {
        text: 'Produto 1',
        value: 'Produto 1',
      },
      {
        text: 'Produto 31',
        value: 'Produto 31',
      },
      {
        text: 'Produto 2',
        value: 'Produto 2',
      },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.brick.startsWith(value),
    sorter: (a, b) => a.brick.localeCompare(b.brick)          
  },
  {
    key: 'janeiro',
    title: 'Jan',
    dataIndex: 'janeiro',
    sorter: (a, b) => a.janeiro - b.janeiro          
  },
  {
    key: 'fevereiro',
    title: 'Fev',
    dataIndex: 'fevereiro',
    sorter: (a, b) => a.fevereiro - b.fevereiro
  },
  {
    key: 'marco',
    title: 'Mar',
    dataIndex: 'marco',
    sorter: (a, b) => a.marco - b.marco
  },
  {
    key: 'abril',
    title: 'Abr',
    dataIndex: 'abril',
    sorter: (a, b) => a.abril - b.abril
  },
  {
    key: 'maio',
    title: 'Mai',
    dataIndex: 'maio',
    sorter: (a, b) => a.maio - b.maio
  },
  {
    key: 'junho',
    title: 'Jun',
    dataIndex: 'junho',
    sorter: (a, b) => a.junho - b.junho
  },
  {
    key: 'julho',
    title: 'Jul',
    dataIndex: 'junho',
    sorter: (a, b) => a.junho - b.junho
  },
  {
    key: 'agosto',
    title: 'Ago',
    dataIndex: 'agosto',
    sorter: (a, b) => a.agosto - b.agosto
  },
  {
    key: 'setembro',
    title: 'Set',
    dataIndex: 'setembro',
    sorter: (a, b) => a.setembro - b.setembro
  },
  {
    key: 'outubro',
    title: 'Out',
    dataIndex: 'outubro',
    sorter: (a, b) => a.outubro - b.outubro
  },
  {
    key: 'novembro',
    title: 'Nov',
    dataIndex: 'novembro',
    sorter: (a, b) => a.novembro - b.novembro
  },
  {
    key: 'dezembro',
    title: 'Dez',
    dataIndex: 'dezembro',
    sorter: (a, b) => a.dezembro - b.dezembro
  },
];

const dados_brick = Array.from({
  length: 100,
}).map((_, i) => ({
  key: i,
  brick: `Brick ${i}`,
  janeiro: i,
  fevereiro: i,
  marco: i,
  abril: i,
  maio: i,
  junho: i,
  julho: i,
  agosto: i,
  setembro: i,
  outubro: i,
  novembro: i,
  dezembro: i,
}));

export default function Vendas() {  
  const date = getFormattedDate();
  const location = useLocation();
  const {state} = useAuth();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [fetchTrigger, setFetchTrigger] = useState(false)

  const predefinedValues = {
    Delegado: 'Todos',
    Ano: '2024',
  };

  const predefinedValues1 = {
    Delegado: 'Todos',
    Ano: '2024',
    Empresa: 'Todas',
    Brick: 'Todos',
  };

  const predefinedValues2 = {
    Ano: '2024',
    Delegado: 'Todos',
    Empresa: 'Todas',
  };

  const predefinedValues3 = {
    Delegado: 'Todos',
    Empresa: 'Todas',
    Brick: 'Todos',
  };

  const onFinish = (type) => async (values) => {
    console.log('Received values of form: ', values)
    console.log('TYPE: ', type)
  
    try {
      const response = await axios.get(process.env.REACT_APP_API_PATH  + "/", { params: values })
    
      if(response.status === 200){
        console.log('Form submitted successfully:', response.data);      
      } else {
        console.error('Form submission failed:', response.status);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const items = [
    {
      key: '1',
      label:  
        <Upload {...UploadFileProps(location.pathname)} maxCount={1}>
          <Button icon={<HiOutlineUpload />} style={{padding: 0, margin: 0, background: 'none', border: 'none', boxShadow: 'none'}}>
            Importar Ficheiro
          </Button>
        </Upload>
    },
  ];

  //const {data} = useFetchData('/vendas', location.state?.shouldFetchData || fetchTrigger)

  return (
      <div id="contact">
        <div>
          <h1>Vendas</h1>

          <div id="data-import">
            {date}

            {state.isAdmin && <Dropdown menu={{items}}>
              <Space>
                <IconContext.Provider value={{ size: '1.5rem' }}>  
                  <IoAddCircleOutline onClick={(e) => e.preventDefault()}/>
                </IconContext.Provider>
              </Space>
            </Dropdown>}
          </div>
        </div>
        
        <div style={{padding: '1rem'}}>
          <div className='dashboard-card'>
            <div id='data-import'>
              <p className="table-title">Histórico De Vendas</p>

              {state.isAdmin && 
                <div style={{display:'flex', gap:'1rem', marginBottom: '1rem'}}>
                  <Form
                    name="histogram"
                    onFinish={onFinish("HISTOGRAM")}
                    layout="inline"
                    initialValues={predefinedValues}
                    form={form}
                  >
                    <Form.Item className="large-select">
                      <Select 
                        allowClear
                        placeholder="Delegado"
                        options={options}
                        onChange={() => form.submit()} 
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>

                    <Form.Item className="large-select">
                      <Select 
                        allowClear
                        placeholder="Ano"
                        options={options}
                        onChange={() => form.submit()}
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  </Form>
                </div>
              }
            </div>
            <DemoColumn/>
          </div>

          <ConfigProvider theme={themeConfig}>  
            <div className='dashboard-card'>
              <p className="table-title">Consulta por Produto</p>

              <div style={{display:'flex', gap:'1rem', marginBottom: '1rem'}}>
                <Form
                  name="table_product"
                  onFinish={onFinish("TABLE_1")}
                  layout="inline"
                  initialValues={predefinedValues1}
                  form={form1}
                >
                  {state.isAdmin && 
                    <Form.Item className="large-select">
                      <Select 
                        allowClear
                        placeholder="Ano"
                        options={options} 
                        onChange={() => form1.submit()}
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  }

                  {state.isAdmin && 
                    <Form.Item className="large-select">
                      <Select 
                        allowClear
                        placeholder="Delegado"
                        options={options} 
                        onChange={() => form1.submit()}
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  }
                  
                  <Form.Item className="large-select">
                    <Select 
                      allowClear
                      placeholder="Empresa"
                      options={options} 
                      onChange={() => form1.submit()}
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>

                  <Form.Item className="large-select">
                    <Select 
                      allowClear
                      placeholder="Brick"
                      options={options} 
                      onChange={() => form1.submit()}
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>
                </Form>
              </div>

              <Table 
                columns={columns_produto}
                dataSource={dados_produto}
                scroll={{x: 'max-content'}}
                pagination={{ pageSize: 7, showSizeChanger: false }}
                showSorterTooltip={false}                             
              />
            </div>

            <div className='dashboard-card'>
              <p className="table-title">Consulta por Brick</p>
              <div style={{display:'flex', gap:'1rem', marginBottom:'1rem'}}>
                <Form
                  name="table_brick"
                  onFinish={onFinish("TABLE_2")}
                  layout="inline"
                  initialValues={predefinedValues2}
                  form={form2}
                >
                  {state.isAdmin && 
                    <Form.Item className="large-select">
                      <Select 
                        allowClear
                        placeholder="Ano"
                        options={options}
                        onChange={() => form2.submit()}
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  }

                  {state.isAdmin &&
                    <Form.Item className="large-select"> 
                      <Select 
                        allowClear
                        placeholder="Delegado"
                        options={options} 
                        onChange={() => form2.submit()}
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  }

                  <Form.Item className="large-select"> 
                    <Select 
                      allowClear
                      placeholder="Empresa"
                      options={options} 
                      onChange={() => form2.submit()}
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>
                </Form>
              </div>

              <Table
                columns={columns_brick}
                dataSource={dados_brick}
                scroll={{x: 'max-content'}}
                pagination={{ pageSize: 7, showSizeChanger: false }}
                showSorterTooltip={false}                             
              />
            </div>

            <div className='dashboard-card'>
              <p className="table-title">Consulta por Brick</p>
              <div style={{display:'flex', gap:'1rem', marginBottom:'1rem'}}>
                <Form
                  name="table_brick"
                  onFinish={onFinish("TABLE_3")}
                  layout="inline"
                  initialValues={predefinedValues3}
                  form={form3}
                >
                  {state.isAdmin && 
                    <Form.Item className="large-select">
                      <Select 
                        allowClear
                        placeholder="Delegado"
                        options={options}
                        onChange={() => form3.submit()}
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  }

                  {state.isAdmin &&
                    <Form.Item className="large-select"> 
                      <Select 
                        allowClear
                        placeholder="Empresa"
                        options={options} 
                        onChange={() => form3.submit()}
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  }

                  <Form.Item className="large-select"> 
                    <Select 
                      allowClear
                      placeholder="Brick"
                      options={options} 
                      onChange={() => form3.submit()}
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>
                </Form>
              </div>

              <Table
                columns={columns_brick}
                dataSource={dados_brick}
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
