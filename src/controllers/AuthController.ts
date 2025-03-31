import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../entities/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthController {
  async signup(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Create a new user instance
      const user = User.create({
        email,
        password: hashedPassword
      });

      // Save it to the database
      await user.save();

      return res.status(201).json({ message: "User created" });
    } catch (error) {
      return res.status(500).json({ error: "Error saving user: " + error });
    }
  }

  async login(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      const token = jwt.sign(
        { userId: user.id },
        'your_secret_key',
        { expiresIn: '1h' }
      );

      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ error: "Error logging in: " + error });
    }
  }
}
