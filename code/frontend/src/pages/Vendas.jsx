import React, { useMemo } from 'react';
import { IconContext } from "react-icons";
import { HiOutlineUpload } from "react-icons/hi";
import { IoAddCircleOutline } from "react-icons/io5";
import { Dropdown, Space, Upload, Button, Table, ConfigProvider, Select, Form, Empty } from 'antd';
import { useLocation } from "react-router-dom"
import { Column } from '@ant-design/plots';

import themeConfig from '../styles/themeConfigTable';
import UploadFileProps from '../components/UploadFile';
import { getFormattedDate } from '../components/utils';
import { useAuth } from '../context/Auth';
import { useFetchSales } from '../components/useFetchSales';
import { getColumnsProdutoTotal } from '../components/utils';
import useSalesDataStore from '../context/SalesData';



const DemoColumn = ({ dataHistogram }) => {
  if (!dataHistogram || dataHistogram.length === 0) {
    return (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
  }

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

  const { triggers, data, filters, selectedOption } = useSalesDataStore((state) => state)
  const updateFetchTriggers = useSalesDataStore((state) => state.updateFetchTriggers)
  const updateSelectedOption = useSalesDataStore((state) => state.updateSelectedOption)


  // Dropdown menu item for uploading files
  const items = [
    {
      key: '1',
      label:  
        <Upload {...UploadFileProps(location.pathname, updateFetchTriggers)} maxCount={1}>
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

  
  // Memoized filter configurations for each fetch
  const options = useMemo(() => ({
    histogram: { option_selected: selectedOption.histogram, type: 'histogram' },
    products: { option_selected: selectedOption.products, type: 'products' },
    totalProducts: { option_selected: selectedOption.totalProducts, type: 'totalProducts' },
    bricks: { option_selected: selectedOption.bricks, type: 'bricks' },
  }), [selectedOption]);


  // This function will request the data after selecting an option on any form
  const onFinish = (type) => (values) => {
    // Update selected option with the latest form input
    updateSelectedOption(type, values)

    // Set a trigger to fetch data
    updateFetchTriggers(type);
  };


  // Fetch data for each graph on loading the page. Should also return the filter's options 
  useFetchSales('/', !triggers.histogram, options.histogram)
  useFetchSales('/', !triggers.products, options.products)
  useFetchSales('/', !triggers.totalProducts, options.totalProducts)
  useFetchSales('/', !triggers.bricks, options.bricks)


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
            {/* <div id='data-import'> */}
              <p className="table-title">Histórico De Vendas</p>

              {state.isAdmin && 
                <div style={{ marginBottom: '1rem' }}>
                  <Form
                    name="histogram"
                    onFinish={onFinish("histogram")}
                    layout="vertical"
                    initialValues={selectedOption.histogram}
                    form={form_histogram}
                  >
                    <div className="costum-form" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '40%' }}>
                      <Form.Item className="large-select" label='Ano' name='Year_H'>
                        <Select 
                          placeholder="Ano"                        
                          options={filters.histogram.years}
                          onChange={() => form_histogram.submit()}
                          showSearch
                          filterOption={(input, option) => 
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                      </Form.Item>

                      <Form.Item className="large-select" label='Delegado' name='Delegate_H'>
                        <Select                         
                          placeholder="Delegado"
                          options={filters.histogram.delegates}
                          onChange={() => form_histogram.submit()} 
                          showSearch
                          filterOption={(input, option) => 
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                      </Form.Item>
                    </div>
                  </Form>
                </div>
              }
            {/* </div> */}
            <DemoColumn dataHistogram={data.histogram} />
          </div>

          <ConfigProvider theme={themeConfig}>  
            <div className='dashboard-card'>
              <p className="table-title">Consulta por Produto</p>

              <div style={{ marginBottom: '1rem' }}>
                <Form
                  name="table_product"
                  onFinish={onFinish("products")}
                  layout="vertical"
                  initialValues={selectedOption.products}
                  form={form_table_product}
                >
                  <div className="costum-form" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: state.isAdmin ? '100%' : '60%' }}>
                    {state.isAdmin && 
                      <Form.Item className="large-select" label='Ano' name='Year_P'>
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
                      <Form.Item className="large-select" label='Delegado' name='Delegate_P'>
                        <Select                       
                          placeholder="Delegado"
                          options={filters.products.delegates} 
                          onChange={() => form_table_product.submit()}
                          showSearch
                          filterOption={(input, option) => 
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                      </Form.Item>
                    }
                    
                    <Form.Item className="large-select" label='Empresa' name='Company_P'>
                      <Select                     
                        placeholder="Empresa"
                        options={filters.products.companies} 
                        onChange={() => form_table_product.submit()}
                        showSearch
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>

                    <Form.Item className="large-select" label='Brick' name='Brick_P'>
                      <Select                     
                        placeholder="Brick"
                        options={filters.products.bricks} 
                        onChange={() => form_table_product.submit()}
                        showSearch
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>

                    <Form.Item className="large-select" label='Produto' name='Product_P'>
                      <Select                     
                        placeholder="Product"
                        options={filters.products.products} 
                        onChange={() => form_table_product.submit()}
                        showSearch
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  </div>
                </Form>
              </div>

              <Table 
                columns={columns_produto}
                dataSource={data.products}
                scroll={{x: 'max-content'}}
                pagination={{ pageSize: 7, showSizeChanger: false }}
                showSorterTooltip={false}                             
              />
            </div>

            {state.isAdmin && <div className='dashboard-card'>
              <p className="table-title">Consulta Total por Produto</p>
              
              <div style={{ marginBottom:'1rem' }}>
                <Form
                  name="table_brick"
                  onFinish={onFinish("totalProducts")}
                  layout="vertical"
                  initialValues={selectedOption.totalProducts}
                  form={form_table_total}
                >
                  <div className="costum-form" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem',  width: '80%' }}>
                    <Form.Item className="large-select" label='Delegado' name='Delegate_TP'>
                      <Select                       
                        placeholder="Delegado"
                        options={filters.totalProducts.delegates}
                        onChange={() => form_table_total.submit()}
                        showSearch
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  
                    <Form.Item className="large-select" label='Empresa' name='Company_TP'> 
                      <Select                       
                        placeholder="Empresa"
                        options={filters.totalProducts.companies} 
                        onChange={() => form_table_total.submit()}
                        showSearch
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>                

                    <Form.Item className="large-select" label='Brick' name='Brick_TP'> 
                      <Select                     
                        placeholder="Brick"
                        options={filters.totalProducts.bricks} 
                        onChange={() => form_table_total.submit()}
                        showSearch
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>

                    <Form.Item className="large-select" label='Produto' name='Product_TP'> 
                      <Select                     
                        placeholder="Product"
                        options={filters.totalProducts.products} 
                        onChange={() => form_table_total.submit()}
                        showSearch
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  </div>
                </Form>
              </div>

              <Table
                columns={columns_produto_total}
                dataSource={data.totalProducts}
                scroll={{x: 'max-content'}}
                pagination={{ pageSize: 7, showSizeChanger: false }}
                showSorterTooltip={false}                             
              />
            </div>}

            <div className='dashboard-card'>
              <p className="table-title">Consulta por Brick</p>

              <div style={{ marginBottom:'1rem' }}>
                <Form
                  name="table_total"
                  onFinish={onFinish("bricks")}
                  layout="vertical"
                  initialValues={selectedOption.bricks}
                  form={form_table_brick}
                >
                  <div className="costum-form" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: state.isAdmin ? '60%' : '40%' }}>
                    {state.isAdmin && 
                      <Form.Item className="large-select" label='Ano' name='Year_B'>
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
                      <Form.Item className="large-select" label='Delegado' name='Delegate_B'> 
                        <Select                       
                          placeholder="Delegado"
                          options={filters.bricks.delegates} 
                          onChange={() => form_table_brick.submit()}
                          showSearch
                          filterOption={(input, option) => 
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                      </Form.Item>
                    }

                    <Form.Item className="large-select" label='Empresa' name='Company_B'> 
                      <Select                     
                        placeholder="Empresa"
                        options={filters.bricks.companies} 
                        onChange={() => form_table_brick.submit()}
                        showSearch
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>

                    <Form.Item className="large-select" label='Brick' name='Brick_B'> 
                      <Select                     
                        placeholder="Brick"
                        options={filters.bricks.brick} 
                        onChange={() => form_table_brick.submit()}
                        showSearch
                        filterOption={(input, option) => 
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                    </Form.Item>
                  </div>
                </Form>
              </div>

              <Table
                columns={columns_brick}
                dataSource={data.bricks}
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
