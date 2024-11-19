import { useState, useEffect } from 'react';
import axios from 'axios';

// Predefined data
const delegate = {
    Nome: {
        Primeiro: 'John',
        Ultimo: 'Doe',
    },
    Distrito: 'Porto',
    Regiao: 'Trofa',
    Freguesia: 'Lousado',                        // Not required
    Estado: ['Ativo'],
};

const doctor = {
    Nome: 'John',
    Instituicao: 'Hospital do Bonfim',
    Especialidade: 'Pediatra',
    Distrito: 'Braga',
    Regiao: 'Braga',
    Freguesia: '',                               // Not required
    Rua: 'Rua bla bla bla',
    Codigo_postal: '1234-567',
    Edificio: '1º Esq',                          // Not required
    Telefone: '123456789',
    Email: 'example@hotmail.com',                // Not required
    Estado: ['Inativo'],
    Notas: 'Some default notes here...',         // Not required
};

 // Predefined data
 const pharmacy = {
    Nome: 'Farmácia A',
    Distrito: 'Braga',
    Regiao: 'Celeirós',
    Freguesia: 'Celeirós',                        // Not required                                  
    Rua: 'Rua bla bla bla',
    Codigo_postal: '1234-567',
    Edificio: '1º Esq',                           // Not required
    Telefone: '123456789',                         
    Email: 'example@hotmail.com',                 // Not required
    Estado: ['Indisponível'],
    Notas: '',                                    // Not required             
    Produtos: [{ key: '1', label: 'Produto 1' }]  // Not required 
};

export function useFetchUser(path, type) {                                     
    const [data, setData] = useState([]);   
    const [loading, setLoading] = useState(true);                                           

    // Load the table's content and update it when necessary
    useEffect (() => {
        let isMounted = true

        // Fetch data from the backend
        const fetchData = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_PATH + path);

                if (response.status === 200){
                    console.log('Data loaded successfully:', response.data);
                    // setData(response.data)
                } else {
                    console.error('Data loaded failed:', response.status);
                }
            } catch (error) {
                console.error('Error loading data :', error);
                // Depois posso remover o type eu acho
                if (type === 'delegate') setData(delegate)
                else if (type === 'doctor') setData(doctor)
                else if (type === 'pharmacy') setData(pharmacy)
            } finally {
                setLoading(false);
            }
        }

        if (isMounted) fetchData();

        return () => {
            isMounted = false;
        };

    }, [path, type]);

    return { data, loading }
}