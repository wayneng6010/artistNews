import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import App from "./App";
import searchArtist from "./searchArtist";
import eachArtist from "./eachArtist";
import savedArtist from "./savedArtist";
import register from "./register";
import login from "./login";

//Router use to route to EachArtist.js page (show detail of selected artist)

const Router = () => (
	<BrowserRouter>
		<Switch>
			<Route path="/" component={App} exact />
			<Route path="/searchArtist" component={searchArtist} exact />
			<Route path="/eachArtist/:artist_id,:artist_name" component={eachArtist} />
			<Route path="/savedArtist/" component={savedArtist} />
			<Route path="/register/" component={register} />
			<Route path="/login/" component={login} />
			{/* if route not found */}
			<Route path="*" component={login} />
		</Switch>
	</BrowserRouter>
);

export default Router;
