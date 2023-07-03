const db = require("../db");

class UserController {
	async getUsers(req, res) {
		const users = await db.query(
			`SELECT * FROM usr ORDER BY max_score DESC LIMIT 10`
		);
		res.json(users.rows);
	}

	async createUser(req, res) {
		const { username } = req.body;
		const newUser = await db.query(
		  `INSERT INTO usr (username) values ($1) RETURNING *`,
			[username]
		);
		res.json(newUser.rows[0]);
	};

	async getUser(req, res) {
		const username = req.params.username;
		const user = await db.query(`SELECT * FROM usr WHERE username = $1`, [
			username
		]);
		res.json(user.rows[0]);
	}

	async updateUser(req, res) {
		const id = req.params.id;
		const { max_score } = req.body;
		const { rows } = await db.query(
			`SELECT max_score FROM usr WHERE id = $1`,
			[id]
		);
		const score = rows[0].max_score;
		if (max_score > score) {
			const updatedUser = await db.query(
				`UPDATE usr SET max_score = $1 WHERE id = $2 RETURNING *`,
				[max_score, id]
			);
			res.json(updatedUser.rows[0]);
		} else {
			res.json({
				message: "max_score is not greater than the existing score.",
			});
		}
	}

	async deleteUser(req, res) {
		const id = req.params.id;
		const user = await db.query(`DELETE FROM usr WHERE id = $1`, [id]);
		res.json(user.rows[0]);
	}
}

module.exports = UserController;
