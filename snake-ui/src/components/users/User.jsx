import "../users/User.css";

const User = ({ user }) => {
	return (
		<div className="user-wrapper">
			<h3>{user.username}</h3>
			<h3>{user.max_score}</h3>
		</div>
	);
};

export default User;
