import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [messages, setMessages] = useState([]); // guarda as mensagens do chat
    const [input, setInput] = useState(''); 

    const sendMessageToChatbot = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input }; 
        setMessages((prev) => [...prev, userMessage]); 
        setInput(''); 

        try {
            
            const response = await axios.post('http://localhost:3001/', { message: input });
            
            // Mensagem do chatbot
            const botMessage = { sender: 'bot', text: response.data.response };
            setMessages((prev) => [...prev, botMessage]); 
        } catch (error) {
            console.error('Erro ao conectar ao backend:', error);
            const errorMessage = { sender: 'bot', text: 'Erro: não foi possível obter resposta do servidor.' };
            setMessages((prev) => [...prev, errorMessage]); 
        }
    };

    return (
        <div style={styles.chatContainer}>
        <h1>Chatbot</h1>
        <div style={styles.messagesContainer}>
            {messages.map((msg, index) => (
                <div
                    key={index}
                    style={{
                        display: 'flex', // Garante alinhamento flexível
                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    }}
                >
                    <span
                        style={{
                            ...styles.message,
                            backgroundColor: msg.sender === 'user' ? '#007BFF' : '#e0e0e0',
                            color: msg.sender === 'user' ? '#fff' : '#000',
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        }}
                    >
                        {msg.text}
                    </span>
                </div>
            ))}
        </div>
        <div style={styles.inputContainer}>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessageToChatbot()}
                style={styles.input}
            />
            <button onClick={sendMessageToChatbot} style={styles.sendButton}>
                Enviar
            </button>
        </div>
    </div>
    
    );
};


const styles = {
    chatContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '1000px',
        height: '700px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
    },
    messagesContainer: {
        flex: 1,
        padding: '10px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backgroundColor: '#f5f5f5',
        maxWidth: '100%', 
    },
    message: {
        padding: '10px 15px',
        borderRadius: '20px',
        maxWidth: '70%',
        wordWrap: 'break-word', // Permite quebra em palavras longas
        wordBreak: 'break-word', // Força quebra se necessário
        whiteSpace: 'pre-wrap', // Preserva quebras de linha
    },
    inputContainer: {
        display: 'flex',
        borderTop: '1px solid #ccc',
        padding: '10px',
    },
    input: {
        flex: 1,
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '20px',
        marginRight: '10px',
        fontSize: '16px',
    },
    sendButton: {
        padding: '10px 20px',
        backgroundColor: '#0084ff',
        color: '#fff',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default Chatbot;
