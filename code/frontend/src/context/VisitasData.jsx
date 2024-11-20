import { create } from 'zustand'

// TODO: REMOVER ESTES DEFAULTSSSSSSSSSSSSSSSSSSSSSSSS

const compradores_default = [
    { label: 'Todos', value: 'Todos'},
    { label: "Rui Correia", value: 0 },
    { label: "André Barros", value: 1 },
    { label: "Matilde Santos", value: 2 }
]

const distritos_default = [    
    { label: 'MyPharma', value: 0 },
    { label: 'Pharma1000', value: 1 },
    { label: 'Empresa 3', value: 2 }
] 

const regioes_default = [
    { label: 'Todos', value: 'Todos'},
    { label: "regis 0", value: 0 },
    { label: "regis 1", value: 1 },
    { label: "regis 2", value: 2 }
]
  
const useVisitasDataStore = create((set) => ({
    trigger: false,

    data: [],
    
    filters: {
        compradores: compradores_default, 
        distritos: distritos_default,
        regioes: regioes_default
    },

    // Store filters form's values to be able to pass them to the fetch hook
    selectedOption: {
        date: '',
        comprador : 'Todos',
        distrito: 'Todos',
        regiao: 'Todos'
    },

    updateVisitasFetchTrigger: () => {
        set((state) => ({
                trigger: !state.trigger                     // Single trigger update     
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
            compradores: compradores_default, 
            distritos: distritos_default,
            regioes: regioes_default
        },
        selectedOption: {
            date:'',
            comprador: 'Todos',
            distrito: 'Todos',
            regiao: 'Todos'
        }                   
      }),
}))

export default useVisitasDataStore
