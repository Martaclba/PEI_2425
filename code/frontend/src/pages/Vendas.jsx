import React, { useState, useMemo, useEffect } from 'react';
import { IconContext } from "react-icons";
import { HiOutlineUpload } from "react-icons/hi";
import { IoAddCircleOutline } from "react-icons/io5";
import { Dropdown, Space, Upload, Button, Table, ConfigProvider, Select, Form } from 'antd';
import { useLocation } from "react-router-dom"
import { Column } from '@ant-design/plots';

import themeConfig from '../styles/themeConfigTable';
import UploadFileProps from '../components/UploadFile';
import { getFormattedDate } from '../components/utils';
import axios from 'axios'; 
import {useAuth} from '../context/Auth';
import { useFetchSales } from '../components/useFetchSales';
import { getColumnsProdutoTotal } from '../components/utils';

                                    // TODO: REMOVER ESTES DEFAULTSSSSSSSSSSSSSSSSSSSSSSSS
const years_default = [
  { value: '2018' },
  { value: '2019' },
  { value: '2020' },
];

const delegates_default = [
  { value: "Rui Correia" },
  { value: "André Barros" },
  { value: "Matilde Santos"}
]

const companies_default = [
  { value: 'MyPharma' },
  { value: 'Pharma1000' },
  { value: 'Empresa 3'}
] 

const bricks_default = [
  { value: "brick 0"},
  { value: "brick 1"},
  { value: "brick 2"}
]

const products_default = [
  { value: "product 0"},
  { value: "product 1"},
  { value: "product 2"}
]


const predefinedValues_histogram = {
  Ano_H: new Date().getFullYear(),
  Delegado_H: 'Todos',
};

const predefinedValues_table_product = {
  Ano_P: new Date().getFullYear(),
  Delegado_P: 'Todos',
  Empresa_P: 'Todos',
  Brick_P: 'Todos',
  Product_P: 'Todos'
};

const predefinedValues_table_total = {
  Delegado_TP: 'Todos',
  Empresa_TP: 'Todos',
  Brick_TP: 'Todos',
  Product_TP: 'Todos'
};

const predefinedValues_table_brick = {
  Ano_B: new Date().getFullYear(),
  Delegado_B: 'Todos',
  Empresa_B: 'Todos',
};



const data = [                      // TODO: REMOVER DEPOISSSSSSSSSS
  { type: 'Jan', value: 0.16 },
  { type: 'Fev', value: 0.125 },
  { type: 'Mar', value: 0.24 },
  { type: 'Apr', value: 0.19 },
  { type: 'May', value: 0.22 },
  { type: 'Jun', value: 0.05 },
  { type: 'Jul', value: 0.01 },
  { type: 'Aug', value: 0.015 },
  { type: 'Sep', value: 0.05 },
  { type: 'Nov', value: 0.01 },
  { type: 'Dec', value: 0.015 },
];

const DemoColumn = ({ dataHistogram }) => {
  const config = {
    data: dataHistogram,
    xField: 'type',
    yField: 'value',
    style: {
      fill: ({ type }) => {
        if (type === 'Jul' || type === 'Aug') {
          return '#22CBCC';
        }
        return '#2989FF';
      },
    },
    label: {
      text: (originData) => {
        const val = parseFloat(originData.value);
        if (val < 0.0) {
          return (val * 100).toFixed(1) + '%';
        }
        return '';
      },
      offset: 10,
    },
    legend: false,
  };
  return <Column {...config} />;
};

const columns_produto = [
  {
    key: 'produto',
    title: 'Produto',
    dataIndex: 'produto',
    fixed: 'left',
    className: 'fixed-column',
    sorter: (a, b) => a.produto.localeCompare(b.produto)          
  },
  {
    key: 'janeiro',
    title: 'Jan',
    dataIndex: 'janeiro',
    sorter: (a, b) => a.janeiro - b.janeiro          
  },
  {
    key: 'fevereiro',
    title: 'Fev',
    dataIndex: 'fevereiro',
    sorter: (a, b) => a.fevereiro - b.fevereiro
  },
  {
    key: 'marco',
    title: 'Mar',
    dataIndex: 'marco',
    sorter: (a, b) => a.marco - b.marco
  },
  {
    key: 'abril',
    title: 'Abr',
    dataIndex: 'abril',
    sorter: (a, b) => a.abril - b.abril
  },
  {
    key: 'maio',
    title: 'Mai',
    dataIndex: 'maio',
    sorter: (a, b) => a.maio - b.maio
  },
  {
    key: 'junho',
    title: 'Jun',
    dataIndex: 'junho',
    sorter: (a, b) => a.junho - b.junho
  },
  {
    key: 'julho',
    title: 'Jul',
    dataIndex: 'junho',
    sorter: (a, b) => a.junho - b.junho
  },
  {
    key: 'agosto',
    title: 'Ago',
    dataIndex: 'agosto',
    sorter: (a, b) => a.agosto - b.agosto
  },
  {
    key: 'setembro',
    title: 'Set',
    dataIndex: 'setembro',
    sorter: (a, b) => a.setembro - b.setembro
  },
  {
    key: 'outubro',
    title: 'Out',
    dataIndex: 'outubro',
    sorter: (a, b) => a.outubro - b.outubro
  },
  {
    key: 'novembro',
    title: 'Nov',
    dataIndex: 'novembro',
    sorter: (a, b) => a.novembro - b.novembro
  },
  {
    key: 'dezembro',
    title: 'Dez',
    dataIndex: 'dezembro',
    sorter: (a, b) => a.dezembro - b.dezembro
  },
];

const dados_produto = Array.from({    // TODO: REMOVER DEPOISSSSSSSSSS
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

const columns_produto_total = getColumnsProdutoTotal()

const columns_brick = [
  {
    key: 'brick',
    title: 'Brick',
    dataIndex: 'brick',
    fixed: 'left',
    className: 'fixed-column',
    sorter: (a, b) => a.brick.localeCompare(b.brick)          
  },
  {
    key: 'janeiro',
    title: 'Jan',
    dataIndex: 'janeiro',
    sorter: (a, b) => a.janeiro - b.janeiro          
  },
  {
    key: 'fevereiro',
    title: 'Fev',
    dataIndex: 'fevereiro',
    sorter: (a, b) => a.fevereiro - b.fevereiro
  },
  {
    key: 'marco',
    title: 'Mar',
    dataIndex: 'marco',
    sorter: (a, b) => a.marco - b.marco
  },
  {
    key: 'abril',
    title: 'Abr',
    dataIndex: 'abril',
    sorter: (a, b) => a.abril - b.abril
  },
  {
    key: 'maio',
    title: 'Mai',
    dataIndex: 'maio',
    sorter: (a, b) => a.maio - b.maio
  },
  {
    key: 'junho',
    title: 'Jun',
    dataIndex: 'junho',
    sorter: (a, b) => a.junho - b.junho
  },
  {
    key: 'julho',
    title: 'Jul',
    dataIndex: 'junho',
    sorter: (a, b) => a.junho - b.junho
  },
  {
    key: 'agosto',
    title: 'Ago',
    dataIndex: 'agosto',
    sorter: (a, b) => a.agosto - b.agosto
  },
  {
    key: 'setembro',
    title: 'Set',
    dataIndex: 'setembro',
    sorter: (a, b) => a.setembro - b.setembro
  },
  {
    key: 'outubro',
    title: 'Out',
    dataIndex: 'outubro',
    sorter: (a, b) => a.outubro - b.outubro
  },
  {
    key: 'novembro',
    title: 'Nov',
    dataIndex: 'novembro',
    sorter: (a, b) => a.novembro - b.novembro
  },
  {
    key: 'dezembro',
    title: 'Dez',
    dataIndex: 'dezembro',
    sorter: (a, b) => a.dezembro - b.dezembro
  },
];

const dados_brick = Array.from({    // TODO: REMOVER DEPOISSSSSSSSSS
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



export default function Vendas() {  
  const date = getFormattedDate();
  const { state } = useAuth();
  const location = useLocation();

  // Set a trigger after uploading a file successfully
  const [fetchTrigger, setFetchTrigger] = useState(false)
  const items = [
    {
      key: '1',
      label:  
        <Upload {...UploadFileProps(location.pathname, setFetchTrigger)} maxCount={1}>
          <Button icon={<HiOutlineUpload />} style={{padding: 0, margin: 0, background: 'none', border: 'none', boxShadow: 'none'}}>
            Importar Ficheiro
          </Button>
        </Upload>
    },
  ];

  // Filters forms
  const [form_histogram] = Form.useForm();
  const [form_table_product] = Form.useForm();
  const [form_table_total] = Form.useForm();
  const [form_table_brick] = Form.useForm();

  // Filters variables
  const [years, setYears] = useState(years_default);
  const [delegates, setDelegates] = useState(delegates_default);
  const [companies, setCompanies] = useState(companies_default);
  const [bricks, setBricks] = useState(bricks_default);
  const [products, setProducts] = useState(products_default);

  // Graph's data variables
  const [dataHistogram, setDataHistogram] = useState([])
  const [dataProducts, setDataProducts] = useState([])
  const [dataProductsTotal, setDataProductsTotal] = useState([])
  const [dataBricks, setDataBricks] = useState([])

  // This function will request the data after selecting an option on any form
  const onFinish = (type) => async (values) => {
    console.log('Received values of form: ', values)
    console.log('TYPE: ', type)
  
    try {
      const response = await axios.get(process.env.REACT_APP_API_PATH + "/", { params: values })
    
      if(response.status === 200){
        console.log('Form submitted successfully:', response.data);      
      } else {
        console.error('Form submission failed:', response.status);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Memoized filter configurations for each fetch
  const options_histogram = useMemo(
    () => (state.isAdmin ? { type: 'HISTOGRAM', delegates: true, years: true, companies: false, bricks: false,products:false } : { type: 'HISTOGRAM', delegates: false, years: false, companies: false, bricks: false, products: false}),
    [state.isAdmin]
  );

  const options_product = useMemo(
    () => (state.isAdmin ? { type: 'PRODUCT', delegates: true, years: true, companies: true, bricks: true, products:true} : { type: 'PRODUCT', delegates: false, years: false, companies: true, bricks: true, products: true}),
    [state.isAdmin]
  );

  const options_total = useMemo(
    () => (state.isAdmin ? { type: 'TOTAL_PRODUCT', delegates: true, years: false, companies: true, bricks: true, products:true} : { type: 'TOTAL_PRODUCT', delegates: false, years: false, companies: false, bricks: false, products: false}),
    [state.isAdmin]
  );

  const options_brick = useMemo(
    () => (state.isAdmin ? { type: 'BRICK', delegates: true, years: true, companies: true, bricks: true, products: false} : { type: 'BRICK', delegates: false, years: false, companies: true, bricks:true, products: false}),
    [state.isAdmin]
  );

  // Fetch data for each graph on loading the page. Should also return the filter's options 
  const { data_histogram, filters_histogram } = useFetchSales('/', fetchTrigger, options_histogram)
  const { data_table_product, filters_product } = useFetchSales('/', fetchTrigger, options_product)
  const { data_table_total, filters_table_total } = useFetchSales('/', fetchTrigger, options_total)
  const { data_table_brick, filters_table_brick } = useFetchSales('/', fetchTrigger, options_brick)

  // Update filter variables each time filters are fetched
  useEffect(() => {
    if (filters_histogram) {
        setYears(filters_histogram.years);
        setDelegates(filters_histogram.delegates);
        setCompanies(filters_histogram.companies);
        setBricks(filters_histogram.bricks);
    }
  }, [filters_histogram]);

  useEffect(() => {
    if (filters_product) {
        setYears(filters_product.years);
        setDelegates(filters_product.delegates);
        setCompanies(filters_product.companies);
        setBricks(filters_product.bricks);
        setProducts(filters_product.products)
    }
  }, [filters_product]);

  useEffect(() => {
    if (filters_table_total) {
        setYears(filters_table_total.years);
        setDelegates(filters_table_total.delegates);
        setCompanies(filters_table_total.companies);
        setBricks(filters_table_total.bricks);
        setProducts(filters_table_total.products)
    }
  }, [filters_table_total]);

  useEffect(() => {
    if (filters_table_brick) {
        setYears(filters_table_brick.years);
        setDelegates(filters_table_brick.delegates);
        setCompanies(filters_table_brick.companies);
        setBricks(filters_table_brick.bricks);
    }
  }, [filters_table_brick]);


  // Set graph's content
  useEffect(()=> {
    if (data_histogram){
      setDataHistogram(data_histogram);
    }
  },[data_histogram])

  useEffect(()=> {
    if (data_table_product){
      setDataProducts(data_table_product);
    }
  },[data_table_product])

  useEffect(()=> {
    if (data_table_total){
      setDataProductsTotal(data_table_total);
    }
  },[data_table_total])

  useEffect(()=> {
    if (data_table_brick){
      setDataBricks(data_table_brick);
    }
  },[data_table_brick])

  return (
      <div id="contact">
        <div>
          <h1>Vendas</h1>

          <div id="data-import">
            {date}

            {state.isAdmin && <Dropdown menu={{items}}>
              <Space>
                <IconContext.Provider value={{ size: '1.5rem' }}>  
                  <IoAddCircleOutline onClick={(e) => e.preventDefault()}/>
                </IconContext.Provider>
              </Space>
            </Dropdown>}
          </div>
        </div>
        
        <div style={{padding: '1rem'}}>
          <div className='dashboard-card'>
            <div id='data-import'>
              <p className="table-title">Histórico De Vendas</p>

              {state.isAdmin && 
                <div style={{display:'flex', gap:'1rem', marginBottom: '1rem'}}>
                  <Form
                    name="histogram"
                    onFinish={onFinish("HISTOGRAM")}
                    layout="inline"
                    initialValues={predefinedValues_histogram}
                    form={form_histogram}
                  >
                    <Form.Item className="large-select" name='Ano_H'>
                      <Select 
                        placeholder="Ano"
                        options={years}
                        onChange={() => form_histogram.submit()}
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>

                    <Form.Item className="large-select" name='Delegado_H'>
                      <Select                         
                        placeholder="Delegado"
                        options={delegates}
                        onChange={() => form_histogram.submit()} 
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  </Form>
                </div>
              }
            </div>
            <DemoColumn dataHistogram={dataHistogram} />
          </div>

          <ConfigProvider theme={themeConfig}>  
            <div className='dashboard-card'>
              <p className="table-title">Consulta por Produto</p>

              <div style={{display:'flex', gap:'1rem', marginBottom: '1rem'}}>
                <Form
                  name="table_product"
                  onFinish={onFinish("TABLE_PRODUCT")}
                  layout="inline"
                  initialValues={predefinedValues_table_product}
                  form={form_table_product}
                >
                  {state.isAdmin && 
                    <Form.Item className="large-select" name='Ano_P'>
                      <Select                       
                        placeholder="Ano"
                        options={years} 
                        onChange={() => form_table_product.submit()}
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  }

                  {state.isAdmin && 
                    <Form.Item className="large-select" name='Delegado_P'>
                      <Select                       
                        placeholder="Delegado"
                        options={delegates} 
                        onChange={() => form_table_product.submit()}
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  }
                  
                  <Form.Item className="large-select" name='Empresa_P'>
                    <Select                     
                      placeholder="Empresa"
                      options={companies} 
                      onChange={() => form_table_product.submit()}
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>

                  <Form.Item className="large-select" name='Brick_P'>
                    <Select                     
                      placeholder="Brick"
                      options={bricks} 
                      onChange={() => form_table_product.submit()}
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>

                  <Form.Item className="large-select" name='Product_P'>
                    <Select                     
                      placeholder="Product"
                      options={products} 
                      onChange={() => form_table_product.submit()}
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>
                </Form>
              </div>

              <Table 
                columns={columns_produto}
                // dataSource={dados_produto}
                dataSource={dataProducts}
                scroll={{x: 'max-content'}}
                pagination={{ pageSize: 7, showSizeChanger: false }}
                showSorterTooltip={false}                             
              />
            </div>

            {state.isAdmin && <div className='dashboard-card'>
              <p className="table-title">Consulta Total por Produto</p>
              <div style={{display:'flex', gap:'1rem', marginBottom:'1rem'}}>
                <Form
                  name="table_brick"
                  onFinish={onFinish("TABLE_TOTAL")}
                  layout="inline"
                  initialValues={predefinedValues_table_total}
                  form={form_table_total}
                >
                    <Form.Item className="large-select" name='Delegado_TP'>
                      <Select                       
                        placeholder="Delegado"
                        options={delegates}
                        onChange={() => form_table_total.submit()}
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  

                  
                    <Form.Item className="large-select" name='Empresa_TP'> 
                      <Select                       
                        placeholder="Empresa"
                        options={companies} 
                        onChange={() => form_table_total.submit()}
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  

                  <Form.Item className="large-select" name='Brick_TP'> 
                    <Select                     
                      placeholder="Brick"
                      options={bricks} 
                      onChange={() => form_table_total.submit()}
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>

                  <Form.Item className="large-select" name='Product_TP'> 
                    <Select                     
                      placeholder="Product"
                      options={products} 
                      onChange={() => form_table_total.submit()}
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>
                </Form>
              </div>

              <Table
                columns={columns_produto_total}
                dataSource={dataProductsTotal}
                scroll={{x: 'max-content'}}
                pagination={{ pageSize: 7, showSizeChanger: false }}
                showSorterTooltip={false}                             
              />
            </div>}

            <div className='dashboard-card'>
              <p className="table-title">Consulta por Brick</p>
              <div style={{display:'flex', gap:'1rem', marginBottom:'1rem'}}>
                <Form
                  name="table_total"
                  onFinish={onFinish("TABLE_BRICK")}
                  layout="inline"
                  initialValues={predefinedValues_table_brick}
                  form={form_table_brick}
                >
                  {state.isAdmin && 
                    <Form.Item className="large-select" name='Ano_B'>
                      <Select                       
                        placeholder="Ano"
                        options={years}
                        onChange={() => form_table_brick.submit()}
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  }

                  {state.isAdmin &&
                    <Form.Item className="large-select" name='Delegado_B'> 
                      <Select                       
                        placeholder="Delegado"
                        options={delegates} 
                        onChange={() => form_table_brick.submit()}
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  }

                  <Form.Item className="large-select" name='Empresa_B'> 
                    <Select                     
                      placeholder="Empresa"
                      options={companies} 
                      onChange={() => form_table_brick.submit()}
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>
                </Form>
              </div>

              <Table
                columns={columns_brick}
                dataSource={dataBricks}
                scroll={{x: 'max-content'}}
                pagination={{ pageSize: 7, showSizeChanger: false }}
                showSorterTooltip={false}                             
              />
            </div>

            
          </ConfigProvider>
        </div>
      </div>
  );
}
