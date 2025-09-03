import { create } from 'zustand'

const useFormDataStore = create((set) => ({
  hasFetched: false,    // Flag to check if data was already fetched
  districts: [],
  regions: [],
  towns: [],
  instituitions: [],
  specialties: [],
  products: [],
  doctors: [],
  pharmacies: [],

  updateFormDataStore: (data) => {
    set((state) => ({
      ...state,              // Preserve current state
      hasFetched: true,      // Update hasFetched to true
      ...data                // Merge in the provided data
    }));
  },

  reset: () => {
    set({
      hasFetched: false,
      districts: [],
      regions: [],
      towns: [],
      instituitions: [],
      specialties: [],
      products: [],
      doctors: [],
      pharmacies: [],
    })
  }

}))

export default useFormDataStore
