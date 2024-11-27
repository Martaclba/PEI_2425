import React from 'react';
import { IconContext } from "react-icons";
import { HiOutlineUpload } from "react-icons/hi";
import { LuStethoscope } from "react-icons/lu";
import { IoAddCircleOutline } from "react-icons/io5";
import { Dropdown, Space, Upload, Button, Table,Tag,  ConfigProvider, Form, Select, Spin} from 'antd';
import { useNavigate, useLocation } from "react-router-dom"

import {useAuth} from '../context/Auth';
import { getFormattedDate } from '../components/utils';
import themeConfig from '../styles/themeConfigTable';
import UploadFileProps from '../components/UploadFile';
import { useFetchData } from '../components/useFetchData';
import useMedicosDataStore from '../context/MedicosData';

const columns = (navigate) => [
  {
    key: 'doctor_name',
    title: 'Médico',
    width: '16%',
    dataIndex: 'doctor_name',
    fixed: 'left',
    className: 'fixed-column', 
    sorter: (a, b) => a.doctor_name.localeCompare(b.doctor_name)
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
    width: '16%',
    sorter: (a, b) => a.district.localeCompare(b.district)
  },
  {
    key: 'institution',
    title: 'Instituição',
    width: '16%',
    dataIndex: 'institution',
    sorter: (a, b) => a.institution.localeCompare(b.institution)
  },
  {
    key: 'specialty',
    title: 'Especialidade',
    dataIndex: 'specialty',
    width: '16%',
    sorter: (a, b) => a.specialty.localeCompare(b.specialty)
  },
  // {
  //   key: 'state',
  //   title: 'Estado',
  //   dataIndex: 'state',
  //   width: '16%',
  //   render: (tag) => {
  //     let color = tag === 'Ativo' ? 'green' : 'blue';
  //     if (tag === 'Inativo') {
  //       color = 'volcano';
  //     }
  //     return (
  //       <Tag color={color} key={tag}>
  //         {tag.toUpperCase()}
  //       </Tag>
  //     );
  //   },
  // },
  {
    title: '',
    dataIndex: 'address',
    key: '4',
    width: '16%',
    render: (title, entry) => (
      <Space style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', height: '100%'}}>
              <ConfigProvider theme={themeConfig}>
                <Button onClick={() => navigate(`/medicos/detalhes/${entry.id_doctor}`)}>Detalhes</Button>  
              </ConfigProvider>
      </Space>
    ),
  },
];



export default function Medicos() {  
  const date = getFormattedDate();
  const {state} = useAuth();
  const navigate = useNavigate()
  const location = useLocation()
  
  const { trigger, data, filters, selectedOption } = useMedicosDataStore(state => state);
  const { updateMedicosFetchTrigger, updateSelectedOption } = useMedicosDataStore();


  const items = [
    {
      key: '1',
      label:  
        <Button icon={<LuStethoscope />} style={{padding: 0, margin: 0, background: 'none', border: 'none', boxShadow: 'none'}} 
          onClick={() => navigate("/medicos/registar/")}
        >
          Registo Individual
        </Button>
    },
    {
      key: '2',
      label: 
      (state.isAdmin ? <Upload {...UploadFileProps(location.pathname, updateMedicosFetchTrigger)} maxCount={1}>
        <Button icon={<HiOutlineUpload />} style={{padding: 0, margin: 0, background: 'none', border: 'none', boxShadow: 'none'}}>
          Registo por Ficheiro
        </Button>
      </Upload>:<div></div>)
    },
  ];

  const [form] = Form.useForm();

  const onFinish = (values) => {
    // Update selected option with the latest form input
    updateSelectedOption(values)
    // Set a trigger to fetch data
    updateMedicosFetchTrigger();
  };

  // Set a trigger if:
    // the user is returning from a sucefull registry page 
    // if there's an import
    // new filter select 
    // first time reloading
  const { loading } = useFetchData('/medicos', location.state?.shouldFetchData || !trigger, selectedOption)
    
  // if (loading) {
  //   return <Spin fullscreen tip="Carregando dados..." />;
  // }
  
  return (
    <div id="contact">
      <div>
        <h1>Médicos</h1>

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
          
                  <Form.Item className="large-select" label='Médico' name='medico'>
                    <Select                       
                      placeholder="Médico"
                      options={filters.doctors} 
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

                  <Form.Item className="large-select" label='Instituição' name='instituicao'>
                    <Select                     
                      placeholder="Instituição"
                      options={filters.institutions} 
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
