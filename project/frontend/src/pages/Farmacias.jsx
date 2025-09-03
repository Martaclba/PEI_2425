import React from 'react';
import { IconContext } from "react-icons";
import { LuCross } from "react-icons/lu";
import { IoAddCircleOutline} from "react-icons/io5";
import { Dropdown, Space, Button, Table, ConfigProvider, Form, Select, Spin} from 'antd';
import { useNavigate, useLocation } from "react-router-dom";

import {useAuth} from '../context/Auth';
import themeConfig from '../styles/themeConfigTable';
import { getFormattedDate } from '../components/utils';
import { useFetchData } from '../components/useFetchData';
import useFarmaciasDataStore from '../context/FarmaciasData';

const columns = (navigate) => [
  {
    key: 'pharmacy_name',
    title: 'Farmácia',
    dataIndex: 'pharmacy_name',
    width: '15%',
    fixed: 'left',
    className: 'fixed-column',
    sorter: (a, b) => a.pharmacy_name.localeCompare(b.pharmacy_name)          
  },
  {
    key: 'brick',
    title: 'Brick',
    dataIndex: 'brick',
    width: '15%',
    sorter: (a, b) => a.brick - b.brick
  },
  {
    key: 'district',
    title: 'Distrito',
    dataIndex: 'district',
    width: '15%',
    sorter: (a, b) => a.district.localeCompare(b.district) 
  },
  {
    key: 'region',
    title: 'Região',
    dataIndex: 'region',
    width: '15%',
    sorter: (a, b) => a.region.localeCompare(b.region) 
  },
  {
    key: 'town',
    title: 'Freguesia',
    dataIndex: 'town',
    width: '15%',
    sorter: (a, b) => a.town.localeCompare(b.town) 
  },
  {
    key: 'address',
    title: 'Morada',
    dataIndex: 'address',
    width: '30%',
    sorter: (a, b) => a.address.localeCompare(b.address) 
  },
  {
    key: 'action',
    title: '',
    width: '15%',
    render: (title, entry) => (
      <Space style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', height: '100%'}}>
              <ConfigProvider theme={themeConfig}>
                <Button onClick={() => navigate(`/farmacias/detalhes/${entry.id_pharmacy}`)}>Detalhes</Button>  
              </ConfigProvider>
      </Space>
    ),
  },
];
 

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

  const { loading } = useFetchData('/farmacias', location.state?.shouldFetchData || !trigger, selectedOption)

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
                      options={filters.pharmacies} 
                      onChange={() => form.submit()}
                      showSearch
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>
                
                  
                  <Form.Item className="large-select" label='Distrito' name='distrito'>
                    <Select                     
                      placeholder="Distrito"
                      options={filters.districts} 
                      onChange={() => form.submit()}
                      showSearch
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>

                  <Form.Item className="large-select" label='Região' name='regiao'>
                    <Select                     
                      placeholder="Região"
                      options={filters.regions} 
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
