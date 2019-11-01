import React, { useReducer } from "react";
import AlertContext from "./alertContext";
import alertReducer from "./alertReducer";
import { SET_ALERT, REMOVE_ALERT } from "../type";
import uuid from "uuid";

const AuthState = props => {
	const initalState = [];

	const [state, dispatch] = useReducer(alertReducer, initalState);

	// Set Alert
	const setAlert = (msg, type, timeout = 5000) => {
		// 產生亂數 id，作為後續刪除時分辨用
		const id = uuid.v4();
		dispatch({
			type: SET_ALERT,
			payload: { msg, type, id }
		});

		setTimeout(() => {
			dispatch({
				type: REMOVE_ALERT,
				payload: id
			});
		}, timeout);
	};

	return (
		<AlertContext.Provider
			value={{
				alerts: state,
				setAlert
			}}
		>
			{props.children}
		</AlertContext.Provider>
	);
};

export default AuthState;
