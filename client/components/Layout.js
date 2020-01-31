import React from "react";
import Router from "next/router";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import NavDropdown	from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronLeft, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
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
			.then( () => Router.push("/login") )
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
							<FontAwesomeIcon icon={faChevronLeft} color="white"/>
						</Button>
					</div>
					<Nav defaultActiveKey="/home" className="flex-column">
						<Nav.Item>
							<Link href="/">
								<a><FontAwesomeIcon icon={faTachometerAlt} color="white"/>Dashboard</a>
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