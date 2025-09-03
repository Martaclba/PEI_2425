import { useEffect } from 'react';
import axios from 'axios';

import useFormDataStore from '../context/FormData';
import { useAuth } from '../context/Auth';


export function useFetchFormData(fetchTrigger) {
    const { state } = useAuth()
    const updateData = useFormDataStore((state) => state.updateFormDataStore); 

    // Send the user's id if the role is not admin
    const url = state.isAdmin ? process.env.REACT_APP_API_PATH + '/forms' : process.env.REACT_APP_API_PATH + `/forms/${state.userID}`

    // Load the table's content and update it when necessary
    useEffect (() => {
        let isMounted = true;

        // Fetch data from the backend
        const fetchData = async () => {
            try {
                const response = await axios.get(url, { headers: { 'Content-Type': 'application/json' } });

                if (response.status === 200){
                    console.log('Data loaded successfully:', response.data.data);

                    // Normalize all values to strings
                    const normalizedData = Object.keys(response.data.data).reduce((acc, key) => {
                        acc[key] = response.data.data[key].map(item => ({
                            ...item,
                            value: item.value.toString(),
                        }));
                        return acc;
                    }, {});
                        
                    updateData(normalizedData); 
                } else {
                    console.error('Data loaded failed:', response.status);
                }
            } catch (error) {
                console.error('Error loading data :', error);
            }
        }
        
        // If the fetch condition isn't met, skip the fetch
        if (isMounted && (fetchTrigger)) fetchData();

        return () => {
            isMounted = false;
        };
    }, [fetchTrigger, updateData, url]);
}