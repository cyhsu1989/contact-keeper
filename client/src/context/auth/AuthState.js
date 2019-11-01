import React, { useReducer } from "react";
import AuthContext from "./authContext";
import authReducer from "./authReducer";
import setAuthToken from "../../utils/setAuthToken";
import axios from "axios";
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	CLEAR_ERRORS
} from "../type";

const AuthState = props => {
	const initalState = {
		token: localStorage.getItem("token"),
		isAuthenticated: null,
		loading: true,
		user: null,
		error: null
	};

	const [state, dispatch] = useReducer(authReducer, initalState);

	// Load User
	const loadUser = async () => {
		// 呼叫驗證 API 前，先記得設定好 token
		if (localStorage.token) {
			setAuthToken(localStorage.token);
		}

		try {
			const res = await axios.get("/api/auth");

			dispatch({
				type: USER_LOADED,
				payload: res.data
			});
		} catch (error) {
			dispatch({
				type: AUTH_ERROR
			});
		}
	};

	// Register User
	const register = async formData => {
		const config = {
			"Content-Type": "application/json"
		};

		try {
			// 因為在 package.json 有設定 "proxy": "http://localhost:5000"
			// 所以這裡只要寫 API 路徑 "/api/users"
			const res = await axios.post("/api/users", formData, config);

			dispatch({
				type: REGISTER_SUCCESS,
				payload: res.data
			});

			// 註冊成功，進行載入 user 流程
			loadUser();
		} catch (error) {
			dispatch({
				type: REGISTER_FAIL,
				payload: error.response.data.msg
			});
		}
	};

	// Login User

	// Logout

	// Clear Errors
	const clearErrors = () => {
		dispatch({
			type: CLEAR_ERRORS
		});
	};

	return (
		<AuthContext.Provider
			value={{
				token: state.token,
				isAuthenticated: state.isAuthenticated,
				loading: state.loading,
				user: state.user,
				error: state.error,
				register,
				clearErrors,
				loadUser
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthState;
