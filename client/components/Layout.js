import React from "react";
import Router from "next/router";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import NavDropdown	from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Icon from "./Icon";
import store from "../store";
import services from "../services";

import "./Layout.css";

class Layout extends React.Component {
	state = {
		open: true,
	};

	openDrawer = () => {
		this.setState({ open: true });
		return false;
	};

	closeDrawer = () => {
		this.setState({ open: false });
		return false;
	};

	logout = () => {
		services.logout()
			.then( () => {
				store.dispatch({ type: "REMOVE_USER" });
				Router.push("/login"); 
			})
	};

	Header = props => (
		<Navbar id="Header">
			{this.state.open ? 
				<div className="sidebar-spacer"/> : 
				<React.Fragment>
					<Button id="open-btn" onClick={this.openDrawer}>
						<FontAwesomeIcon icon={faBars} color="#777777"/>
					</Button>
					<Navbar.Brand>
						<Link href="/">
							<a>Manajemen PJU</a>
						</Link>
					</Navbar.Brand>
				</React.Fragment>
			}
			
			<Navbar.Collapse className="justify-content-end">
				<Navbar.Text>
					<span className="pr-3">
						User: {store.getState().user.name}
					</span>
					<Link href="/login">
						<a onClick={this.logout}>Logout</a>
					</Link>
				</Navbar.Text>
			</Navbar.Collapse>
		</Navbar>
	);

	Sidebar = () => (
		<Collapse in={this.state.open} dimension="width">
			<div>
				<div id="Sidebar">
					<div id="header">
						<Link href="/">
							<a>Manajemen PJU</a>
						</Link>
						<Button id="close-btn" onClick={this.closeDrawer}>
							<Icon icon="chevron-left" color="white"/>
						</Button>
					</div>
					<Nav defaultActiveKey="/home" className="flex-column">
						<Nav.Item>
							<Link href="/">
								<a><Icon icon="tachometer-alt" color="white"/>Dashboard</a>
							</Link>
						</Nav.Item>
						<Nav.Item>
							<Link href="/map">
								<a><Icon icon="map-marked-alt" color="white"/>Map</a>
							</Link>
						</Nav.Item>
						<Nav.Item>
							<Link href="/pju">
								<a><Icon icon="table" color="white"/>Daftar PJU</a>
							</Link>
						</Nav.Item>
						<Nav.Item>
							<Link href="/user">
								<a><Icon icon="user" color="white"/>User</a>
							</Link>
						</Nav.Item>
					</Nav>
				</div>
			</div>
		</Collapse>
	);

	render() {
		var { Header, Sidebar } = this;
		return (
			<div>
				<Header/>
				<Sidebar/>
				<div className="d-flex">
					
					{ this.state.open && <div className="sidebar-spacer flex-shrink-0"/> }
					<main id="Content">
						{this.props.children}
					</main>
				</div>
			</div>
		);
	}
}

export default Layout;