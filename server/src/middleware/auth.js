import User from '../models/User.js'
import { verifyToken } from '../utils/token.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'

/** Require a valid Bearer token; attaches the user to req.user. */
export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) throw new ApiError(401, 'Not authorized — please log in.')

  let decoded
  try {
    decoded = verifyToken(token)
  } catch {
    throw new ApiError(401, 'Session expired — please log in again.')
  }

  const user = await User.findById(decoded.id)
  if (!user) throw new ApiError(401, 'Account no longer exists.')

  req.user = user
  next()
})
