import React from 'react';
import { HiOutlineUpload } from "react-icons/hi";
import { createStyles } from 'antd-style';
import { LuStethoscope } from "react-icons/lu";
import { IoAddCircleOutline } from "react-icons/io5";
import { Dropdown, message, Space, Upload, Button, Table,Tag,  ConfigProvider} from 'antd';
import { useNavigate } from "react-router-dom"

// Upload a Excel file
const props = {
  listType: 'picture',
  
  beforeUpload: (file) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    // Check if the file is an Excel file
    if (!isExcel) {
      message.error(`"${file.name}" não é um ficheiro Excel`);
      return Upload.LIST_IGNORE;
    }
    else {
      message.success(`"${file.name}" importado com sucesso`);
    }
  },

  // Handling the change event to monitor upload progress and success/failure
  onChange: (info) => {
    const { status } = info.file;
    if (status === 'done') {
      console.log(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      console.log(`${info.file.name} file upload failed.`);
    }
  },
};

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
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#F7D4D4',
        color: '#4A0000',
      },
    }),
    render: (title, entry) => (
      <Space style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', height: '100%'}}>
              <ConfigProvider
                theme={{
                  components: { 
                    "Button": {
                      "defaultBg": "rgb(247,230,212)",
                      "defaultBorderColor": "rgb(247,230,212)",
                      "defaultHoverColor": "rgb(74,0,0)",
                      "defaultHoverBorderColor": "rgb(74,0,0)",
                      "defaultHoverBg": "rgb(247,230,212)",
                      "defaultActiveBorderColor": "rgb(74,0,0)",
                      "defaultActiveColor": "rgb(74,0,0)"
                    }
                  },
                }}>
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
  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const date = currentDate.toLocaleDateString('pt-BR', options);

  
  
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
      <Upload {...props} maxCount={1}>
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
        <h1>Consultar Médicos</h1>

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
        theme={{
          components: { 
            "Table": {
              "headerBg": "#F7D4D4",                // Background da header
              "headerColor": "#4A0000",             // Texto da header
              "stickyScrollBarBg": "#565656",       // Backgroud da barra de scroll
              "headerSortHoverBg": "#ddbebe",       // Background da header com hover quando ela tem um sorter aplicado,
              "fixedHeaderSortActiveBg": "#ddbebe", // Mesma coisa do de cima mas para colunas fixas
              "headerSortActiveBg": "#ddbebe",      
            }
          },
        }}>
        {table}  
      </ConfigProvider>
    </div>
  );
}
