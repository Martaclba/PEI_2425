import React from 'react';
import { IconContext } from "react-icons";
import { LuCross } from "react-icons/lu";
import { IoAddCircleOutline} from "react-icons/io5";
import { Dropdown, Space, Button, Table, ConfigProvider, Form, Select} from 'antd';
import { useNavigate, useLocation } from "react-router-dom";

import {useAuth} from '../context/Auth';
import themeConfig from '../styles/themeConfigTable';
import { getFormattedDate } from '../components/utils';
import { useFetchData } from '../components/useFetchData';
import useFarmaciasDataStore from '../context/FarmaciasData';

const columns = (navigate) => [
  {
    key: 'farmacia',
    title: 'Farmácia',
    dataIndex: 'farmacia',
    width: '15%',
    fixed: 'left',
    className: 'fixed-column', 
    filters: [
      {
        text: 'Farmácia 1',
        value: 'Farmácia 1',
      },
      {
        text: 'Farmácia 31',
        value: 'Farmácia 31',
      },
      {
        text: 'Farmácia 2',
        value: 'Farmácia 2',
      },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.farmacia.startsWith(value),
    sorter: (a, b) => a.farmacia.localeCompare(b.farmacia)          
  },
  {
    key: 'brick',
    title: 'Brick',
    dataIndex: 'brick',
    width: '15%',
    sorter: (a, b) => a.brick.localeCompare(b.brick)
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
    width: '30%',
    sorter: (a, b) => a.morada.localeCompare(b.morada) 
  },
  {
    key: 'action',
    title: '',
    width: '15%',
    render: (title, entry) => (
      <Space style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', height: '100%'}}>
              <ConfigProvider theme={themeConfig}>
                <Button onClick={() => navigate(`/farmacias/${entry.key}`)}>Detalhes</Button>  
              </ConfigProvider>
      </Space>
    ),
  },
];

const dataSource = Array.from({
  length: 100,
}).map((_, i) => ({
  key: i,
  farmacia: `Farmácia ${i}`,
  brick:`Brick ${i}`,
  distrito: `Distrito ${i}`,
  regiao: `Região ${i}`,      
  freguesia: `Freguesia ${i}`,
  morada: `Morada ${i}`,    
  contacto: '252 543 667',    
}));
 

export default function Farmacias() {  
  const date = getFormattedDate();
  const {state} = useAuth();
  const navigate = useNavigate()
  const location = useLocation();

  const { trigger, data, filters, selectedOption } = useFarmaciasDataStore(state => state);
  const { updateFarmaciasFetchTrigger, updateSelectedOption } = useFarmaciasDataStore();

  const items = [
    {
      key: '1',
      label:  
        <Button icon={<LuCross />} style={{padding: 0, margin: 0, background: 'none', border: 'none', boxShadow: 'none'}} 
          onClick={() => navigate("/farmacias/registar/")}>
          Registo Individual
        </Button>
    },
  ];

  const [form] = Form.useForm();

  const onFinish = (values) => {
    // Update selected option with the latest form input
    updateSelectedOption(values)
    // Set a trigger to fetch data
    updateFarmaciasFetchTrigger();
  };

  const {loading} = useFetchData('/farmacias', !trigger, selectedOption)

   //const {data} = useFetchData('/delegados', location.state?.shouldFetchData || fetchTrigger)
  // if (loading) {
  //   return <Spin fullscreen tip="Carregando dados..." />;
  // }

  return (
    <div id="contact">
      <div>
        <h1>Farmácias</h1>

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
        <ConfigProvider theme={themeConfig}>
          <div className='dashboard-card'>
            
            <div style={{ marginBottom: '1rem' }}>
              <Form
                name="table_delegados"
                onFinish={onFinish}
                layout="vertical"
                initialValues={selectedOption}
                form={form}
              >
                <div className="costum-form" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          
                  <Form.Item className="large-select" label='Farmácia' name='farmacia'>
                    <Select                       
                      placeholder="Farmácia"
                      options={filters.farmacias} 
                      onChange={() => form.submit()}
                      showSearch
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>
                
                  
                  <Form.Item className="large-select" label='Distrito' name='distrito'>
                    <Select                     
                      placeholder="Distrito"
                      options={filters.distritos} 
                      onChange={() => form.submit()}
                      showSearch
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>

                  <Form.Item className="large-select" label='Região' name='regiao'>
                    <Select                     
                      placeholder="Região"
                      options={filters.regioes} 
                      onChange={() => form.submit()}
                      showSearch
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>
                </div>
              </Form>
            </div>
          <Table 
            columns={columns(navigate)}
            dataSource={dataSource}
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
