import { getFormattedDate } from '../components/utils';

function Chatbot() {
    const date = getFormattedDate();
    return (
        <div id="contact">
            <div>
            <h1>Chatbot</h1>
            <div id="data-import">
                {date}
            </div>
            </div>
            <div style={{padding: '1rem'}}>
                {/* Ponham aqui o código */}
            </div>
        </div>
    );
  }
  
  export default Chatbot;