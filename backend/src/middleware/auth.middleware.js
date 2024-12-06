export const protectRoute = async (req, res, next) => {
    try {
      console.log("Cookies:", req.cookies); // Debug cookies received
  
      const token = req.cookies.jwt;
  
      if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token Provided" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      if (!decoded) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
      }
  
      const user = await User.findById(decoded.userId).select("-password");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      req.user = user;
      next();
    } catch (error) {
      console.log("Error in middleware: ", error.message);
      res.status(500).json({ message: error.message });
    }
  };
  