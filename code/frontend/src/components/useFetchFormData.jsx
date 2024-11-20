import { useEffect } from 'react';
import axios from 'axios';

import useFormDataStore from '../context/FormData';
import { useAuth } from '../context/Auth';

const initialState = [{
    districts: [
        { label: 'Porto', value: 0 },
        { label: 'Braga', value: 1 },
        { label: 'Aveiro', value: 2 },
    ],

    regions: [
        { label: 'Trofa', value: 0 },
        { label: 'Faro', value: 1 },
        { label: 'Braga', value: 2 },
    ],

    towns: [
        { label: 'Ribeirão', value: 0 },
        { label: 'Panoias', value: 1 },
        { label: 'Lousado', value: 2 },
    ],

    instituitions: [
        { label: 'Hospital da Luz', value: 0 },
        { label: 'Hospital Trofa Saúde', value: 1 },
        { label: 'Hospital de Braga', value: 2 },
    ],

    specialties: [
        { label: 'Pediatra', value: 0 },
        { label: 'Cardiologista', value: 1  },
        { label: 'Ortopedista', value: 2 },
    ],  

    products: [
        { label: 'Produto 0', value: 0 },
        { label: 'Produto 1', value: 1  },
        { label: 'Produto 2', value: 2 },
    ],  
    
    doctors: [
        { label: 'Médico 0', value: 0 },
        { label: 'Médico 1', value: 1 },
        { label: 'Médico 2', value: 2 },
    ],  

    pharmacies: [
        { label: 'Farmácia 0', value: 0 },
        { label: 'Farmácia 1', value: 1 },
        { label: 'Farmácia 2', value: 2 },
    ],  
}];

export function useFetchFormData(fetchTrigger) {
    const { state } = useAuth()
    const updateData = useFormDataStore((state) => state.updateFormDataStore); 

    // Send the user's id if the role is not admin
    const url = state.isAdmin ? process.env.REACT_APP_API_PATH + '/forms' : process.env.REACT_APP_API_PATH + '/forms' + `/${state.userID}`

    // Load the table's content and update it when necessary
    useEffect (() => {
        let isMounted = true;

        // Fetch data from the backend
        const fetchData = async () => {
            try {
                const response = await axios.get(url);

                if (response.status === 200){
                    console.log('Data loaded successfully:', response.data);
                    updateData(response.data); 
                } else {
                    console.error('Data loaded failed:', response.status);
                }
            } catch (error) {
                console.error('Error loading data :', error);
                updateData(initialState);              // TODO: REMOVER DEPOIS
            }
        }
        
        // If the fetch condition isn't met, skip the fetch
        if (isMounted && (fetchTrigger)) fetchData();

        return () => {
            isMounted = false;
        };
    }, [fetchTrigger, updateData, url]);
}