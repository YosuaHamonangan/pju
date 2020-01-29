import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import InboxIcon from "@material-ui/icons/Inbox";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";

class Layout extends React.Component {
	state = {};

	openDrawer = () => {
		this.setState({ open: true });
	};

	closeDrawer = () => {
		this.setState({ open: false });
	};

	render() {
		return (
			<div style={styles.root}>
				<CssBaseline />
				<AppBar position="static" style={styles.header}>
					<Toolbar>
						<IconButton 
							edge="start" 
							color="inherit" 
							style={styles.menuButton}
							onClick={this.openDrawer}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6">
							Manajemen PJU
						</Typography>
					</Toolbar>
				</AppBar>
				<Drawer variant="persistent" open={this.state.open}>
					<div style={styles.drawer}>
						<div style={styles.drawerCloseButton}>
							<Typography variant="h6" align="center" style={{width: "100%"}}>
								Manajemen PJU
							</Typography>
							<IconButton onClick={this.closeDrawer}>
								<ChevronLeftIcon />
							</IconButton>
						</div>
						<Divider/>
						<List>
							<ListItem button>
								<ListItemIcon>
									<InboxIcon/>
								</ListItemIcon>
								<ListItemText primary={"Inbox"} />
							</ListItem>
							<ListItem button>
								<ListItemIcon>
									<MailIcon/>
								</ListItemIcon>
								<ListItemText primary={"Inbox"} />
							</ListItem>
						</List>
					</div>
				</Drawer>
				<main style={styles.content}>
					{this.props.children}
				</main>
			</div>
		);
	}
}

var drawerWidth = 256;
var headerHeight = 64;
var styles = {
	header: {
		position: "fixed",
		height: headerHeight
	},
	menuButton: {
		marginRight: 36,
	},
	drawerCloseButton: {
		display: "flex",
		alignItems: "center",
		// justifyContent: "center",
		padding: "0 8px",
		height: headerHeight
	},
	drawer: {
		width: drawerWidth
	},
	content: {
		height: "100vh",
		paddingTop: headerHeight,
		overflow: "auto",
	},
}

export default Layout;