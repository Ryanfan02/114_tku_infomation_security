import { Item } from "../models/Item.js";
import { ok, created } from "../utils/errors.js";
import { writeAudit } from "../middleware/audit.js";

export async function listMyItems(req, res) {
  const userId = req.user.userId;
  const role = req.user.role;

  let items = [];

  if (role === "admin") {
    items = await Item.find({}).sort({ createdAt: -1 });
  } else {
    items = await Item.find({ ownerId: userId }).sort({ createdAt: -1 });
  }

  return ok(res, { items });
}

export async function createItem(req, res) {
  const userId = req.user.userId;

  const title = String(req.body.title).trim();
  const done = Boolean(req.body.done);

  const item = await Item.create({
    title,
    done,
    ownerId: userId
  });

  await writeAudit(req, { event: "item_create", userId, meta: { itemId: String(item._id) } });

  return created(res, { item });
}

export async function updateItem(req, res) {
  const userId = req.user.userId;
  const id = req.params.id;

  const patch = {};
  if (req.body.title !== undefined) patch.title = String(req.body.title).trim();
  if (req.body.done !== undefined) patch.done = Boolean(req.body.done);

  const item = await Item.findByIdAndUpdate(id, patch, { new: true });

  await writeAudit(req, { event: "item_update", userId, meta: { itemId: id } });

  return ok(res, { item });
}

export async function deleteItem(req, res) {
  const userId = req.user.userId;
  const id = req.params.id;

  await Item.findByIdAndDelete(id);

  await writeAudit(req, { event: "item_delete", userId, meta: { itemId: id } });

  return ok(res, { message: "Deleted" });
}
