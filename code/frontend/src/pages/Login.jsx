import React from 'react';
import { Button, Form, Input, ConfigProvider } from 'antd';
import { IoPersonOutline } from "react-icons/io5";
import { IoLockClosedOutline } from "react-icons/io5";

const onFinish = (values) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const Login = () => (
  <div style={{ height: "100%",
    width: "100%", 
    display: "flex", 
    justifyContent: "center",
    alignItems: "center"}} >
  <Form
    name="basic"
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: '100%',
      width: '35%',
    }}
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <div>
        <img src="../../mypharma-logo.png" alt=""
        style={{ width: '100%', height: '100%', borderRadius: '8px',marginBottom:"3rem",color:'#242424' }} />
      </div>
      
    <Form.Item
      name="username"
      rules={[
        {
          required: true,
          message: 'Por favor insira um email',
        },
      ]}
    >
      <Input placeholder='Email'prefix={<IoPersonOutline style={{color: '#000000',opacity: 0.4, marginInlineEnd: '10px'}}/>}/>
    </Form.Item>

    <Form.Item
      name="password"
      rules={[
        {
          required: true,
          message: 'Por favor insira uma password',
        },
      ]}
    >
      <Input.Password placeholder='Password'prefix={<IoLockClosedOutline  style={{color: '#000000',opacity: 0.4, marginInlineEnd: '10px'}}/>}/>
    </Form.Item>
   
    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
       <ConfigProvider 
        theme={{
          "components": {
            "Button": {
              "colorPrimaryHover": "rgba(36,36,36,0.8)",
              "colorPrimary": "rgb(36,36,36)",
              "colorPrimaryActive": "rgb(20,20,20)",
            }
          }
      }}>
        <Button type="primary" htmlType="submit" style={{width:'100%'}}>
          Login
        </Button>
      </ConfigProvider>
    </Form.Item>
  </Form>
  </div>
);
export default Login;