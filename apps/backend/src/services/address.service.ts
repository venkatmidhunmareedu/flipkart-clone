import type { AddressType } from "@prisma/client";

import prisma from "../lib/prisma";
import type { CreateAddressInput, UpdateAddressInput } from "../lib/validators/address.validators";

export class AddressError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "AddressError";
  }
}

function formatAddress(address: {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  type: AddressType;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: address.id,
    name: address.name,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    type: address.type,
    isDefault: address.isDefault,
    createdAt: address.createdAt.toISOString(),
    updatedAt: address.updatedAt.toISOString(),
  };
}

export async function getAddresses(userId: string) {
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });

  return addresses.map(formatAddress);
}

export async function addAddress(userId: string, data: CreateAddressInput) {
  return prisma.$transaction(async (tx) => {
    if (data.isDefault) {
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const existingCount = await tx.address.count({ where: { userId } });
    const isDefault = data.isDefault ?? existingCount === 0;

    if (isDefault) {
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await tx.address.create({
      data: {
        userId,
        name: data.name,
        phone: data.phone,
        line1: data.line1,
        line2: data.line2,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        type: data.type,
        isDefault,
      },
    });

    return formatAddress(address);
  });
}

export async function updateAddress(
  userId: string,
  addressId: string,
  data: UpdateAddressInput,
) {
  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!existing) {
    throw new AddressError("Address not found", "NOT_FOUND", 404);
  }

  return prisma.$transaction(async (tx) => {
    if (data.isDefault) {
      await tx.address.updateMany({
        where: { userId, isDefault: true, NOT: { id: addressId } },
        data: { isDefault: false },
      });
    }

    const address = await tx.address.update({
      where: { id: addressId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.line1 !== undefined && { line1: data.line1 }),
        ...(data.line2 !== undefined && { line2: data.line2 }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.state !== undefined && { state: data.state }),
        ...(data.pincode !== undefined && { pincode: data.pincode }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.isDefault !== undefined && { isDefault: data.isDefault }),
      },
    });

    return formatAddress(address);
  });
}

export async function deleteAddress(userId: string, addressId: string) {
  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!existing) {
    throw new AddressError("Address not found", "NOT_FOUND", 404);
  }

  await prisma.$transaction(async (tx) => {
    await tx.address.delete({ where: { id: addressId } });

    if (existing.isDefault) {
      const nextDefault = await tx.address.findFirst({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });

      if (nextDefault) {
        await tx.address.update({
          where: { id: nextDefault.id },
          data: { isDefault: true },
        });
      }
    }
  });

  return { deleted: true };
}

export async function setDefaultAddress(userId: string, addressId: string) {
  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!existing) {
    throw new AddressError("Address not found", "NOT_FOUND", 404);
  }

  return prisma.$transaction(async (tx) => {
    await tx.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    const address = await tx.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    return formatAddress(address);
  });
}
