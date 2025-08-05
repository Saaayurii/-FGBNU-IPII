"use server";

import { signIn, signOut } from "next-auth/react";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function signInWithCredentials(email: string, password: string) {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: "525@=K5 CG5B=K5 40==K5" };
    }

    return { success: true };
  } catch (error) {
    console.error("H81:0 2E>40:", error);
    return { success: false, error: "H81:0 ?@8 2E>45 2 A8AB5<C" };
  }
}

export async function signOutAction() {
  try {
    await signOut({ redirect: false });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("H81:0 2KE>40:", error);
    return { success: false, error: "H81:0 ?@8 2KE>45 87 A8AB5<K" };
  }
}

export async function createUser(data: {
  email: string;
  password: string;
  name?: string;
  role?: Role;
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return { success: false, error: ">;L7>20B5;L A B0:8< email C65 ACI5AB2C5B" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name || null,
        role: data.role || Role.USER,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });

    return { success: true, data: user };
  } catch (error) {
    console.error("H81:0 A>740=8O ?>;L7>20B5;O:", error);
    return { success: false, error: "H81:0 ?@8 A>740=88 ?>;L7>20B5;O" };
  }
}

export async function updateUserPassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.password) {
      return { success: false, error: ">;L7>20B5;L =5 =0945=" };
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return { success: false, error: "525@=K9 B5:CI89 ?0@>;L" };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    return { success: true };
  } catch (error) {
    console.error("H81:0 >1=>2;5=8O ?0@>;O:", error);
    return { success: false, error: "H81:0 ?@8 >1=>2;5=88 ?0@>;O" };
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });

    return user;
  } catch (error) {
    console.error("H81:0 ?>;CG5=8O ?>;L7>20B5;O:", error);
    return null;
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return users;
  } catch (error) {
    console.error("H81:0 ?>;CG5=8O ?>;L7>20B5;59:", error);
    return [];
  }
}