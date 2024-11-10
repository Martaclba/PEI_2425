import { useState, useEffect } from 'react';
import axios from 'axios';

export function useFetchData(path, fetchTrigger) {
    const [data, setData] = useState([]);

    // Load the table's content and update it when necessary
    useEffect (() => {
        let isMounted = true;

        // Fetch data from the backend
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:5000" + path);

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
        
        // If the fetch condition isn't met, skip the fetch
        // if (isMounted && (!data.lenght || fetchTrigger)) fetchData();
        if (isMounted && (fetchTrigger)) fetchData();

        return () => {
            isMounted = false;
        };
    }, [path, fetchTrigger, data.lenght]);

    return data
}