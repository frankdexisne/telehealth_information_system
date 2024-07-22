import { createSlice } from "@reduxjs/toolkit";
import RoleList from "../../interfaces/RoleList";
import PermissionList from "../../interfaces/PermissionList";

interface UserInterface {
  id?: number;
  name: string;
  email: string;
  role_name: RoleList | "";
  department_id: string;
  hpersonal_code: string | null;
}

interface initialStateProps {
  token: string | null;
  isLoggedIn: boolean;
  permissions: PermissionList[];
  user: UserInterface;
}

const initialState: initialStateProps = {
  token: null,
  isLoggedIn: false,
  user: {
    name: "",
    email: "",
    role_name: "",
    department_id: "",
    hpersonal_code: null,
  },
  permissions: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setToken(state, action) {
      const token = action.payload;
      localStorage.setItem(import.meta.env.VITE_TOKEN_NAME, token);
      state.token = token;
      state.isLoggedIn = true;
    },
    setUser(state, action) {
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.user = action.payload;
    },
    setPermissions(state, action) {
      localStorage.setItem("permissions", JSON.stringify(action.payload));
      state.permissions = action.payload;
    },
    removeToken(state) {
      localStorage.removeItem(import.meta.env.VITE_TOKEN_NAME);
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
