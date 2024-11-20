import { useEffect } from 'react';
import axios from 'axios';

import { useAuth } from '../context/Auth';
import useSalesDataStore from '../context/SalesData';

/*

// This variable tells the backend wich filters we want for each graph. 
// Should return a list with every option for the selected form
options = {
    option_selected: { year: '2024', delegate: 'André Barros' }       (example; if {empty} fetch everything (default))
    type: (histogram/table_product/table_total_product/table_brick)   (to know what to put on "data")
    delegates: (true/false)
    years: (true/false)
    companies: (true/false)
    bricks: (true/false)
    products: (true/false)
}
    
*/

export function useFetchSales(path, fetchTrigger, options) {                                     
    const { state } = useAuth()

    const updateFetchTriggers = useSalesDataStore((state) => state.updateFetchTriggers)
    const updateSalesData = useSalesDataStore((state) => state.updateSalesData)
    const updateFiltersData = useSalesDataStore((state) => state.updateFiltersData)
 
    // Send the user's id if the role is not admin
    const url = state.isAdmin ? process.env.REACT_APP_API_PATH + path : process.env.REACT_APP_API_PATH + path + `${state.userID}`

    // Load the table's content and update it when necessary
    useEffect (() => {

        if (!fetchTrigger) return 

        let isMounted = true

        console.log("FILTERS NEEDED: ", options)

        // Fetch data from the backend
        const fetchData = async () => {
            try {
                const response = await axios.post(url, { options });

                if (response.status === 200){
                    console.log('Data loaded successfully:', response.data);
                    // updateSalesData(options.type, response.data[0])
                    // updateFiltersData(options.type, response.data[1])
                    updateFetchTriggers(options.type)

                } else {
                    console.error('Data loaded failed:', response.status);
                }
            } catch (error) {
                console.error('Error loading data :', error);
            }
        }

        // console.log("Should Fetch SALES: ", fetchTrigger)
        
        // Fetch data if there's no data or if there's a trigger (update, for example)
        // if (isMounted && (!data.lenght || fetchTrigger)) fetchData();
        if (isMounted && fetchTrigger) fetchData();

        return () => {
            isMounted = false;
        };
    }, [url, fetchTrigger, options, updateFetchTriggers, updateSalesData, updateFiltersData]);
}