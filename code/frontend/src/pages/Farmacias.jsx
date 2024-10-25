import React from 'react';
import { LuCross } from "react-icons/lu";
import { IoAddCircleOutline} from "react-icons/io5";
import { Dropdown, Space, Button, Table, ConfigProvider } from 'antd';
import { useNavigate } from "react-router-dom";

import themeConfig from '../styles/themeConfig';
import { getFormattedDate } from '../components/utils';

const columns = (navigate) => [
  {
    key: 'farmacia',
    title: 'Farmácia',
    dataIndex: 'farmacia',
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
    onFilter: (value, record) => record.name.startsWith(value),
    sorter: (a, b) => a.farmacia.localeCompare(b.farmacia)          
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
    sorter: (a, b) => a.morada.localeCompare(b.morada) 
  },
  {
    key: 'contacto',
    title: 'Contacto',
    dataIndex: 'contacto',
    width: '15%',
  },
  {
    key: 'action',
    title: '',
    width: '15%',
    render: (title, entry) => (
      <Space style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', height: '100%'}}>
              <ConfigProvider theme={themeConfig}>
                <Button onClick={() => navigate(`/farmacias/detalhes/${entry.key}`)}>Detalhes</Button>  
              </ConfigProvider>
      </Space>
    ),
  },
];

const dataSource = Array.from({
  length: 100,
}).map((_, i) => ({
  key: i,
  farmacia: `Edward King ${i}`,
  distrito: `Distrito ${i}`,
  regiao: `Região ${i}`,      
  freguesia: `Freguesia ${i}`,
  morada: `Morada ${i}`,    
  contacto: '252 543 667',    
}));
 

export default function Farmacias() {  
  const date = getFormattedDate();
  
  let navigate = useNavigate()
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

  return (
    <div id="contact">
      <div>
        <h1>Consultar Farmácias</h1>

        <div id="data-import">
          {date}

          <Dropdown menu={{items}}>
              <Space>
                <IoAddCircleOutline onClick={(e) => e.preventDefault()}/>
              </Space>
          </Dropdown>
        </div>
      </div>

      <ConfigProvider theme={themeConfig}>
        <Table 
          columns={columns(navigate)}
          dataSource={dataSource}
          scroll={{x: 'max-content'}}
          pagination={{ pageSize: 7, showSizeChanger: false }}
          showSorterTooltip={false}                            
        />   
      </ConfigProvider>
    </div>
  );
}
