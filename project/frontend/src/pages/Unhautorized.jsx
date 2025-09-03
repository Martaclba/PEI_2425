import { Button } from 'antd';
import { useNavigate } from "react-router-dom";

function Unhautorized() {
  const navigate = useNavigate()

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p style={{textAlign: 'center', marginBottom: '5px'}}>Desculpa, não tens permissão para aceder a esta página.</p>
    
      <Button style={{marginTop: '15px'}} onClick={() => navigate(-1)}>
        Voltar
      </Button>
    </div>
  );
}

export default Unhautorized;