import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireOwnerOrAdmin } from "../middleware/rbac.js";
import { validateItemBody } from "../middleware/validate.js";
import { Item } from "../models/Item.js";
import { listMyItems, createItem, updateItem, deleteItem } from "../controllers/items.controller.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", listMyItems);
router.post("/", validateItemBody, createItem);

router.put(
  "/:id",
  requireOwnerOrAdmin(async (req) => {
    const item = await Item.findById(req.params.id).select("ownerId");
    if (!item) return "";
    return String(item.ownerId);
  }),
  updateItem
);

router.delete(
  "/:id",
  requireOwnerOrAdmin(async (req) => {
    const item = await Item.findById(req.params.id).select("ownerId");
    if (!item) return "";
    return String(item.ownerId);
  }),
  deleteItem
);

export default router;
