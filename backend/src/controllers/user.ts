import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserByUsername, getUserById, addUser } from "../data/user_db";


//Route handler used to handle signup

export const signup =  async(req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        //Make sure the user typed in both their username and their password
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        //Make sure the user is not trying to create an existing account
        const existing = await getUserByUsername(trimmedUsername);
        if (existing) {
            return res.status(409).json({ error: "Username already exists" });
        }


        //Make sure the password is more than 12 characters long
        if (trimmedPassword.length < 12) {
            return res.status(400).json({ error: "Make sure the password is more than 12 characters long"});
        }

        //Hash the password the user entered and create a new user object in the data base whose password
        //is the hashed password
        const hashed_password = await bcrypt.hash(trimmedPassword, 10);
        const id = addUser(trimmedUsername, hashed_password); 

        //Send back the new user object created without the password the user gave
        res.status(201).json({ id: id, username: trimmedUsername });
    } catch (err) {
        res.status(500).json({error: (err as Error).message});
    }
};


//Route handler used to handle login
export const login = async(req: Request, res: Response) => {
    const { username, password } = req.body;

    try {

        //Make sure the user typed in both their username and their password
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        //Make sure that the database has a user object with the username and password the user entered
        const user = await getUserByUsername(trimmedUsername);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        //Compare both the password the user entered and the password of the user object they are trying to access
        const ok = await bcrypt.compare(trimmedPassword, user.password);
        if(!ok) {
            return res.status(401).json({ error: "Invalid credentials"});
        }

        //Make sure that there exists a JWT_SECRET key in the .env file
        if(!process.env.JWT_SECRET) {
            throw new Error("Missing JWT_SECRET");
        }

        //Create a new token that the user can use while logged in whenever they want to access their own data again
        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        //Send the user object without the password back to the frontend
        res.status(200).json({ token, user : { id: user.id, username: user.username }});

    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};


export const getUser = async(req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "Invalid id" });
        }

        //Find a user object with the id requested
        const user = getUserById(id);

        //Check if a user exists with the id requested
        if (!user) {
            return res.status(404).json({error : "User not found"});
        }

        //Send the user back into the frontend
        res.status(200).json({id: user.id, username: user.username});

    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};