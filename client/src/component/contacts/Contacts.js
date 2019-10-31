import React, { Fragment, useContext } from "react";
import ContactItem from "./ContactItem";
import ContactContext from "../../context/contact/contactContext";

const Contact = () => {
	const contactContext = useContext(ContactContext);
	const { contacts, filtered } = contactContext;

	if (contacts.length === 0) {
		return <h4>Please add a contact</h4>;
	}

	return (
		<Fragment>
			{filtered !== null
				? filtered.map(contact => (
						<ContactItem
							key={contact.id}
							contact={contact}
						></ContactItem>
				  ))
				: contacts.map(contact => (
						<ContactItem
							key={contact.id}
							contact={contact}
						></ContactItem>
				  ))}
		</Fragment>
	);
};

export default Contact;
