import { useState, useEffect } from 'react';
import axios from 'axios';

import { useAuth } from '../context/Auth';


export function useFetchUser(path) {    
    const { state } = useAuth()
    
    const [data, setData] = useState({});   
    const [loading, setLoading] = useState(true);                                           

    // Send the user's id if the role is not admin
    const url = state.isAdmin ? process.env.REACT_APP_API_PATH + path : process.env.REACT_APP_API_PATH + path + `${state.userID}`

    // Load the table's content and update it when necessary
    useEffect (() => {
        let isMounted = true

        // Fetch data from the backend
        const fetchData = async () => {
            try {
                const response = await axios.get(url, { headers: { 'Content-Type': 'application/json' } });

                if (response.status === 200){
                    console.log('Data loaded successfully:', response.data);
                    setData(response.data)
                } else {
                    console.error('Data loaded failed:', response.status);
                }
            } catch (error) {
                console.error('Error loading data :', error);
            } finally {
                setLoading(false);
            }
        }

        if (isMounted) fetchData();

        return () => {
            isMounted = false;
        };

    }, [url]);

    return { data, loading }
}