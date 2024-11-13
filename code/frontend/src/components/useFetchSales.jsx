import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/Auth';

/*
options = {
    type: (histogram/table_product/table_total_product/table_brick)
    filterDelegates: (true/false)
    filterYears: (true/false)
    filterCompanies: (true/false)
    filterBricks: (true/false)
}
*/
export function useFetchSales(path, fetchTrigger, options) {                                     
    const [data, setData] = useState([]);                                              
    const [filters, setFilters] = useState([])
    const { state } = useAuth()
 
    // Send the user's id if the role is not admin
    const url = state.isAdmin ? process.env.REACT_APP_API_PATH + path : process.env.REACT_APP_API_PATH + path + `/${state.userID}`

    // Load the table's content and update it when necessary
    useEffect (() => {
        let isMounted = true

        console.log("FILTERS NEEDED: ", options)

        // Fetch data from the backend
        const fetchData = async () => {
            try {
                const response = await axios.get(url, { params: options });

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
        if (isMounted && (!data.lenght || fetchTrigger)) fetchData();

        return () => {
            isMounted = false;
        };
    }, [data.lenght, fetchTrigger, options, url]);

    return { data, filters }
}