import { useState, useEffect } from 'react';
import axios from 'axios';

export function useFetchData(path, fetchTrigger) {                                     // -----------------------> provavelmente iremos renomear depois para fazer o fetch dos users apenas; 
    const [data, setData] = useState([]);                                              // -----------------------> passar o tipo de user

    // Load the table's content and update it when necessary
    useEffect (() => {
        let isMounted = true;

        // Fetch data from the backend
        const fetchData = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_PATH + path);

                if (response.status === 200){
                    console.log('Data loaded successfully:', response.data);
                    setData(response.data)
                } else {
                    console.error('Data loaded failed:', response.status);
                }
            } catch (error) {
                console.error('Error loading data :', error);
            }
        }

        console.log("Should Fetch Data: ", fetchTrigger)
        
        // Fetch data if there's no data or if there's a trigger (update, for example)
        if (isMounted && (!data.lenght || fetchTrigger)) fetchData();

        return () => {
            isMounted = false;
        };
    }, [path, fetchTrigger, data.lenght]);

    return data
}