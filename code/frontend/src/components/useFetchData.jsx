import { useState, useEffect } from 'react';
import axios from 'axios';

import { useAuth } from '../context/Auth';
import useDelegatesDataStore from '../context/DelegadosData';
import useMedicosDataStore from '../context/MedicosData';
import useFarmaciasDataStore from '../context/FarmaciasData';
import useVisitasDataStore from '../context/VisitasData';

export function useFetchData(path, fetchTrigger, selectedOption) {                                     
    const [data, setData] = useState([]);                                              
    const [filters, setFilters] = useState({});                                              
    const [loading, setLoading] = useState(true);
    const { state } = useAuth()
    //const updateFetchTrigger = useDelegatesDataStore((state) => state.updateFetchTrigger)
    const { updateDelegatesFetchTrigger, updateDelegatesFiltersData, updateDelegatesData} = useDelegatesDataStore();
    const { updateMedicosFetchTrigger, updateMedicosFiltersData, updateMedicosData} = useMedicosDataStore();
    const { updateFarmaciasFetchTrigger, updateFarmaciasFiltersData, updateFarmaciasData} = useFarmaciasDataStore();
    const { updateVisitasFetchTrigger, updateVisitasFiltersData, updateVisitasData} = useVisitasDataStore();
    
    // Send the user's id if the role is not admin
    const url = state.isAdmin ? process.env.REACT_APP_API_PATH + path : process.env.REACT_APP_API_PATH + path + `/${state.userID}`

    // Load the table's content and update it when necessary
    useEffect (() => {

        if (!fetchTrigger) return 

        let isMounted = true

        // Fetch data from the backend
        const fetchData = async () => {
            try {
                const response = await axios.post(url, selectedOption, { headers: { 'Content-Type': 'application/json' } });

                if (response.status === 200){
                    console.log('Data loaded successfully:', response.data);
                    //setData(response.data)
                    if(path === '/delegados'){
                        updateDelegatesFetchTrigger()
                        // updateDelegatesFiltersData()
                        // updateDelegatesData()
                    } else if (path ==='/medicos'){
                        updateMedicosFetchTrigger()
                        //updateMedicosFiltersData()
                        //updateMedicosData()
                    } else if (path === '/farmacias'){
                        updateFarmaciasFetchTrigger()
                        // updateFarmaciasFiltersData()
                        // updateFarmaciasData()
                    } else if (path === '/visitas'){
                        updateVisitasFetchTrigger()
                        // updateVisitasFiltersData()
                        // updateVisitasData()
                    }
                } else {
                    console.error('Data loaded failed:', response.status);
                }
            } catch (error) {
                console.error('Error loading data :', error);
                if(path==='/delegados'){
                    updateDelegatesFetchTrigger()
                    //updateDelegatesData()
                    //updateDelegatesFiltersData()
                } else if (path ==='/medicos'){
                    updateMedicosFetchTrigger()
                    //updateMedicosFiltersData()
                    //updateMedicosData()
                } else if (path==='/farmacias'){
                    updateFarmaciasFetchTrigger()
                    // updateFarmaciasFiltersData()
                    // updateFarmaciasData()
                } else if (path==='/visitas'){
                    updateVisitasFetchTrigger()
                    // updateVisitasFiltersData()
                    // updateVisitasData()
                }
            } finally {setLoading(false)}
        }

        console.log("Should Fetch Data: ", fetchTrigger)
        
        // Fetch data if there's no data or if there's a trigger (update, for example)
        // if (isMounted && (!data.lenght || fetchTrigger)) fetchData();
        if (isMounted && fetchTrigger) fetchData();

        return () => {
            isMounted = false;
        };
    }, [fetchTrigger, url]);

    return {loading}
}