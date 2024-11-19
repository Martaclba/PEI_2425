import { create } from 'zustand'

// TODO: REMOVER ESTES DEFAULTSSSSSSSSSSSSSSSSSSSSSSSS
const years_default = [
    { label: '2018', value: 2018 },
    { label: '2019', value: 2019 },
    { label: '2020', value: 2020 },
];

const delegates_default = [
    { label: 'Todos', value: 'Todos'},
    { label: "Rui Correia", value: 0 },
    { label: "André Barros", value: 1 },
    { label: "Matilde Santos", value: 2 }
]

const companies_default = [    
    { label: 'MyPharma', value: 0 },
    { label: 'Pharma1000', value: 1 },
    { label: 'Empresa 3', value: 2 }
] 

const bricks_default = [
    { label: 'Todos', value: 'Todos'},
    { label: "brick 0", value: 0 },
    { label: "brick 1", value: 1 },
    { label: "brick 2", value: 2 }
]

const products_default = [
    { label: 'Todos', value: 'Todos'},
    { label: "product 0", value: 0 },
    { label: "product 1", value: 1 },
    { label: "product 2", value: 2 }
]

const predefinedValues_histogram = {
    Year_H: new Date().getFullYear(),
    Delegate_H: 'Todos',
  };
  
  const predefinedValues_table_product = {
    Year_P: new Date().getFullYear(),
    Delegate_P: 'Todos',
    Company_P: 'MyPharma',
    Brick_P: 'Todos',
    Product_P: 'Todos'
  };
  
  const predefinedValues_table_total = {
    Delegate_TP: 'Todos',
    Company_TP: 'MyPharma',
    Brick_TP: 'Todos',
    Product_TP: 'Todos'
  };
  
  const predefinedValues_table_brick = {
    Year_B: new Date().getFullYear(),
    Delegate_B: 'Todos',
    Company_B: 'MyPharma',
    Brick_B: 'Todos'
  };

  
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
    
    filters: {
        histogram: { years: years_default, delegates: delegates_default },
        products: { years: years_default, delegates: delegates_default, companies: companies_default, bricks: bricks_default, products: products_default },
        totalProducts: { delegates: delegates_default, companies: companies_default, bricks: bricks_default, products: products_default },
        bricks: { years: years_default, delegates: delegates_default, companies: companies_default },
    },

    // Store filters form's values to be able to pass them to the fetch hook
    selectedOption: {
        histogram: predefinedValues_histogram,
        products: predefinedValues_table_product,
        totalProducts: predefinedValues_table_total,
        bricks: predefinedValues_table_brick
    },

    updateFetchTriggers: (type) => {
        set((state) => {
            const updatedTriggers = type
                ? { ...state.triggers, [type]: !state.triggers[type], }                      // Single trigger update
                : Object.fromEntries(
                      Object.keys(state.triggers).map((key) => [key, !state.triggers[key],]) // Update all triggers
                  );
    
            return { triggers: updatedTriggers };
        });
    },

    updateFiltersData: (type, filters) =>
        set((state) => ({
            filters: {
                ...state.filters,
                [type]: { ...state.filters[type], ...filters },
            },
        })),

    updateSalesData: (type, data) => {
        set((state) => ({
            data: {
                ...state.data,
                [type]: { ...state.data[type], ...data },
            },
        }))
    },

    updateSelectedOption: (type, option) => {
        set((state) => ({
            selectedOption:{
                ...state.selectedOption,
                [type]: { ...state.selectedOption[type], ...option },
            }
        }));
    },

    reset: () => set({
        triggers: {
          histogram: false,
          products: false, 
          totalProducts: false,
          bricks: false,
        },
        data: {
          histogram: [],    
          products: [],
          totalProducts: [],
          bricks: [],
        },
        filters: {
          histogram: { years: years_default, delegates: delegates_default },
          products: { years: years_default, delegates: delegates_default, companies: companies_default, bricks: bricks_default, products: products_default },
          totalProducts: { delegates: delegates_default, companies: companies_default, bricks: bricks_default, products: products_default },
          bricks: { years: years_default, delegates: delegates_default, companies: companies_default },
        },
        selectedOption: {
            histogram: predefinedValues_histogram,
            products: predefinedValues_table_product,
            totalProducts: predefinedValues_table_total,
            bricks: predefinedValues_table_brick
        }                   
      }),
}))

export default useSalesDataStore
