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
      return { success: false, error: "Неверные учетные данные" };
    }

    return { success: true };
  } catch (error) {
    console.error("Ошибка входа:", error);
    return { success: false, error: "Ошибка при входе в систему" };
  }
}

export async function signOutAction() {
  try {
    await signOut({ redirect: false });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Ошибка выхода:", error);
    return { success: false, error: "Ошибка при выходе из системы" };
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
      return { success: false, error: "Пользователь с таким email уже существует" };
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
    console.error("Ошибка создания пользователя:", error);
    return { success: false, error: "Ошибка при создании пользователя" };
  }
}

export async function updateUserPassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.password) {
      return { success: false, error: "Пользователь не найден" };
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return { success: false, error: "Неверный текущий пароль" };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    return { success: true };
  } catch (error) {
    console.error("Ошибка обновления пароля:", error);
    return { success: false, error: "Ошибка при обновлении пароля" };
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
    console.error("Ошибка получения пользователя:", error);
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
    console.error("Ошибка получения пользователей:", error);
    return [];
  }
}