import { useState } from "react";
import Canvas from "../components/canvas/Canvas";
import { UserList } from "../components/users/UserList";
import "../layout/MainLayout.css";

export const MainLayout = () => {
	const [gameOver, setGameOver] = useState(false);

	const handleGameOverStatus = (status) => {
		setGameOver(status);
	};
	
	return (
		<div className="main-layout">
			<Canvas onGameStatusChange={handleGameOverStatus} />
			<UserList gameOver={gameOver} />
		</div>
	);
};
