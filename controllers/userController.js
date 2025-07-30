
const user = require("../models/user");
const bcrypt = require('bcrypt');

exports.userRegister = async (req, res) => {
    const { username, email, password, customerId,subscription } = req.body;
    try{
        // Check if user already exists
        const existingUser = await user.findOne({ email: email });
        const existingUserByUsername = await user.findOne({ username: username });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(409).json({ message: 'User already exists' });
        }
        else if(existingUserByUsername )
        {
          // User exists with same customerId and subscription
         
          return res.status(409).json({ message: 'User already exists with same username' });
        

        }
        else
        {
          
            // Create new user
            const newUser = new user({
                username: username,
                email: email,
                password: password,
                customerId: customerId,
                subscription: subscription,
                chat:[
                ]
                

            });
            await newUser.save();
            console.log('User registered successfully:', newUser);
            return res.status(201).json({ message: 'User registered successfully', user: newUser });
        }
        

    }
    catch (err) {
        console.error('Error checking user existence:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
// userController.js
// exports.userLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const User = await user.findOne({ email });
//     if (!User) return res.status(404).json({ message: "User not found" });
//     // console.log(User.chat)
//     console.log(User._id.toString())
//   if(!User.chat.include(User._id.toString()))
//     {
//       const chatStore= new user(
//         {
//           username:User.username,
//           email:User.email,
//           password:User.password,
//           customerId:User.customerId,
//           subscription:User.subscription,
//           chat: [
//               {
//               chatId: User._id.toString(),
//               chatsystem:'',
//               chatuser:''
//               }
//             ]

//         }
        
//       )
//       await chatStore.save()
//       console.log(chatStore)
         
//     }

//     const isMatch = await bcrypt.compare(password, User.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
    
    

//     req.session.isLoggedIn = true; // Set session variable
//     req.session.user = User; // Store user information in session
//     console.log("User logged in:", User);
//     // ✅ Send correct response
//     console.log("User session:", req.session.isLoggedIn);
   
//     res.status(200).json({
//       message: "Login successful",
//       user: {
//        user:req.session.user,
//          isLoggedIn: req.session.isLoggedIn
//       }
//     });
//   } catch (error) {
//     console.error("Error during user login:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
// exports.userLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const User = await user.findOne({ email });

//     if (!User) return res.status(404).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, User.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//     // ✅ Set session values (don't store full mongoose user)
//     req.session.isLoggedIn = true;
//     req.session.user = {
//       id: User._id,
//       username: User.username,
//       email: User.email,
//       subscription: User.subscription
//     };

//     req.session.save(err => {
//       if (err) {
//         console.error('Error saving session:', err);
//         return res.status(500).json({ message: 'Internal server error' });
//       }

//       res.cookie('isLoggedIn', true, {
//         httpOnly: true,
//         secure: false,
//         sameSite: 'lax'
//       });

//       res.status(200).json({
//         message: "Login successful",
//         user: req.session.user,
//         isLoggedIn: true
//       });
//     });
//   } catch (error) {
//     console.error("Error during user login:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await user.findOne({ email });
    if (!foundUser) return res.status(404).json({ message: "User not found" });

    const userIdStr = foundUser._id.toString();

    // Check if chat already includes current user ID
    const chatExists = foundUser.chat.some(chat => chat.chatId.toString() === userIdStr);
    
    if (!chatExists) {
      foundUser.chat.push({
        chatId: userIdStr,
        chatsystem: '',
        chatuser: ''
      });
      await foundUser.save();
      console.log("Chat added to existing user:", foundUser.chat);
    }
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    req.session.isLoggedIn = true;
    req.session.user = foundUser;

    res.status(200).json({
      message: "Login successful",
      user: {
        user: req.session.user,
        isLoggedIn: req.session.isLoggedIn
      }
    });

  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.checkUserSession = (req, res) => {
    console.log('session:', req.session.isLoggedIn);
    if (req.session.isLoggedIn) {
        return res.status(200).json({ isLoggedIn: true, user: req.session.user });
    } else {
        return res.status(401).json({ isLoggedIn: false });
    }
};
exports.userLogOut = (req, res) => {
    console.log('khtm hogya')

    req.session.destroy(err => {
        if (err) {
        console.error('Error during logout:', err);
        return res.status(500).send('Internal Server Error');
        }
     
        res.clearCookie('connect.sid'); // Clear the session cookie
       
        res.status(200).send('Logged out successfully');

    });
    }