import { render } from "@wordpress/element";

import {
	createHashRouter,
	RouterProvider
} from "react-router-dom";
import App from './App';
import AllPost from "./components/AllPost";

const router = createHashRouter([
	{
		path: "/",
		element: <App />,
	},
]);

window.addEventListener(
	'load',
	function () {
		render(
			<RouterProvider router={router} />,
			document.querySelector('#my-first-gutenberg-app')
		);
	},
	false
);
