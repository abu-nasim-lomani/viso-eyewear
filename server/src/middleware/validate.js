import { validationResult } from 'express-validator'
import ApiError from '../utils/ApiError.js'

/** Run after express-validator checks; throws 400 with the first message. */
export const validate = (req, _res, next) => {
  const result = validationResult(req)
  if (result.isEmpty()) return next()
  const first = result.array()[0]
  throw new ApiError(400, first.msg)
}
