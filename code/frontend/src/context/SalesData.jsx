import { create } from 'zustand'


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
        histogram: { years: [], delegates: [] },
        products: { years: [], delegates: [], companies: [], bricks: [], products: [] },
        totalProducts: { delegates: [], companies: [], bricks: [], products: [] },
        bricks: { years: [], delegates: [], companies: [], bricks: []},
    },

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

    updateFiltersData: (type, filters) => {
        set((state) => ({
            filters: {
                ...state.filters,
                [type]: filters[type],
            },
        }))
    },

    updateSalesData: (type, data) => {
        set((state) => ({
            data: {
                ...state.data,
                [type]: data[type],
            },
        }))
    },

    updateSelectedOption: (type, option) => {       
        set((state) => ({
            selectedOption:{
                ...state.selectedOption,
                [type]: option,                     
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
          histogram: { years: [], delegates: [] },
          products: { years: [], delegates: [], companies: [], bricks: [], products: [] },
          totalProducts: { delegates: [], companies: [], bricks: [], products: [] },
          bricks: { years: [], delegates: [], companies: [],bricks: []},
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
