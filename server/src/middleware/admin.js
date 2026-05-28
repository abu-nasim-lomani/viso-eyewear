import ApiError from '../utils/ApiError.js'

/** Allow only admin users. Use after `protect`. */
export const admin = (req, _res, next) => {
  if (req.user?.role !== 'admin') throw new ApiError(403, 'Admin access required.')
  next()
}
