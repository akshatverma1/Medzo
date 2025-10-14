import express from "express";
const router = express.Router();
import {
  createTransferRequest,
  getAllTransfers,
  updateTransfer,
  deleteTransfer
} from "../controllers/equipment.controller.js";

// POST /api/equipment-transfers - Request equipment transfer
router.post('/', createTransferRequest);

// GET /api/equipment-transfers - Get all transfers
// Query params: ?status=Requested&fromHospital=id&toHospital=id
router.get('/', getAllTransfers);

// PUT /api/equipment-transfers/:id - Update transfer (approve/reject)
router.put('/:id', updateTransfer);

// DELETE /api/equipment-transfers/:id - Delete transfer
router.delete('/:id', deleteTransfer);

export default router;