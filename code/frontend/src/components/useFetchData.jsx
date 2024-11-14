import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/Auth';

export function useFetchData(path, fetchTrigger) {                                     
    const [data, setData] = useState([]);                                              
    const { state } = useAuth()
 
    // Send the user's id if the role is not admin
    const url = state.isAdmin ? process.env.REACT_APP_API_PATH + path : process.env.REACT_APP_API_PATH + path + `/${state.userID}`

    // Load the table's content and update it when necessary
    useEffect (() => {

        if (!fetchTrigger) return 

        let isMounted = true

        // Fetch data from the backend
        const fetchData = async () => {
            try {
                const response = await axios.get(url);

                if (response.status === 200){
                    console.log('Data loaded successfully:', response.data);
                    setData(response.data)
                    //setFilters(response.data.filters)
                } else {
                    console.error('Data loaded failed:', response.status);
                }
            } catch (error) {
                console.error('Error loading data :', error);
            }
        }

        console.log("Should Fetch Data: ", fetchTrigger)
        
        // Fetch data if there's no data or if there's a trigger (update, for example)
        // if (isMounted && (!data.lenght || fetchTrigger)) fetchData();
        if (isMounted && fetchTrigger) fetchData();

        return () => {
            isMounted = false;
        };
    }, [fetchTrigger, url]);

    return data
}