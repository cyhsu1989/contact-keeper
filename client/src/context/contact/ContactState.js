import React, { useReducer } from "react";
import ContactContext from "./contactContext";
import contactReducer from "./contactReducer";

import uuid from "uuid";
import {
	ADD_CONTACT,
	DELETE_CONTACT,
	SET_CURRENT,
	CLEAR_CURRENT,
	UPDATE_CONTACT,
	FILTER_CONTACTS,
	CLEAR_FILTER
} from "../type";

const ContactState = props => {
	const initalState = {
		contacts: [
			{
				type: "personal",
				id: 1,
				name: "Harry White",
				email: "harry@gmail.com",
				phone: "333-333-333"
			},
			{
				type: "personal",
				id: 2,
				name: "Ted Johnson",
				email: "ted@gmail.com",
				phone: "222-222-2222"
			},
			{
				type: "professional",
				id: 3,
				name: "Sara Smith",
				email: "ssmith@gmail.com",
				phone: "111-111-1111"
			}
		]
	};

	const [state, dispatch] = useReducer(contactReducer, initalState);

	// Add Contact
	const addContact = contact => {
		// 產生 id，測試用
		contact.id = uuid.v4();
		dispatch({
			type: ADD_CONTACT,
			payload: contact
		});
	};

	// Delete Contact

	// Set Current Contact

	// Clear Current Contact

	// Update Contact

	// Filter Contact

	// Clear Filter

	return (
		<ContactContext.Provider
			value={{
				contacts: state.contacts,
				addContact
			}}
		>
			{props.children}
		</ContactContext.Provider>
	);
};

export default ContactState;
