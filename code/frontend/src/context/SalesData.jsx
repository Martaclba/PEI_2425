import { create } from 'zustand'

// TODO: REMOVER ESTES DEFAULTSSSSSSSSSSSSSSSSSSSSSSSS
const years_default = [
    { label: '2018', value: '2018' },
    { label: '2019', value: '2019' },
    { label: '2020', value: '2020' },
];

const delegates_default = [
    { label: "Rui Correia", value: "Rui Correia" },
    { label: "André Barros", value: "André Barros" },
    { label: "Matilde Santos", value: "Matilde Santos" }
]

const companies_default = [
    { label: 'MyPharme', value: 'MyPharma' },
    { label: 'Pharma1000', value: 'Pharma1000' },
    { label: 'Empresa 3', value: 'Empresa 3'}
] 

const bricks_default = [
    { label: "brick 0", value: "brick 0"},
    { label: "brick 1", value: "brick 1"},
    { label: "brick 2", value: "brick 2"}
]

const products_default = [
    { label: "product 0", value: "product 0" },
    { label: "product 1", value: "product 1" },
    { label: "product 2", value: "product 2" }
]



const useSalesDataStore = create((set) => ({
    triggers: {
        histogram: false,
        products: false, 
        totalProducts: false,
        bricks: false
    },

    data: {
        histogram: [],    
        products: [],
        totalProducts: [],
        bricks: [],
    },
    
    // podem vir vazios, não preciso do isAdmin
    filters: {
        histogram: { years: years_default, delegates: delegates_default },
        products: { years: years_default, delegates: delegates_default, companies: companies_default, bricks: bricks_default, products: products_default },
        totalProducts: { delegates: delegates_default, companies: companies_default, bricks: bricks_default, products: products_default },
        bricks: { years: years_default, delegates: delegates_default, companies: companies_default },
    },

    updateFetchTriggers: (type) => {
        set((state) => ({
            triggers: {
                ...state.triggers,
                histogram: Date.now(),
            },
        }))
    },

    updateFiltersData: (type, filters) =>
        set((state) => ({
            filters: {
                ...state.filters,
                [type]: { ...state.filters[type], ...filters },
            },
        })),

    updateSalesDataStore: (type, data) => {
        set((state) => ({
            data: {
                ...state.data,
                [type]: { ...state.data[type], ...data },
            },
        }))
    }
}))

export default useSalesDataStore
