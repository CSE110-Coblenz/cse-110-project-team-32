import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserByUsername, getUserById, addUser, updateCurrLevelByUsername } from "../data/user_db";


//Route handler used to handle signup

export const signup =  async(req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        //Make sure the user typed in both their username and their password
        if (!username || !password) {
            return res.status(400).json({ error: "username and password are required" });
        }

        //Make sure the user is not trying to create an existing account
        const existing = getUserByUsername(username);
        if (existing) {
            return res.status(409).json({ error: "Username already exists" });
        }

        //Hash the password the user entered and create a new user object in the data base whose password
        //is the hashed password
        const hashed_password = await bcrypt.hash(password, 10);
        const id = addUser(username, hashed_password); 

        //Send back the new user object created without the password the user gave
        res.status(201).json({ id, username });
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
            return res.status(400).json({ error: "please enter both username and password" });
        }

        //Make sure that the database has a user object with the username and password the user entered
        const user = getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        //Compare both the password the user entered and the password of the user object they are trying to access
        const ok = await bcrypt.compare(password, user.password);
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
        res.json({ token, user : { id: user.id, username: user.username }});

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

        const user = getUserById(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            id: user.id,
            username: user.username,
            currLevel: user.currLevel
        });

    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

// Route handler to get user by username
export const getUserByUsernameHandler = async (req: Request, res: Response) => {
    try {
        const { username } = req.params; //extracts username from request

        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        const user = getUserByUsername(username); // get user row from DB

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            id: user.id,
            username: user.username,
            currLevel: user.currLevel
        }); // returns the successful response with the user data

    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

// put route
export const updateCurrLevelByUsernameHandler = (req: Request, res: Response) => {
  const { username } = req.params; // extracts username from request
  const { currLevel } = req.body; // extracts currLevel from request

  if (!username) return res.status(400).json({ error: "Username required" });
  if (currLevel === undefined) return res.status(400).json({ error: "currLevel required" });

  const success = updateCurrLevelByUsername(username, currLevel); // updates the currLevel number
  if (!success) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ message: "Level updated", currLevel }); // successful return message
};


// 200 -> OK
// 400 -> bad request (param missing)
// 404 -> not found (resource missing)

