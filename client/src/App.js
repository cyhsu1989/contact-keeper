import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./component/layout/Navbar";
import About from "./component/pages/About";
import Home from "./component/pages/Home";
import "./App.css";

function App() {
	return (
		<Router>
			<Fragment>
				<Navbar></Navbar>
				<div className="container">
					<Switch>
						<Route exact path="/" component={Home}></Route>
						<Route exact path="/about" component={About}></Route>
					</Switch>
				</div>
			</Fragment>
		</Router>
	);
}

export default App;
