export const logoutRoute = async (req, res) => {
  try {
    // In a stateless JWT system, we don't need to do much on the server side
    // The client should remove the token from storage
    return res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during logout'
    });
  }
}; 