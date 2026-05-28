import User from '../models/User.js'
import { signToken } from '../utils/token.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'

const publicUser = (u) => ({ _id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role })

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body
  if (await User.findOne({ email })) throw new ApiError(409, 'An account with this email already exists.')

  const user = await User.create({ name, email, password, phone })
  res.status(201).json({ token: signToken(user._id), user: publicUser(user) })
})

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password.')
  }
  res.json({ token: signToken(user._id), user: publicUser(user) })
})

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) })
})
