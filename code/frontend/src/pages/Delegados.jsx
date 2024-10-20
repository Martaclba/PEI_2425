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
const columns = [
  {
    key: 'delegado',
    title: 'Delegado',
    dataIndex: 'delegado',
    width: '15%',
    fixed: 'left',
  },
  {
    key: 'distrito',
    title: 'Distrito',
    dataIndex: 'distrito',
    width: '15%',
  },
  {
    key: 'regiao',
    title: 'Região',
    dataIndex: 'regiao',
    width: '15%',
  },
  {
    key: 'freguesia',
    title: 'Freguesia',
    dataIndex: 'freguesia',
    width: '15%',
  },
  {
    key: 'brick',
    title: 'Brick',
    dataIndex: 'brick',
    width: '15%',
  },
  {
    key: 'action',
    title: '',
    width: '15%',
    render: () => (
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
                <Button>Detalhes</Button>  
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

 
const table = <Table 
  columns={columns}
  dataSource={dataSource}
  scroll={{x: 'max-content'}}
  pagination={{ pageSize: 7, showSizeChanger: false }}
/>
 

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
          Registo por Ficheiro
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
              "headerBg": "#F7D4D4",              // Background da header
              "headerColor": "#4A0000",           // Texto da header
              "stickyScrollBarBg": "#565656"      // Backgroud da barra de scroll
            }
          },
        }}>
        {table}  
      </ConfigProvider>
    </div>
  );
}
