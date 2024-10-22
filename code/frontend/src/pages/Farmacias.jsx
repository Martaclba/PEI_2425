import React from 'react';
import { LuCross } from "react-icons/lu";
import { IoAddCircleOutline} from "react-icons/io5";
import { Dropdown, Space, Button, Table, ConfigProvider } from 'antd';
import { useNavigate } from "react-router-dom"


const columns = [
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
    /*
      localeCompare: This method compares two strings alphabetically. It returns:
        A negative value if a.distrito comes before b.distrito alphabetically.
        A positive value if a.distrito comes after b.distrito alphabetically.
        0 if both strings are equal. 
    */
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
  farmacia: `Edward King ${i}`,
  distrito: `Distrito ${i}`,
  regiao: `Região ${i}`,      
  freguesia: `Freguesia ${i}`,
  morada: `Morada ${i}`,    
  contacto: '252 543 667',    
}));
 
const table = <Table 
  columns={columns}
  dataSource={dataSource}
  scroll={{x: 'max-content'}}
  pagination={{ pageSize: 7, showSizeChanger: false }}
  showSorterTooltip={false}                             // desativa o pop up que aparecia quando tentava ordenar uma coluna
/> 

export default function Farmacias() {  
  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const date = currentDate.toLocaleDateString('pt-BR', options);
  
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
