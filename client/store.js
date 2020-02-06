import { combineReducers, createStore } from "redux"

function setToLocalStorage(...arg) {
	try {
		localStorage.setItem(...arg);
	}
	catch(err) {}
}

function getFromLocalStorage(...arg) {
	try {
		return localStorage.getItem(...arg);
	}
	catch(err) {
		return null;
	}
}

function removeFromLocalStorage(...arg) {
	try {
		localStorage.removeItem(...arg);
	}
	catch(err) {}
}

function user(state = null, action) {
	switch (action.type) {
		case "SET_USER":
			var { user } = action;
			if(user) {
				setToLocalStorage("user", JSON.stringify(user));
			}
			else {
				user = JSON.parse(getFromLocalStorage("user"));
			}
			return user;
		case "REMOVE_USER":
			removeFromLocalStorage("user");
			return null;
		default:
			return state
	}
}

var reducer = combineReducers({ user });
var store = createStore(reducer);

export default store;