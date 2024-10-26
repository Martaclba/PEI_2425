import React from 'react';
import { HiOutlineUpload } from "react-icons/hi";
import { LuStethoscope } from "react-icons/lu";
import { IoAddCircleOutline } from "react-icons/io5";
import { Dropdown, Space, Upload, Button, Table,Tag,  ConfigProvider} from 'antd';
import { useNavigate } from "react-router-dom"

import { getFormattedDate } from '../components/utils';
import themeConfig from '../styles/themeConfig';
import UploadFileProps from '../components/UploadFile';

const columns = (navigate) => [
  {
    title: 'Médico',
    width: '16%',
    dataIndex: 'medico',
    key: 'medico',
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
    onFilter: (value, record) => record.medico.startsWith(value),
    sorter: (a, b) => a.medico.localeCompare(b.medico)
  },
  {
    title: 'Instituição',
    width: '16%',
    dataIndex: 'instituicao',
    key: 'instituicao',
    sorter: (a, b) => a.instituicao.localeCompare(b.instituicao)
  },
  {
    title: 'Especialidade',
    dataIndex: 'especialidade',
    key: 'especialidade',
    width: '16%',
    sorter: (a, b) => a.especialidade.localeCompare(b.especialidade)
  },
  {
    title: 'Estado',
    dataIndex: 'estado',
    key: 'estado',
    width: '16%',
    render: (tags) => (
      <>
        {tags.map((tag) => {
          let color = tag === 'Ativo' ? 'green' : 'geekblue';
          if (tag === 'Inativo') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Distrito',
    dataIndex: 'distrito',
    key: 'distrito',
    width: '16%',
    sorter: (a, b) => a.distrito.localeCompare(b.distrito)
  },
  {
    title: '',
    dataIndex: 'address',
    key: '4',
    width: '16%',
    render: (title, entry) => (
      <Space style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', height: '100%'}}>
              <ConfigProvider
                theme={themeConfig}>
                <Button onClick={() => navigate(`/medicos/detalhes/${entry.key}`)}>Detalhes</Button>  
              </ConfigProvider>
      </Space>
    ),
  },
];

const dataSource = Array.from({
  length: 100,
}).map((_, i) => ({
  key: i,
  medico: `Medico ${i}`,
  instituicao: `Hospital ${i}`,
  especialidade: `Especialidade ${i}`,
  estado: ['Ativo','Inativo','Indisponível'],
  distrito: `Braga ${i}`
}));
 

export default function Medicos() {  
  const date = getFormattedDate();

  
  
  let navigate = useNavigate()
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
      <Upload {...UploadFileProps} maxCount={1}>
        <Button icon={<HiOutlineUpload />} style={{padding: 0, margin: 0, background: 'none', border: 'none', boxShadow: 'none'}}>
          Registo por Ficheiro
        </Button>
      </Upload>
    },
  ];
  
  const table = <Table 
  columns={columns(navigate)}
  dataSource={dataSource}
  scroll={{x: 'max-content'}}
  pagination={{ pageSize: 7, showSizeChanger: false }}
  showSorterTooltip={false}                             // desativa o pop up que aparecia quando tentava ordenar uma coluna
/>

  return (
    <div id="contact">
      <div>
        <h1>Médicos</h1>

        <div id="data-import">
          {date}

          <Dropdown menu={{items}}>
              <Space>
                <IoAddCircleOutline onClick={(e) => e.preventDefault()}/>
              </Space>
          </Dropdown>
        </div>
      </div>

      <ConfigProvider
        theme={themeConfig}>
        {table}  
      </ConfigProvider>
    </div>
  );
}
