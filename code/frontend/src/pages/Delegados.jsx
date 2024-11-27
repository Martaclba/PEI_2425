import React from 'react';
import { IconContext } from "react-icons";
import { HiOutlineUpload } from "react-icons/hi";
import { IoAddCircleOutline, IoPersonOutline } from "react-icons/io5";
import { Dropdown, Space, Upload, Button, Table, ConfigProvider, Select, Form, Spin, Tag } from 'antd';
import { useNavigate, useLocation } from "react-router-dom"

import themeConfig from '../styles/themeConfigTable';
import UploadFileProps from '../components/UploadFile';
import { getFormattedDate } from '../components/utils';
import { useFetchData } from '../components/useFetchData';
import useDelegatesDataStore from '../context/DelegadosData';


// For the table
const columns = (navigate) => [
  {
    key: 'delegate_name',
    title: 'Delegado',
    dataIndex: 'delegate_name',
    width: '15%',
    fixed: 'left',
    className: 'fixed-column', 
    sorter: (a, b) => a.delegate_name.localeCompare(b.delegate_name)          
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
  // {
  //   key: 'state',
  //   title: 'Estado',
  //   dataIndex: 'state',
  //   width: '16%',
  //   render: (tags) => (
  //     <>
  //       {tags.map((tag) => {
  //         let color = tag === 'Ativo' ? 'green' : 'geekblue';
  //         if (tag === 'Inativo') {
  //           color = 'volcano';
  //         }
  //         return (
  //           <Tag color={color} key={tag}>
  //             {tag.toUpperCase()}
  //           </Tag>
  //         );
  //       })}
  //     </>
  //   ),
  // },
  {
    key: 'action',
    title: '',
    width: '15%',
    render: (title, entry) => (
      <Space style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', height: '100%'}}>
        <ConfigProvider theme={themeConfig}>
          <Button onClick={() => navigate(`/delegados/detalhes/${entry.id_delegate}`)}>Detalhes</Button>  
        </ConfigProvider>
      </Space>
    ),
  },
];

export default function Delegados() {  
  const date = getFormattedDate();

  const navigate = useNavigate()
  const location = useLocation();
  
  const { trigger, data, filters, selectedOption } = useDelegatesDataStore(state => state);
  const { updateDelegatesFetchTrigger, updateSelectedOption } = useDelegatesDataStore();

  const items = [
    {
      key: '1',
      label:  
        <Button icon={<IoPersonOutline />} style={{padding: 0, margin: 0, background: 'none', border: 'none', boxShadow: 'none'}} 
          onClick={() => navigate("/delegados/registar/")}
        >
          Registo Individual
        </Button>
    },
    {
      key: '2',
      label: 
      <Upload {...UploadFileProps(location.pathname, updateDelegatesFetchTrigger)} maxCount={1}>
        <Button icon={<HiOutlineUpload />} style={{padding: 0, margin: 0, background: 'none', border: 'none', boxShadow: 'none'}}>
          Registo por Ficheiro
        </Button>
      </Upload>
    },
  ];

  const [form] = Form.useForm();

  const onFinish = (values) => {
    // Update selected option with the latest form input
    updateSelectedOption(values)
    // Set a trigger to fetch data
    updateDelegatesFetchTrigger();
  };

  // Set a trigger if:
    // the user is returning from a sucefull registry page 
    // if there's an import
    // new filter select 
    // first time reloading
  const { loading } = useFetchData('/delegados', location.state?.shouldFetchData || !trigger, selectedOption)
    
  // if (loading) {
  //   return <Spin fullscreen tip="Carregando dados..." />;
  // }

  return (
      <div id="contact">
        <div>
          <h1>Delegados</h1>

          <div id="data-import">
            {date}

            <Dropdown menu={{items}}>
                <Space>
                  <IconContext.Provider value={{ size: '1.5rem' }}>  
                    <IoAddCircleOutline onClick={(e) => e.preventDefault()}/>
                  </IconContext.Provider>
                </Space>
            </Dropdown>
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
            
                    <Form.Item className="large-select" label='Delegado' name='delegado'>
                      <Select                       
                        placeholder="Delegado"
                        options={filters.delegates} 
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
