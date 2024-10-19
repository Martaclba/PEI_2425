import React from 'react';
import { HiOutlineUpload } from "react-icons/hi";
import { createStyles } from 'antd-style';
import { IoAddCircleOutline, IoPersonOutline } from "react-icons/io5";
import { Dropdown, message, Space, Upload, Button, Table,Tag } from 'antd';
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
const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: unset;
          }
        }
      }
    `,
  };
});

const columns = [
  {
    title: 'Médico',
    width: '30%',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#F7D4D4',
        color: '#4A0000',
      },
    }),
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
    title: 'Instituição',
    width: 100,
    dataIndex: 'age',
    key: 'age',
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#F7D4D4',
        color: '#4A0000',
      },
    }),
  },
  {
    title: 'Especialidade',
    dataIndex: 'address',
    key: '1',
    width: 150,
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#F7D4D4',
        color: '#4A0000',
      },
    }),
  },
  {
    title: 'Estado',
    dataIndex: 'tags',
    key: '2',
    width: 150,
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#F7D4D4',
        color: '#4A0000',
      },
    }),
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
    )
  },
  {
    title: 'Distrito',
    dataIndex: 'address',
    key: '3',
    width: 150,
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#F7D4D4',
        color: '#4A0000',
      },
    }),
  },
  {
    title: '',
    dataIndex: 'address',
    key: '4',
    width: 150,
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#F7D4D4',
        color: '#4A0000',
      },
    }),
    render: () => (
      <Space style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', height: '100%' }}>
         <Button style={{ backgroundColor: '#F7E6D4', color: 'black', borderColor: '#F7E6D4' }} >Detalhes</Button>
      </Space>
    ),
  },
];

const dataSource = Array.from({
  length: 100,
}).map((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `Edward King ${i}`,
  tags: ['Ativo','Inativo','Férias'],
}));
 

function Medicos() {  
  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const date = currentDate.toLocaleDateString('pt-BR', options);

  const { styles } = useStyle();
  
  let navigate = useNavigate()
  const items = [
    {
      key: '1',
      label:  
        <Button icon={<IoPersonOutline />} style={{padding: 0, margin: 0, background: 'none', border: 'none', boxShadow: 'none'}} 
          onClick={() => navigate("/medicos/registar/")}
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

      <Table 
        className={styles.customTable}
        columns={columns}
        dataSource={dataSource}
        scroll={{x: 'max-content'}}
        pagination={{ pageSize: 7, showSizeChanger: false }}
      />
      
    </div>
  );
}

export default Medicos
