import React from 'react';
import { LuCross } from "react-icons/lu";
import { IoAddCircleOutline} from "react-icons/io5";
import { Dropdown, Space, Button, Table, ConfigProvider } from 'antd';
import { useNavigate } from "react-router-dom"


// For the table
// const useStyle = createStyles(({ css, token }) => {
//   const { antCls } = token;
//   return {
//     customTable: css`
//       ${antCls}-table {
//         ${antCls}-table-container {
//           ${antCls}-table-body,
//           ${antCls}-table-content {
//             scrollbar-width: thin;
//             scrollbar-color: unset;
//           }
//         }
//       }
//     `,
//   };
// });

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
    key: 'morada',
    title: 'Morada',
    dataIndex: 'morada',
    width: '15%',
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
          onClick={() => navigate("/farmacia/registar/")}>
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
