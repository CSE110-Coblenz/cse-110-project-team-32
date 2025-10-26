// This script fetches user data from database 

import { User, UserData } from "../models/User";

export class UserService {

    // After login, fetch user data from DB and store into User Class
    // static function because you dont need to create an instance of UserService to use these functions
    static async loadUserData(userId: string): Promise<User>{
        const response = await fetch("api"); // TODO: fill
        const data: UserData = await response.json();
        return new User(data);
    }

    // Just before logout, save user data back to DB
    saveUserData(user: User){

    }
}