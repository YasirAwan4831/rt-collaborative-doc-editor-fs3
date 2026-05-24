import { asyncHandler } from '../utils/asyncHandler.js';
import { userService } from '../services/user.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.user.uid);
  res.json({ success: true, data: profile || req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await userService.updateProfile(req.user.uid, req.body);
  res.json({ success: true, data: profile });
});

export default { getProfile, updateProfile };
