import { create } from 'zustand'
import dayjs from 'dayjs';

  
const useVisitasDataStore = create((set) => ({
    trigger: false,

    data: [],
    
    filters: {
        date: [],
        entities: [], 
    },

    selectedOption: {
        date: dayjs().format('DD-MM-YYYY'),
        comprador : '-- Todos --',
    },

    updateVisitasFetchTrigger: () => {
        set((state) => ({
                trigger: !state.trigger                      
        }));
    },

    updateVisitasFiltersData: (filters) =>
        set(() => ({
            filters: filters,
        })),

    updateVisitasData: (data) => {
        set(() => ({
            data: data,
        }))
    },

    updateSelectedOption: (option) => {
        set(() => ({
            selectedOption: option,
        }));
    },

    reset: () => set({
        triggers: false,
        
        data: [],

        filters: {
            date: [],
            entities: []
        },

        selectedOption: {
            date: dayjs().format('DD-MM-YYYY'),
            comprador: '-- Todos --',
        }                   
      }),
}))

export default useVisitasDataStore
