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
      districts: data[0].districts,
      regions: data[0].regions,
      towns: data[0].towns,
      instituitions: data[0].instituitions,
      specialties: data[0].specialties,
      products: data[0].products,
      doctors: data[0].doctors,
      pharmacies: data[0].pharmacies,
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
