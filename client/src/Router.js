import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import App from "./App";
import eachArtist from "./eachArtist";

//Router use to route to EachArtist.js page (show detail of selected artist)

const Router = () => (
	<BrowserRouter>
		<Switch>
			<Route path="/" component={App} exact />
			<Route path="/eachArtist/:artist_id,:artist_name" component={eachArtist} />
		</Switch>
	</BrowserRouter>
);

export default Router;
