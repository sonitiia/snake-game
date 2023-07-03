import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useInterval from "../../custom-hooks/useInterval";
import "./Canvas.css";
import MangoImage from "../../assets/mango.png";
import AppleImage from "../../assets/apple.png";
import OrangeImage from "../../assets/orange.png";
import userService from "../../services/UserService";

const initialSnake = [[5, 5]];
const initialMango = [14, 10];
const initialApple = [5, 15];
const initialOrange = [18, 5];
const scale = 50;
let timeDelay = 200;

const Canvas = ({ onGameStatusChange }) => {
	const canvasRef = useRef(null);
	const [snake, setSnake] = useState(initialSnake);
	const [mango, setMango] = useState(initialMango);
	const [apple, setApple] = useState(initialApple);
	const [orange, setOrange] = useState(initialOrange);
	const [score, setScore] = useState(0);
	const [direction, setDirection] = useState([1, 0]);
	const [delay, setDelay] = useState(null);
	const [currentUser, setCurrentUser] = useState({});
	const [isGameOver, setIsGameOver] = useState(false);
	const [isGameStarted, setIsGameStarted] = useState(false);
	const [isGamePaused, setIsGamePaused] = useState(false);
	const [pointIntervals, setPointIntervals] = useState([0]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ mode: "all" });

	const handleDirectionChange = (event) => {
		if (isGameStarted && !isGamePaused) {
			switch (event.key) {
				case "ArrowLeft":
					setDirection([-1, 0]);
					break;
				case "ArrowUp":
					setDirection([0, -1]);
					break;
				case "ArrowRight":
					setDirection([1, 0]);
					break;
				case "ArrowDown":
					setDirection([0, 1]);
					break;
				default:
					setDirection([1, 0]);
			}
		}
	};

	const checkCollision = (head) => {
		for (let i = 0; i < head.length; i++) {
			if (head[i] < 0 || head[i] * scale >= 1000) return true;
		}
		for (const s of snake) {
			if (head[0] === s[0] && head[1] === s[1]) return true;
		}
		return false;
	};

	const isFoodEaten = (newSnake) => {
		let newMangoCoord = mango.map(() => Math.floor((Math.random() * 1000) / scale));
		let newAppleCoord = apple.map(() => Math.floor((Math.random() * 1000) / scale));
		let newOrangeCoord = orange.map(() => Math.floor((Math.random() * 1000) / scale));

		if (newSnake[0][0] === mango[0] && newSnake[0][1] === mango[1]) {
			setMango(newMangoCoord);
			setScore((prevScore) => prevScore + 10);
			return true;
		} else if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
			setApple(newAppleCoord);
			setScore((prevScore) => prevScore + 5);
			return true;
		} else if (newSnake[0][0] === orange[0] && newSnake[0][1] === orange[1]) {
			setOrange(newOrangeCoord);
			setScore((prevScore) => prevScore + 1);
			return true;
		}
		return false;
	};	  

	const runGame = () => {
		if (isGameStarted && !isGamePaused) {
			const newSnake = [...snake];
			const newSnakeHead = [
				newSnake[0][0] + direction[0],
				newSnake[0][1] + direction[1],
			];
			newSnake.unshift(newSnakeHead);
			if (checkCollision(newSnakeHead)) {
				setDelay(null);
				setIsGameOver(true);
			}
			if (!isFoodEaten(newSnake, score)) {
				newSnake.pop();
			}
			setSnake(newSnake);

			if ((delay > 10) && (score - 50) >= pointIntervals[pointIntervals.length - 1]) {
				setDelay(delay - 10);
				setPointIntervals(prevPointIntervals => [...prevPointIntervals, pointIntervals[pointIntervals.length - 1] + 50]);
			}
		}
	};

	useInterval(() => runGame(), delay);

	const checkUser = async (username) => {
		try {	
		  const response = await userService.authenticateUser(username);
		  setCurrentUser(response);
		} catch (err) {
		  console.error("Error authenticating users:", err);
		}
	  };

	useEffect(() => {
		const updateUserData = async () => {
			try {
			  if (currentUser && currentUser.id) {
				console.log(currentUser);
				await userService.updateUser(currentUser.id, score);
				console.log(currentUser);
				onGameStatusChange(true);
			  }
			} catch (err) {
			  console.error("Error updating user:", err);
			}
		};  

		if (isGameOver) {
		  updateUserData();
		}
	}, [isGameOver, currentUser, score, onGameStatusChange]);
		
	
	const playGame = () => {
		onGameStatusChange(false);
		setSnake(initialSnake);
		setMango(initialMango);
		setApple(initialApple);
		setOrange(initialOrange);
		setDirection([1, 0]);
		setDelay(timeDelay);
		setScore(0);
		setIsGameOver(false);
		setIsGameStarted(true);
	};

	useEffect(() => {
		let mangoImage = new Image();
		mangoImage.src = MangoImage;
	  
		let appleImage = new Image();
		appleImage.src = AppleImage;

		let orangeImage = new Image();
		orangeImage.src = OrangeImage;
	  
		if (canvasRef.current) {
		  const canvas = canvasRef.current;
		  const ctx = canvas.getContext("2d");
		  if (ctx) {
			ctx.setTransform(scale, 0, 0, scale, 0, 0);
			ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
			ctx.fillStyle = "#dba000";
			snake.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
			ctx.drawImage(mangoImage, mango[0], mango[1], 1, 1);
			ctx.drawImage(appleImage, apple[0], apple[1], 1, 1);
			ctx.drawImage(orangeImage, orange[0], orange[1], 1, 1);
		  }
		}
	  }, [snake, mango, apple, orange, isGameOver]);
	  

	useEffect(() => {
		window.addEventListener("keydown", handleDirectionChange);
		return () => {
			window.removeEventListener("keydown", handleDirectionChange);
		};
	});

	const handleGamePauseToggle = () => {
		setIsGamePaused(!isGamePaused);
	};	  

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === "Enter") {
			if (!isGameStarted) {
				playGame();
			}
			} else if (event.key === " ") {
				handleGamePauseToggle();
			} else {
				handleDirectionChange(event);
			}
		};
	  
		window.addEventListener("keydown", handleKeyDown);
	  
		return () => {
		  window.removeEventListener("keydown", handleKeyDown);
		};
	// eslint-disable-next-line
	}, [isGameStarted, isGamePaused]);

	const onSubmit = async (data) => {
		const { username } = data;

		try {
		  await checkUser(username);
		  playGame();
		} catch (err) {
		  console.error("Error:", err);
		}
	};  

	return (
		<>
			<div className="canvas-wrapper">
				<canvas ref={canvasRef} width={1000} height={1000}>
					<img id="mango" src={MangoImage} alt="Mango"  />
					<img id="apple" src={AppleImage} alt="Apple"/>
					<img id="orange" src={AppleImage} alt="Orange" />	
				</canvas>

				{(isGameOver || delay === null) ? (
					<>
						<form className="form" onSubmit={handleSubmit(onSubmit)}>
							<h2 className="game-over">
								{isGameOver ? "Game is over!" : ""}
							</h2>
							<input
								placeholder="Input username"
								{...register("username", {
									required: "Username is required!",
									minLength: {
										value: 2,
										message: "Min length is 2 symbols!",
									},
									maxLength: {
										value: 30,
										message: "Max length is 30 symbols!",
									},
								})}
								error={`${!!errors.username}`}
							/>
							{errors.username && (
								<p className="incorrect-input-message">{errors.username.message}</p>
							)}
							<button
								type="submit"
								className="playGameButton"
							>
								Play
							</button>
						</form>
					</>
				) : (<button onClick={handleGamePauseToggle} className="pauseGameButton">{isGamePaused ? 'Resume' : 'Pause'}</button>)}
				<h5 className="current-score">Score: {score}</h5>
			</div>
		</>
	);
};

export default Canvas; 