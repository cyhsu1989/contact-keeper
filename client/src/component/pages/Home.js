import React, { useContext, useEffect } from "react";
import Contacts from "../contacts/Contacts";
import ContactForm from "../contacts/ContactForm";
import ContactFilter from "../contacts/ContactFilter";
import AuthContext from "../../context/auth/authContext";

const Home = () => {
	const authContext = useContext(AuthContext);

	useEffect(() => {
		// 重整頁面，也要驗證登入狀態
		authContext.loadUser();
		// eslint-disable-next-line
	}, []);

	return (
		<div className="grid-2">
			<div>
				<ContactForm></ContactForm>
			</div>
			<div>
				<ContactFilter></ContactFilter>
				<Contacts></Contacts>
			</div>
		</div>
	);
};

export default Home;
