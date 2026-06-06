import User from "../models/User.js";
import Parking from "../models/Parking.js";

// Toggle a parking location in favorites
export const toggleFavorite = async (req, res) => {
  try {
    const { locationId } = req.params;
    const userId = req.user.id; // Assuming auth middleware sets req.user

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isFavorite = user.favorites.includes(locationId);

    if (isFavorite) {
      // Remove from favorites
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== locationId,
      );
    } else {
      // Add to favorites
      user.favorites.push(locationId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isFavorite ? "Removed from favorites" : "Added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's favorite locations
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.status(200).json({ success: true, data: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
