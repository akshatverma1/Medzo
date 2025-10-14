import express from "express";
const router = express.Router();
import {
  createConnection,
  getAllConnections,
  updateConnection,
  deleteConnection
} from "../controllers/connection.controller.js";

// POST /api/connections - Create appointment request
router.post('/', createConnection);

// GET /api/connections - Get all connections
// Query params: ?status=Pending&patient=id&doctor=id
router.get('/', getAllConnections);

// PUT /api/connections/:id - Update connection (schedule slot, change status)
router.put('/:id', updateConnection);

// DELETE /api/connections/:id - Delete connection
router.delete('/:id', deleteConnection);

export default router;