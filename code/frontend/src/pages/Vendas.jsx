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
import {useAuth} from '../context/Auth';
import { useFetchSales } from '../components/useFetchSales';
import { getColumnsProdutoTotal } from '../components/utils';

                              // TODO: REMOVER ESTES DEFAULTSSSSSSSSSSSSSSSSSSSSSSSS
const years_default = [
  { label: '2018', value: '2018' },
  { label: '2019', value: '2019' },
  { label: '2020', value: '2020' },
];

const delegates_default = [
  { label: "Rui Correia", value: "Rui Correia" },
  { label: "André Barros", value: "André Barros" },
  { label: "Matilde Santos", value: "Matilde Santos" }
]

const companies_default = [
  { label: 'MyPharme', value: 'MyPharma' },
  { label: 'Pharma1000', value: 'Pharma1000' },
  { label: 'Empresa 3', value: 'Empresa 3'}
] 

const bricks_default = [
  { label: "brick 0", value: "brick 0"},
  { label: "brick 1", value: "brick 1"},
  { label: "brick 2", value: "brick 2"}
]

const products_default = [
  { label: "product 0", value: "product 0" },
  { label: "product 1", value: "product 1" },
  { label: "product 2", value: "product 2" }
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



export default function Vendas() {  
  const date = getFormattedDate();
  const { state } = useAuth();
  const location = useLocation();


  // Set a trigger after uploading a file successfully
  const [fetchTriggers, setFetchTriggers] = useState({
    histogram: false,
    products: false,
    totalProducts: false,
    bricks: false,
  });


  // Dropdown menu item for uploading files
  const items = [
    {
      key: '1',
      label:  
        <Upload {...UploadFileProps(location.pathname, setFetchTriggers)} maxCount={1}>
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

  // Store filters form's values to be able to pass them to the fetch hook
  const [formValues, setFormValues] = useState({
    histogram: {},
    products: {},
    totalProducts: {},
    bricks: {}
  });


  // Filters variables          
  const [filters, setFilters] = useState({
    histogram: { years: years_default, delegates: delegates_default },
    products: { years: years_default, delegates: delegates_default, companies: companies_default, bricks: bricks_default, products: products_default },
    totalProducts: { delegates: delegates_default, companies: companies_default, bricks: bricks_default, products: products_default },
    bricks: { years: years_default, delegates: delegates_default, companies: companies_default }
  });
  
  
  // Graph's data variables
  const [dataHistogram, setDataHistogram] = useState([])
  const [dataProducts, setDataProducts] = useState([])
  const [dataProductsTotal, setDataProductsTotal] = useState([])
  const [dataBricks, setDataBricks] = useState([])


  // Memoized filter configurations for each fetch
  const options = useMemo(() => ({
    histogram: { option_selected: formValues.histogram, type: 'HISTOGRAM', delegates: state.isAdmin, years: state.isAdmin, companies: false, bricks: false, products: false },
    products: { option_selected: formValues.products, type: 'PRODUCT', delegates: state.isAdmin, years: state.isAdmin, companies: true, bricks: true, products: true },
    totalProducts: { option_selected: formValues.totalProducts, type: 'TOTAL_PRODUCT', delegates: state.isAdmin, years: false, companies: state.isAdmin, bricks: state.isAdmin, products: state.isAdmin },
    bricks: { option_selected: formValues.bricks, type: 'BRICK', delegates: state.isAdmin, years: state.isAdmin, companies: true, bricks: true, products: false },
  }), [state.isAdmin, formValues]);


  // This function will request the data after selecting an option on any form
  const onFinish = (type) => (values) => {
    // Update formValues with the latest form input
    setFormValues((prev) => ({ ...prev, [type]: values }));
  
    // Set a trigger to fetch data
    setFetchTriggers((prev) => ({ ...prev, [type]: Date.now() }));
  };


  // Fetch data for each graph on loading the page. Should also return the filter's options 
  const { data_histogram, filters_histogram } = useFetchSales('/', fetchTriggers.histogram, options.histogram)
  const { data_table_product, filters_product } = useFetchSales('/', fetchTriggers.products, options.products)
  const { data_table_total, filters_table_total } = useFetchSales('/', fetchTriggers.totalProducts, options.totalProducts)
  const { data_table_brick, filters_table_brick } = useFetchSales('/', fetchTriggers.bricks, options.bricks)


  // Update filter variables each time filters are fetched
  useEffect(() => {
    if (filters_histogram) {
      setFilters((prev) => ({
        ...prev,
        histogram: { 
          years: filters_histogram.years, 
          delegates: filters_histogram.delegates 
        },
      }));
    }
  }, [filters_histogram]);

  useEffect(() => {
    if (filters_product) {
      setFilters((prev) => ({
        ...prev,
        products: {
          years: filters_product.years,
          delegates: filters_product.delegates,
          companies: filters_product.companies,
          bricks: filters_product.bricks,
          products: filters_product.products,
        },
      }));
    }
  }, [filters_product]);

  // VER DEPOIS SE NÃO DÁ ERRO PORQUE SE NÃO FOR ADMIN ISTO VEM VAZIO
  // useEffect(() => {
  //   if (filters_product) {
  //       setYearsP(filters_product.years);                                    
  //       setDelegatesP(filters_product.delegates);
  //       setCompaniesP(filters_product.companies);
  //       setBricksP(filters_product.bricks);
  //       setProductsP(filters_product.products)
  //   }
  // }, [filters_product]);

  useEffect(() => {
    if (filters_table_total) {
      setFilters((prev) => ({
        ...prev,
        totalProducts: {
          delegates: filters_table_total.delegates,
          companies: filters_table_total.companies,
          bricks: filters_table_total.bricks,
          products: filters_table_total.products,
        },
      }));
    }
  }, [filters_table_total]);

  useEffect(() => {
    if (filters_table_brick) {
      setFilters((prev) => ({
        ...prev,
        bricks: {
          years: filters_table_brick.years,
          delegates: filters_table_brick.delegates,
          companies: filters_table_brick.companies,
        },
      }));
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
                    onFinish={onFinish("histogram")}
                    layout="inline"
                    initialValues={predefinedValues_histogram}
                    form={form_histogram}
                  >
                    <Form.Item className="large-select" name='Ano_H'>
                      <Select 
                        placeholder="Ano"                        
                        options={filters.histogram.years}
                        onChange={() => form_histogram.submit()}
                        showSearch
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>

                    <Form.Item className="large-select" name='Delegado_H'>
                      <Select                         
                        placeholder="Delegado"
                        options={filters.histogram.delegates}
                        onChange={() => form_histogram.submit()} 
                        showSearch
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
                  onFinish={onFinish("products")}
                  layout="inline"
                  initialValues={predefinedValues_table_product}
                  form={form_table_product}
                >
                  {state.isAdmin && 
                    <Form.Item className="large-select" name='Ano_P'>
                      <Select                       
                        placeholder="Ano"
                        options={filters.products.years} 
                        onChange={() => form_table_product.submit()}
                        showSearch
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  }

                  {state.isAdmin && 
                    <Form.Item className="large-select" name='Delegado_P'>
                      <Select                       
                        placeholder="Delegado"
                        options={filters.products.delegates} 
                        onChange={() => form_table_product.submit()}
                        showSearch
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  }
                  
                  <Form.Item className="large-select" name='Empresa_P'>
                    <Select                     
                      placeholder="Empresa"
                      options={filters.products.companies} 
                      onChange={() => form_table_product.submit()}
                      showSearch
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>

                  <Form.Item className="large-select" name='Brick_P'>
                    <Select                     
                      placeholder="Brick"
                      options={filters.products.bricks} 
                      onChange={() => form_table_product.submit()}
                      showSearch
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>

                  <Form.Item className="large-select" name='Product_P'>
                    <Select                     
                      placeholder="Product"
                      options={filters.products.products} 
                      onChange={() => form_table_product.submit()}
                      showSearch
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>
                </Form>
              </div>

              <Table 
                columns={columns_produto}
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
                  onFinish={onFinish("totalProducts")}
                  layout="inline"
                  initialValues={predefinedValues_table_total}
                  form={form_table_total}
                >
                    <Form.Item className="large-select" name='Delegado_TP'>
                      <Select                       
                        placeholder="Delegado"
                        options={filters.totalProducts.delegates}
                        onChange={() => form_table_total.submit()}
                        showSearch
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  

                  
                    <Form.Item className="large-select" name='Empresa_TP'> 
                      <Select                       
                        placeholder="Empresa"
                        options={filters.totalProducts.companies} 
                        onChange={() => form_table_total.submit()}
                        showSearch
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  

                  <Form.Item className="large-select" name='Brick_TP'> 
                    <Select                     
                      placeholder="Brick"
                      options={filters.totalProducts.bricks} 
                      onChange={() => form_table_total.submit()}
                      showSearch
                      filterOption={(input, option) => 
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </Form.Item>

                  <Form.Item className="large-select" name='Product_TP'> 
                    <Select                     
                      placeholder="Product"
                      options={filters.totalProducts.products} 
                      onChange={() => form_table_total.submit()}
                      showSearch
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
                  onFinish={onFinish("bricks")}
                  layout="inline"
                  initialValues={predefinedValues_table_brick}
                  form={form_table_brick}
                >
                  {state.isAdmin && 
                    <Form.Item className="large-select" name='Ano_B'>
                      <Select                       
                        placeholder="Ano"
                        options={filters.bricks.years}
                        onChange={() => form_table_brick.submit()}
                        showSearch
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  }

                  {state.isAdmin &&
                    <Form.Item className="large-select" name='Delegado_B'> 
                      <Select                       
                        placeholder="Delegado"
                        options={filters.bricks.delegates} 
                        onChange={() => form_table_brick.submit()}
                        showSearch
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  }

                  <Form.Item className="large-select" name='Empresa_B'> 
                    <Select                     
                      placeholder="Empresa"
                      options={filters.bricks.companies} 
                      onChange={() => form_table_brick.submit()}
                      showSearch
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
