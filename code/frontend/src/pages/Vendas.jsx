import React from 'react';
import { HiOutlineUpload } from "react-icons/hi";
import { IoAddCircleOutline } from "react-icons/io5";
import { Dropdown, Space, Upload, Button, Table, ConfigProvider } from 'antd';

import themeConfig from '../styles/themeConfig';
import UploadFileProps from '../components/UploadFile';
import { getFormattedDate } from '../components/utils';

// For the tables
const columns_produto = [
  {
    key: 'produto',
    title: 'Produto',
    dataIndex: 'produto',
    width: '20%',
    fixed: 'left',
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
    width: '20%',
    sorter: (a, b) => a.janeiro - b.janeiro          
  },
  {
    key: 'fevereiro',
    title: 'Fev',
    dataIndex: 'fevereiro',
    width: '20%',
    sorter: (a, b) => a.fevereiro - b.fevereiro
  },
  {
    key: 'marco',
    title: 'Mar',
    dataIndex: 'marco',
    width: '20%',
    sorter: (a, b) => a.marco - b.marco
  },
  {
    key: 'abril',
    title: 'Abr',
    dataIndex: 'abril',
    width: '20%',
    sorter: (a, b) => a.abril - b.abril
  },
  {
    key: 'maio',
    title: 'Mai',
    dataIndex: 'maio',
    width: '20%',
    sorter: (a, b) => a.maio - b.maio
  },
  {
    key: 'junho',
    title: 'Jun',
    dataIndex: 'junho',
    width: '20%',
    sorter: (a, b) => a.junho - b.junho
  },
  {
    key: 'julho',
    title: 'Jul',
    dataIndex: 'junho',
    width: '20%',
    sorter: (a, b) => a.junho - b.junho
  },
  {
    key: 'agosto',
    title: 'Ago',
    dataIndex: 'agosto',
    width: '20%',
    sorter: (a, b) => a.agosto - b.agosto
  },
  {
    key: 'setembro',
    title: 'Set',
    dataIndex: 'setembro',
    width: '20%',
    sorter: (a, b) => a.setembro - b.setembro
  },
  {
    key: 'outubro',
    title: 'Out',
    dataIndex: 'outubro',
    width: '20%',
    sorter: (a, b) => a.outubro - b.outubro
  },
  {
    key: 'novembro',
    title: 'Nov',
    dataIndex: 'novembro',
    width: '20%',
    sorter: (a, b) => a.novembro - b.novembro
  },
  {
    key: 'dezembro',
    title: 'Dez',
    dataIndex: 'dezembro',
    width: '20%',
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
    width: '20%',
    fixed: 'left',
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
    width: '20%',
    sorter: (a, b) => a.janeiro - b.janeiro          
  },
  {
    key: 'fevereiro',
    title: 'Fev',
    dataIndex: 'fevereiro',
    width: '20%',
    sorter: (a, b) => a.fevereiro - b.fevereiro
  },
  {
    key: 'marco',
    title: 'Mar',
    dataIndex: 'marco',
    width: '20%',
    sorter: (a, b) => a.marco - b.marco
  },
  {
    key: 'abril',
    title: 'Abr',
    dataIndex: 'abril',
    width: '20%',
    sorter: (a, b) => a.abril - b.abril
  },
  {
    key: 'maio',
    title: 'Mai',
    dataIndex: 'maio',
    width: '20%',
    sorter: (a, b) => a.maio - b.maio
  },
  {
    key: 'junho',
    title: 'Jun',
    dataIndex: 'junho',
    width: '20%',
    sorter: (a, b) => a.junho - b.junho
  },
  {
    key: 'julho',
    title: 'Jul',
    dataIndex: 'junho',
    width: '20%',
    sorter: (a, b) => a.junho - b.junho
  },
  {
    key: 'agosto',
    title: 'Ago',
    dataIndex: 'agosto',
    width: '20%',
    sorter: (a, b) => a.agosto - b.agosto
  },
  {
    key: 'setembro',
    title: 'Set',
    dataIndex: 'setembro',
    width: '20%',
    sorter: (a, b) => a.setembro - b.setembro
  },
  {
    key: 'outubro',
    title: 'Out',
    dataIndex: 'outubro',
    width: '20%',
    sorter: (a, b) => a.outubro - b.outubro
  },
  {
    key: 'novembro',
    title: 'Nov',
    dataIndex: 'novembro',
    width: '20%',
    sorter: (a, b) => a.novembro - b.novembro
  },
  {
    key: 'dezembro',
    title: 'Dez',
    dataIndex: 'dezembro',
    width: '20%',
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

const items = [
  {
    key: '1',
    label:  
      <Upload {...UploadFileProps} maxCount={1}>
        <Button icon={<HiOutlineUpload />} style={{padding: 0, margin: 0, background: 'none', border: 'none', boxShadow: 'none'}}>
          Importar Ficheiro
        </Button>
      </Upload>
  },
];

export default function Vendas() {  
  const date = getFormattedDate();

  return (
      <div id="contact">
        <div>
          <h1>Vendas</h1>

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

          <p>Consulta por Produto</p>
          <Table 
            columns={columns_produto}
            dataSource={dados_produto}
            scroll={{x: '200%'}}
            pagination={{ pageSize: 7, showSizeChanger: false }}
            showSorterTooltip={false}                             
          />

          <p>Consulta por Brick</p>
          <Table
            columns={columns_brick}
            dataSource={dados_brick}
            scroll={{x: '200%'}}
            pagination={{ pageSize: 7, showSizeChanger: false }}
            showSorterTooltip={false}                             
          />
        </ConfigProvider>
      </div>
  );
}
