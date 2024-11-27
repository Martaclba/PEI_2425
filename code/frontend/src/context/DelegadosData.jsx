import { create } from 'zustand'

  
const useDelegatesDataStore = create((set) => ({
    trigger: false,

    data: [],
    
    filters: {
        delegates: [], 
        districts: [],
        regions: []
    },

    selectedOption: {
        delegado: 'Todos',
        distrito: 'Todos',
        regiao: 'Todos'
    },

    updateDelegatesFetchTrigger: () => {
        set((state) => ({
                trigger: !state.trigger                        
        }));
    },

    updateDelegatesFiltersData: (filters) => {
        console.log("AQUI",filters)
        set(() => ({
            filters: filters,
        }))
    },
        
    updateDelegatesData: (data) => {
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
            delegates: [], 
            distritos: [],
            regioes: []
        },
        selectedOption: {
            delegado: 'Todos',
            distrito: 'Todos',
            regiao: 'Todos'
        }                   
      }),
}))

export default useDelegatesDataStore
