import React from 'react';
import { Button, Form, Input, ConfigProvider, message } from 'antd';
import { IoPersonOutline } from "react-icons/io5";
import { IoLockClosedOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/Auth';

const configTheme = {
  "components": {
    "Button": {
      "colorPrimaryHover": "rgba(36,36,36,0.8)",
      "colorPrimary": "rgb(36,36,36)",
      "colorPrimaryActive": "rgb(20,20,20)",
    }
  }
}

const Login = () => {
  const { login } = useAuth(); 
  const navigate = useNavigate(); // For redirecting after login

  const onFinish = (values) => {
    const {email, password} = values

    console.log(values)

    // Simulate authentication process
    if (email === "admin" && password === "admin") {
      login(email, password, 'admin'); 
      navigate('/');
    } else if (email === "user" && password === "user") {
      login(email, password, 'user');
      navigate('/');
    } else {
      message.error("Credenciais Inválidas");
    }
  }

  return (
    <div style={{ height: "100%",
      width: "100%", 
      display: "flex", 
      justifyContent: "center",
      alignItems: "center"}} >
      
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: '100%', width: '35%' }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <div>
          <img src="../../mypharma-logo.png" alt="" style={{ width: '100%', height: '100%', borderRadius: '8px',marginBottom:"3rem",color:'#242424' }} />
        </div>
          
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Por favor insira um email',
            },
          ]}
        >
          <Input 
            placeholder='Email'
            prefix={<IoPersonOutline style={{color: '#000000',opacity: 0.4, marginInlineEnd: '10px'}}/>}
          />
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
          <Input.Password 
            placeholder='Password'
            prefix={<IoLockClosedOutline  style={{color: '#000000',opacity: 0.4, marginInlineEnd: '10px'}}/>}
          />
        </Form.Item>
      
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <ConfigProvider theme={configTheme}>
            <Button type="primary" htmlType="submit" style={{width:'100%'}}>
              Login
            </Button>
          </ConfigProvider>
        </Form.Item>
      </Form>
    </div>
  )
};

export default Login;