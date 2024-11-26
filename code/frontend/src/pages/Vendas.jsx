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

  const nonZeroValues = dataHistogram
  .map(item => item.value)
  .filter(value => value !== 0);

  // Find the minimum and maximum values
  const minValue = Math.min(...nonZeroValues);
  const maxValue = Math.max(...dataHistogram.map(item => item.value));
  
  const config = {  
    data: dataHistogram,
    xField: 'month',
    yField: 'value',
    style:{
      fill: ({ value }) => {
        if (value === minValue) {
          return '#D94F4F'; 
        }
        if (value === maxValue) {
          return '#4FD967'; 
        }
        return '#4F8ED9'; 
      },
    },
    legend: false,
  };

  return <Column {...config} />;
};


const columns_produto = [
  {
    key: 'product_name',
    title: 'Produto',
    dataIndex: 'product_name',
    fixed: 'left',
    className: 'fixed-column',
    sorter: (a, b) => a.product_name.localeCompare(b.product_name)          
  },
  {
    key: 'jan',
    title: 'Jan',
    dataIndex: 'jan',
    sorter: (a, b) => a.jan - b.jan          
  },
  {
    key: 'feb',
    title: 'Fev',
    dataIndex: 'feb',
    sorter: (a, b) => a.feb - b.feb
  },
  {
    key: 'mar',
    title: 'Mar',
    dataIndex: 'mar',
    sorter: (a, b) => a.mar - b.mar
  },
  {
    key: 'apr',
    title: 'Abr',
    dataIndex: 'apr',
    sorter: (a, b) => a.apr - b.apr
  },
  {
    key: 'may',
    title: 'Mai',
    dataIndex: 'may',
    sorter: (a, b) => a.may - b.may
  },
  {
    key: 'jun',
    title: 'Jun',
    dataIndex: 'jun',
    sorter: (a, b) => a.jun - b.jun
  },
  {
    key: 'jul',
    title: 'Jul',
    dataIndex: 'jul',
    sorter: (a, b) => a.jul - b.jul
  },
  {
    key: 'aug',
    title: 'Ago',
    dataIndex: 'aug',
    sorter: (a, b) => a.aug - b.aug
  },
  {
    key: 'sep',
    title: 'Set',
    dataIndex: 'sep',
    sorter: (a, b) => a.sep - b.sep
  },
  {
    key: 'oct',
    title: 'Out',
    dataIndex: 'oct',
    sorter: (a, b) => a.oct - b.oct
  },
  {
    key: 'nov',
    title: 'Nov',
    dataIndex: 'nov',
    sorter: (a, b) => a.nov - b.nov
  },
  {
    key: 'dec',
    title: 'Dez',
    dataIndex: 'dec',
    sorter: (a, b) => a.dec - b.dec
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
    sorter: (a, b) => a.brick - b.brick          
  },
  {
    key: 'jan',
    title: 'Jan',
    dataIndex: 'jan',
    sorter: (a, b) => a.jan - b.jan          
  },
  {
    key: 'feb',
    title: 'Fev',
    dataIndex: 'feb',
    sorter: (a, b) => a.feb - b.feb
  },
  {
    key: 'mar',
    title: 'Mar',
    dataIndex: 'mar',
    sorter: (a, b) => a.mar - b.mar
  },
  {
    key: 'apr',
    title: 'Abr',
    dataIndex: 'apr',
    sorter: (a, b) => a.apr - b.apr
  },
  {
    key: 'may',
    title: 'Mai',
    dataIndex: 'may',
    sorter: (a, b) => a.may - b.may
  },
  {
    key: 'jun',
    title: 'Jun',
    dataIndex: 'jun',
    sorter: (a, b) => a.jun - b.jun
  },
  {
    key: 'jul',
    title: 'Jul',
    dataIndex: 'jul',
    sorter: (a, b) => a.jul - b.jul
  },
  {
    key: 'aug',
    title: 'Ago',
    dataIndex: 'aug',
    sorter: (a, b) => a.aug - b.aug
  },
  {
    key: 'sep',
    title: 'Set',
    dataIndex: 'sep',
    sorter: (a, b) => a.sep - b.sep
  },
  {
    key: 'oct',
    title: 'Out',
    dataIndex: 'oct',
    sorter: (a, b) => a.oct - b.oct
  },
  {
    key: 'nov',
    title: 'Nov',
    dataIndex: 'nov',
    sorter: (a, b) => a.nov - b.nov
  },
  {
    key: 'dec',
    title: 'Dez',
    dataIndex: 'dec',
    sorter: (a, b) => a.dec - b.dec
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
                        options={filters.bricks.bricks} 
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
