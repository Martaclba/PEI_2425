import React from 'react';
import { HiOutlineUpload } from "react-icons/hi";
import { IoAddCircleOutline, IoPersonOutline } from "react-icons/io5";
import { Dropdown, Space, Upload, Button, Table, ConfigProvider } from 'antd';
import { useNavigate } from "react-router-dom"

import themeConfig from '../styles/themeConfig';
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
                <Button onClick={() => navigate(`/delegados/detalhes/${entry.key}`)}>Detalhes</Button>  
              </ConfigProvider>
      </Space>
    ),
  },
];

const dataSource = Array.from({
  length: 100,
}).map((_, i) => ({
  key: i,
  delegado: `Edward King ${i}`,
  distrito: `Distrito ${i}`,
  regiao: `Região ${i}`,      
  freguesia: `Freguesia ${i}`,
  brick: `Brick ${i}`,
}));

export default function Delegados() {  
  const date = getFormattedDate();

  let navigate = useNavigate()
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
      <Upload {...UploadFileProps} maxCount={1}>
        <Button icon={<HiOutlineUpload />} style={{padding: 0, margin: 0, background: 'none', border: 'none', boxShadow: 'none'}}>
          Registo por Ficheiro
        </Button>
      </Upload>
    },
  ];

  return (
      <div id="contact">
        <div>
          <h1>Delegados</h1>

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
