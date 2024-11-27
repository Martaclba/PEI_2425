import { create } from 'zustand'

  
const useMedicosDataStore = create((set) => ({
    trigger: false,

    data: [],
    
    filters: {
        doctors: [], 
        districts: [],
        institutions: []
    },

    selectedOption: {
        medico: '-- Todos --',
        distrito: '-- Todos --',
        instituicao: '-- Todos --'
    },

    updateMedicosFetchTrigger: () => {
        set((state) => ({
                trigger: !state.trigger                          
        }));
    },

    updateMedicosFiltersData: (filters) =>
        set(() => ({
            filters: filters,
        })),

    updateMedicosData: (data) => {
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
            doctors: [], 
            districts: [],
            institutions: []
        },
        selectedOption: {
            medico: '-- Todos --',
            distrito: '-- Todos --',
            instituicao: '-- Todos --'
        }                   
      }),
}))

export default useMedicosDataStore
