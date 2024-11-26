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
    set({
      hasFetched: true,
      districts: data.districts,
      regions: data.regions,
      towns: data.towns,
      instituitions: data.instituitions,
      specialties: data.specialties,
      products: data.products,
      doctors: data.doctors,
      pharmacies: data.pharmacies,
    });
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
