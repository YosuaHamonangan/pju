import App from "next/app";
import { config } from "@fortawesome/fontawesome-svg-core";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import store from "../store";
import "../style.css";

config.autoAddCss = false

function MyApp({ Component, pageProps, user }) {
	store.dispatch({ type: "SET_USER", user });
	return <Component {...pageProps}/>
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
MyApp.getInitialProps = async (appContext) => {
	var appProps = await App.getInitialProps(appContext);
	var user = appContext.ctx.req &&  appContext.ctx.req.user && appContext.ctx.req.user.getLimitedInfo();

	return { ...appProps, user };
}

export default MyApp