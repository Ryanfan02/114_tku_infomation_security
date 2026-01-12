export function ok(res, data) {
  return res.status(200).json(data);
}

export function created(res, data) {
  return res.status(201).json(data);
}

export function badRequest(res, message, details) {
  return res.status(400).json({ message, details });
}

export function unauthorized(res, message) {
  return res.status(401).json({ message });
}

export function forbidden(res, message) {
  return res.status(403).json({ message });
}

export function conflict(res, message) {
  return res.status(409).json({ message });
}

export function serverError(res, message) {
  return res.status(500).json({ message });
}
