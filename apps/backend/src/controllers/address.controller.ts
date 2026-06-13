import type { Request, Response } from "express";

import { param } from "../lib/param";
import { validateBody } from "./auth.controller";
import {
  createAddressSchema,
  updateAddressSchema,
  type CreateAddressInput,
  type UpdateAddressInput,
} from "../lib/validators/address.validators";
import {
  AddressError,
  addAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "../services/address.service";

function handleAddressError(error: unknown, res: Response) {
  if (error instanceof AddressError) {
    res.status(error.statusCode).json({
      error: { message: error.message, code: error.code },
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    error: { message: "Internal server error", code: "INTERNAL_ERROR" },
  });
}

export async function getAddressesHandler(req: Request, res: Response) {
  try {
    const addresses = await getAddresses(req.user!.id);
    res.json({ data: { addresses } });
  } catch (error) {
    handleAddressError(error, res);
  }
}

export async function addAddressHandler(req: Request, res: Response) {
  try {
    const body = (req as Request & { validated: CreateAddressInput }).validated;
    const address = await addAddress(req.user!.id, body);
    res.status(201).json({ data: { address } });
  } catch (error) {
    handleAddressError(error, res);
  }
}

export async function updateAddressHandler(req: Request, res: Response) {
  try {
    const body = (req as Request & { validated: UpdateAddressInput }).validated;
    const address = await updateAddress(req.user!.id, param(req.params.id), body);
    res.json({ data: { address } });
  } catch (error) {
    handleAddressError(error, res);
  }
}

export async function deleteAddressHandler(req: Request, res: Response) {
  try {
    const result = await deleteAddress(req.user!.id, param(req.params.id));
    res.json({ data: result });
  } catch (error) {
    handleAddressError(error, res);
  }
}

export async function setDefaultAddressHandler(req: Request, res: Response) {
  try {
    const address = await setDefaultAddress(req.user!.id, param(req.params.id));
    res.json({ data: { address } });
  } catch (error) {
    handleAddressError(error, res);
  }
}

export const validateCreateAddress = validateBody(createAddressSchema);
export const validateUpdateAddress = validateBody(updateAddressSchema);
