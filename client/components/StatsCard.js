import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import "./StatsCard.css"

export default function StatsCard({ className="", headerIcon, label, value, bodyIcon, text}) {
	return (
		<Card className={"StatsCard rounded " + className}>
			<Card.Header id="header">
				<Row>
					<Col xs={4} id="icon">
						{headerIcon}
					</Col>
					<Col xs={8}>
						<div id="text">
							{label}<br/>
							{value}
						</div>
					</Col>
				</Row>
			</Card.Header>
			{/*
			<Card.Body id="body">
				<div>
					{bodyIcon} {text}
				</div>
			</Card.Body>
			*/}
		</Card>
	);
}