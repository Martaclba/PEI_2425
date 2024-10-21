import React from 'react';
import { HiOutlineUpload } from "react-icons/hi";
import { IoAddCircleOutline, IoPersonOutline } from "react-icons/io5";
import { Dropdown, message, Space, Upload, Button, Table, ConfigProvider } from 'antd';
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
    onFilter: (value, record) => record.name.startsWith(value),
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
  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const date = currentDate.toLocaleDateString('pt-BR', options);

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
        <h1>Consultar Delegados</h1>

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
