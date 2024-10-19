import React from 'react';
import { HiOutlineUpload } from "react-icons/hi";
import { createStyles } from 'antd-style';
import { IoAddCircleOutline, IoPersonOutline } from "react-icons/io5";
import { Dropdown, message, Space, Upload, Button, Table,Tag } from 'antd';


// For the register dropdown menu
const onClick = ({ key }) => {
  if (key == 1)
    message.info(`Redirecionar para a página de Registo Individual`);
};


const beforeUpload = (file) => {
  console.log(file.type)
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  // Check if the file is an Excel file
  if (!isExcel) {
    message.error('Apenas pode importar ficheiros Excel');
    return Upload.LIST_IGNORE;
  }
};

const items = [
  {
    key: '1',
    label: 'Registo Individual',
    icon: <IoPersonOutline />
  },
  {
    key: '2',
    label: 
    <Upload maxCount={1} beforeUpload={beforeUpload}>
      <Button className='button-import' icon={<HiOutlineUpload />} type="text">
        Registo por Ficheiro
      </Button>
    </Upload>
  },
];



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
    width: 100,
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
    width: '30%',
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
      <Space style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', height: '100%'}}>
         <Button style={{ backgroundColor: '#F7E6D4',color: 'black', borderColor: '#F7E6D4'}}
        >Detalhes</Button>
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
  const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
  const date = currentDate.toLocaleDateString('pt-BR', options);

  const { styles } = useStyle();
  
  return (
    <div id="contact">
      
      <div>
        
        <h1>Consultar Médicos</h1>

        <div id="data-import">
          {date}

          <Dropdown menu={{items,onClick,}}>
              <Space 
  >
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




