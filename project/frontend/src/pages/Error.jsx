import { useRouteError } from "react-router-dom";
import { Button } from 'antd';
import { useNavigate } from "react-router-dom";

function Error() {
  const error = useRouteError();
  console.error(error);

  const navigate = useNavigate()

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p style={{textAlign: 'center', marginBottom: '5px'}}>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Button style={{marginTop: '15px'}} onClick={() => navigate("/")}>
        Página Inicial
      </Button>
    </div>
  );
}

export default Error;