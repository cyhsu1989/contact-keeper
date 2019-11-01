import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./component/layout/Navbar";
import About from "./component/pages/About";
import Home from "./component/pages/Home";
import Register from "./component/auth/Register";
import Login from "./component/auth/Login";
import Alerts from "./component/layout/Alerts";
import ContactState from "./context/contact/ContactState";
import AuthState from "./context/auth/AuthState";
import AlertState from "./context/alert/AlertState";
import setAuthToken from "./utils/setAuthToken";
import "./App.css";

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

function App() {
	return (
		<AuthState>
			<ContactState>
				<AlertState>
					<Router>
						<Fragment>
							<Navbar></Navbar>
							<div className="container">
								<Alerts></Alerts>
								<Switch>
									<Route
										exact
										path="/"
										component={Home}
									></Route>
									<Route
										exact
										path="/about"
										component={About}
									></Route>
									<Route
										exact
										path="/register"
										component={Register}
									></Route>
									<Route
										exact
										path="/login"
										component={Login}
									></Route>
								</Switch>
							</div>
						</Fragment>
					</Router>
				</AlertState>
			</ContactState>
		</AuthState>
	);
}

export default App;
