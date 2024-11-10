import { create } from 'zustand'

const useFormDataStore = create((set) => ({
  hasFetched: false,    // Flag to check if data was already fetched
  districts: [],
  hmr_regions: [],
  parishes: [],
  instituitions: [],
  specialties: [],

  updateFormDataStore: (data) => {
    set({
      hasFetched: true,
      districts: data[0].districts,
      hmr_regions: data[0].hmr_regions,
      parishes: data[0].parishes,
      instituitions: data[0].instituitions,
      specialties: data[0].specialties,
    });
  } 
}))

export default useFormDataStore
