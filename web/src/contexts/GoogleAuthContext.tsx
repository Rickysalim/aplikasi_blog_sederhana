import { createContext, ReactNode, useEffect, useReducer } from "react";
import { isValidToken, setSession, setSessionGoogle } from "../utils/auth";
import axios from "../utils/axios";
import {
  ActionMap,
  AuthState,
  AuthUser,
  GoogleAuthContextType,
} from "../@types/auth";

enum Types {
  Initial = "INITIALIZE",
  Login = "LOGIN",
  Logout = "LOGOUT",
}

type GoogleAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
};

export type GoogleAuthActions =
  ActionMap<GoogleAuthPayload>[keyof ActionMap<GoogleAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const AuthReducer = (state: AuthState, action: GoogleAuthActions) => {
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
    default:
      return state;
  }
};

const GoogleAuthContext = createContext<GoogleAuthContextType | null>(null);

type GoogleAuthProviderProps = {
  children: ReactNode;
};

function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
  const [state, dispatch] = useReducer(AuthReducer, initialState);
  

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = localStorage.getItem("token");
        const tokenGoogle = localStorage.getItem("token-google")
        if (token && isValidToken(token) && isValidToken(tokenGoogle || '')) {
          setSession(token);
          setSessionGoogle(tokenGoogle);

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

  const login = async (responseGoogle: any) => {
    const response = await axios.post("/auth/google", responseGoogle);
    const { token } = response.data;

    setSession(token);
    setSessionGoogle(responseGoogle?.credential);

    const res = await axios.get("/profile");

    dispatch({
      type: Types.Login,
      payload: {
        user: res?.data,
      },
    });

    window.location.reload()
  };


  return (
    <GoogleAuthContext.Provider
      value={{
        ...state,
        login,
      }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
}
export { GoogleAuthContext, GoogleAuthProvider };

