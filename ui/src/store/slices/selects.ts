import { createSlice } from "@reduxjs/toolkit";
import type { ComboboxData } from "@mantine/core";
import { OptionType } from "../../components/use-form-controls";

interface initialStateProps {
  teleclerks: ComboboxData;
  doctors: ComboboxData;
  departments: ComboboxData;
  designations: ComboboxData;
  dispositions: ComboboxData;
  roles: ComboboxData;
  patient_conditions: ComboboxData;
  consultation_statuses: ComboboxData;
  civil_statuses: ComboboxData;
  suffixes: ComboboxData;
  regions: ComboboxData;
  platforms: ComboboxData;
}

const initialState: initialStateProps = {
  teleclerks: [],
  doctors: [],
  departments: [],
  designations: [],
  dispositions: [],
  roles: [],
  patient_conditions: [],
  consultation_statuses: [],
  civil_statuses: [],
  suffixes: [],
  regions: [],
  platforms: [],
};

const selectDataFormat = (data: OptionType[]) => {
  return data.map((item: OptionType) => ({
    ...item,
    value: item.value.toString(),
  }));
};

const selectSlice = createSlice({
  name: "selects",
  initialState: initialState,
  reducers: {
    setTeleclerks(state, action) {
      state.teleclerks = selectDataFormat(action.payload);
    },
    setDoctors(state, action) {
      state.doctors = selectDataFormat(action.payload);
    },
    setDepartments(state, action) {
      state.departments = selectDataFormat(action.payload);
    },
    setDesignations(state, action) {
      state.designations = selectDataFormat(action.payload);
    },
    setDispositions(state, action) {
      state.dispositions = selectDataFormat(action.payload);
    },
    setRoles(state, action) {
      state.roles = selectDataFormat(action.payload);
    },
    setPatientConditions(state, action) {
      state.patient_conditions = selectDataFormat(action.payload);
    },
    setConsultationStatuses(state, action) {
      state.consultation_statuses = selectDataFormat(action.payload);
    },
    setCivilStatuses(state, action) {
      state.civil_statuses = selectDataFormat(action.payload);
    },
    setSuffixes(state, action) {
      state.suffixes = selectDataFormat(action.payload);
    },
    setRegions(state, action) {
      state.regions = selectDataFormat(action.payload);
    },
    setPlatforms(state, action) {
      state.platforms = selectDataFormat(action.payload);
    },
  },
});

export const selectActions = selectSlice.actions;

export default selectSlice;
