import { useEffect } from 'react';
import axios from 'axios';

import useFormDataStore from '../context/FormData';

const initialState = [{
    districts: [
        {
            value: 'Porto',
        },
        {
            value: 'Braga',
        },
        {
            value: 'Aveiro',
        },
    ],
    hmr_regions: [
        {
            value: 'Trofa',
        },
        {
            value: 'Faro',
        },
        {
            value: 'Braga',
        },
    ],
    parishes: [
        {
            value: 'Ribeirão',
        },
        {
            value: 'Panoias',
        },
        {
            value: 'Lousado',
        },
    ],
    instituitions: [
        {
            value: 'Hospital da Luz',
        },
        {
            value: 'Hospital Trofa Saúde',
        },
        {
            value: 'Hospital de Braga',
        },
    ],
    specialties: [
        {
            value: 'Pediatra',
        },
        {
            value: 'Cardiologista',
        },
        {
            value: 'Ortopedista',
        },
    ],  
}];

export function useFetchFormData(fetchTrigger) {
    const updateData = useFormDataStore((state) => state.updateFormDataStore); 

    // Load the table's content and update it when necessary
    useEffect (() => {
        let isMounted = true;

        // Fetch data from the backend
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/forms");

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

        console.log("Should Fetch Form Data: ", fetchTrigger)
        
        // If the fetch condition isn't met, skip the fetch
        if (isMounted && (fetchTrigger)) fetchData();

        return () => {
            isMounted = false;
        };
    }, [fetchTrigger, updateData]);
}