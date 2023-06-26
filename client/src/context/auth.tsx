
import { createContext, useContext, useEffect, useReducer } from "react";
import { User } from "../types";
import axios from "axios";

interface State {
    authenticated: boolean;
    user: User | undefined; // 유저 정보가 없으면 undefined
    loading: boolean;
}

const StateContext = createContext<State>({
    authenticated: false,
    user: undefined,
    loading: true
})

const DispatchContext = createContext<any>(null);

// payload에는 user정보가 들어감.
interface Action {
    type: string,
    payload: any
}

// 로그인, 로그아웃 등의 상태에 따라서 값을 변화해줌
const reducer = (state: State, {type, payload}: Action) => {
    switch (type) {
        case "LOGIN":
            return {
                ...state,
                authenticated: true,
                user: payload
            }
        case "LOGOUT":
            return {
                ...state,
                authenticated: false,
                user: null
            }
        case "STOP_LOADING":
            return {
                ...state,
                loading: false
            }
        default:
            throw new Error(`Unknown action type: ${type}`);
    }
}

export const AuthProvider = ({children}: {children: React.ReactNode}) => { // children의 타입은 React.ReactNode

    const [state, defaultDispatch] = useReducer(reducer, {
        user: null,
        authenticated: false,
        loading: true
    })

    const dispatch = (type: string, payload?: any) => { // payload가 없을 수 있으니 ?
        defaultDispatch({type, payload});
    }

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await axios.get("/auth/me");
                dispatch("LOGIN", res.data);
            } catch (error) {
                console.log(error);
            } finally {
                dispatch("STOP_LOADING");
            }
        }
        loadUser();
    }, [])

    return (
        <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>{children}</StateContext.Provider>
        </DispatchContext.Provider>
    )
}

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);