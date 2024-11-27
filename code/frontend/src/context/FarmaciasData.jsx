import { create } from 'zustand'

  
const useFarmaciasDataStore = create((set) => ({
    trigger: false,

    data: [],
    
    filters: {
        pharmacies: [], 
        districts: [],
        regions: []
    },

    selectedOption: {
        farmacia: '-- Todos --',
        distrito: '-- Todos --',
        regiao: '-- Todos --'
    },

    updateFarmaciasFetchTrigger: () => {
        set((state) => ({
                trigger: !state.trigger                          
        }));
    },

    updateFarmaciasFiltersData: (filters) =>
        set(() => ({
            filters: filters,
        })),

    updateFarmaciasData: (data) => {
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
            pharmacies: [], 
            districts: [],
            regions: []
        },
        selectedOption: {
            farmacia: '-- Todos --',
            distrito: '-- Todos --',
            regiao: '-- Todos --'
        }                   
      }),
}))

export default useFarmaciasDataStore
