import { IoAddCircleOutline, IoPersonOutline } from "react-icons/io5";
import { Dropdown, message, Space } from 'antd';
import { HiOutlineUpload } from "react-icons/hi";

const onClick = ({ key }) => {
  if (key == 1)
    message.info(`Redirecionar para a página de Registo Individual`);
  else
    message.info(`Importar um ficheiro com o Registo por Ficheiro`);
};

const items = [
  {
    key: '1',
    label: 'Registo Individual',
    icon: <IoPersonOutline />
  },
  {
    key: '2',
    label: 'Registo por Ficheiro',
    icon: <HiOutlineUpload />
  },
];


function Delegados() {  
  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
  const date = currentDate.toLocaleDateString('pt-BR', options);

  return (
    <div id="contact">
      <div>
        <h1>Consultar Delegados</h1>

        <div id="data-import">
          {date}

          <Dropdown menu={{items,onClick,}}>
              <Space>
                <IoAddCircleOutline onClick={(e) => e.preventDefault()}/>
              </Space>
          </Dropdown>
        </div>
      </div>

    </div>
  );
}

export default Delegados