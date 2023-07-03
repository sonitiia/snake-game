import axios from "axios";

class UserService {
    async getUsers () {
		return (await axios.get("http://localhost:8080/api/users")).data;	
    };

    async getUser (username) {
		return (await axios.get(`http://localhost:8080/api/users/${username}`)).data;	
    };

	async createUser(username) {
		return (await axios.post("http://localhost:8080/api/users", {
			  username: username
		})).data;
	};

	async updateUser(id, max_score) {
		return (await axios.put(`http://localhost:8080/api/users/${id}`, {
			max_score: max_score
		})).data;
	};	  

    async authenticateUser (username) {
		try {
			const existingUser = await this.getUser(username);
			if (existingUser) {
			  return existingUser;
			} else {
			  return this.createUser(username);
			}
		  } catch (error) {
			console.error("Error creating user:", error);
			throw error;
		}
    };
}

const userService = new UserService();
export default userService;