import { createContext, ReactNode, useEffect, useReducer } from "react";
import { isValidToken, setSession, setSessionGoogle } from "../utils/auth";
import axios from "../utils/axios";
import {
  ActionMap,
  AuthState,
  AuthUser,
  AuthContextType,
} from "../@types/auth";
import { googleLogout } from '@react-oauth/google'

enum Types {
  Initial = "INITIALIZE",
  Login = "LOGIN",
  Logout = "LOGOUT",
  Register = "REGISTER",
}

type AuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
};

export type AuthActions = ActionMap<AuthPayload>[keyof ActionMap<AuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const AuthReducer = (state: AuthState, action: AuthActions) => {
  switch (action.type) {
    case "INITIALIZE":
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case "REGISTER":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token && isValidToken(token)) {
          setSession(token);

          const response = await axios.get("/profile");

          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user: response?.data,
            },
          });
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post("/auth", {
      email,
      password,
    });

    const { token } = response.data;

    setSession(token);

    const res = await axios.get("/profile");

    dispatch({
      type: Types.Login,
      payload: {
        user: res?.data,
      },
    });
  };

  const register = async (
    fullname: string,
    password: string,
    phone_number: string,
    email: string,
    image: string | File
  ) => {

    await axios.post("/register", {
      fullname,
      password,
      phone_number,
      email,
      image,
    }, {
      headers: {
        'Content-Type': 'multipart/form-data;boundary=<calculated when request is sent>',
        'Content-Length': '<calculated when request is sent>',
      }
    });


    dispatch({
      type: Types.Register,
      payload: {
        user: null,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    setSessionGoogle(null)
    googleLogout()
    dispatch({ type: Types.Logout });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
