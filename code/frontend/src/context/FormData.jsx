import { create } from 'zustand'

const useFormDataStore = create((set) => ({
  hasFetched: false,    // Flag to check if data was already fetched
  districts: [],
  regions: [],
  towns: [],
  instituitions: [],
  specialties: [],

  updateFormDataStore: (data) => {
    set({
      hasFetched: true,
      districts: data[0].districts,
      regions: data[0].regions,
      towns: data[0].towns,
      instituitions: data[0].instituitions,
      specialties: data[0].specialties,
    });
  } 
}))

export default useFormDataStore
