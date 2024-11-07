import React, { useEffect, useState } from 'react';
import { IconContext } from "react-icons";
import { HiOutlineUpload } from "react-icons/hi";
import { IoAddCircleOutline, IoPersonOutline } from "react-icons/io5";
import { Dropdown, Space, Upload, Button, Table, ConfigProvider } from 'antd';
import { useNavigate, useLocation } from "react-router-dom"

import axios from 'axios'

import themeConfig from '../styles/themeConfigTable';
import UploadFileProps from '../components/UploadFile';
import { getFormattedDate } from '../components/utils';

// For the table
const columns = (navigate) => [
  {
    key: 'delegado',
    title: 'Delegado',
    dataIndex: 'delegado',
    width: '15%',
    fixed: 'left',
    className: 'fixed-column', 
    filters: [
      {
        text: 'Delegado 1',
        value: 'Delegado 1',
      },
      {
        text: 'Delegado 31',
        value: 'Delegado 31',
      },
      {
        text: 'Delegado 2',
        value: 'Delegado 2',
      },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.delegado.startsWith(value),
    sorter: (a, b) => a.delegado.localeCompare(b.delegado)          
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
    key: 'brick',
    title: 'Brick',
    dataIndex: 'brick',
    width: '15%',
    sorter: (a, b) => a.brick.localeCompare(b.brick)
  },
  {
    key: 'action',
    title: '',
    width: '15%',
    render: (title, entry) => (
      <Space style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', height: '100%'}}>
        <ConfigProvider theme={themeConfig}>
          <Button onClick={() => navigate(`/delegados/${entry.key}`)}>Detalhes</Button>  
        </ConfigProvider>
      </Space>
    ),
  },
];

// const dataSource = Array.from({
//   length: 100,
// }).map((_, i) => ({
//   key: i,
//   delegado: `Delegado ${i}`,
//   distrito: `Distrito ${i}`,
//   regiao: `Região ${i}`,      
//   freguesia: `Freguesia ${i}`,
//   brick: `Brick ${i}`,
// }));

export default function Delegados() {  
  const date = getFormattedDate();

  const navigate = useNavigate()
  const location = useLocation();

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
      <Upload {...UploadFileProps(location.pathname)} maxCount={1}>
        <Button icon={<HiOutlineUpload />} style={{padding: 0, margin: 0, background: 'none', border: 'none', boxShadow: 'none'}}>
          Registo por Ficheiro
        </Button>
      </Upload>
    },
  ];

  // State to update table's content
  const [data, setData] = useState([])

  // Fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/delegados");

      if (response.status === 200){
        console.log('Form submitted successfully:', response.data);
        setData(response.data)
      } else {
        console.error('Form submission failed:', response.status);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } 
  }

  // Load the table's content and update it when necessary
  useEffect (() => {
    // Track if the component is still mounted
    let isMounted = true; 

    // Fetch data if there's no data or if there's an update
    if (isMounted && (!data.length || location.state?.shouldFetchData)) fetchData();

    return () => {
      // Cleanup flag when component unmounts
      isMounted = false;
    };
  }, [data.length, location.state?.shouldFetchData]);

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
            <Table 
              columns={columns(navigate)}
              dataSource={data}
              scroll={{x: 'max-content'}}
              pagination={{ pageSize: 7, showSizeChanger: false }}
              showSorterTooltip={false}                             
            />
          </ConfigProvider>        
        </div>
      </div>
  );
}
