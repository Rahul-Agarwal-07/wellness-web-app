const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup controller
exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    console.log("Register Called")
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ 
      email : email, 
      firstName : firstName,
      lastName : lastName,
      password: hashedPassword });

    await newUser.save();
    
    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ 
      token : token,
      user : newUser,
      message: 'User created successfully' });
      
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }

};

// Login controller
exports.login = async (req, res) => {

  console.log("Login Initiated");
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
    
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Profile controller (protected)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user); // toJSON handles id, removes _id, __v, password
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
