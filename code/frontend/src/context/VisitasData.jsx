import { create } from 'zustand'
import dayjs from 'dayjs';

  
const useVisitasDataStore = create((set) => ({
    trigger: false,

    data: [],
    
    filters: {
        date: [],
        entities: [], 
        districts: [],
        regions: []
    },

    selectedOption: {
        date: dayjs().format('DD-MM-YYYY'),
        comprador : '-- Todos --',
        distrito: '-- Todos --',
        regiao: '-- Todos --'
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
            compradores: [], 
            distritos: [],
            regioes: []
        },
        selectedOption: {
            date: dayjs().format('DD-MM-YYYY'),
            comprador: '-- Todos --',
            distrito: '-- Todos --',
            regiao: '-- Todos --'
        }                   
      }),
}))

export default useVisitasDataStore
