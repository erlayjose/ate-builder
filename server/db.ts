import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

import { and } from "drizzle-orm";
import { ATE, InsertATE, ATEFase, InsertATEFase, ates, ateFases, plantillas } from "../drizzle/schema";

/**
 * Obtener todas las ATEs de un usuario
 */
export async function getUserATEs(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(ates).where(eq(ates.userId, userId));
}

/**
 * Obtener una ATE específica con todas sus fases
 */
export async function getATEWithFases(ateId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  const ate = await db.select().from(ates).where(
    and(eq(ates.id, ateId), eq(ates.userId, userId))
  ).limit(1);

  if (ate.length === 0) return null;

  const fases = await db.select().from(ateFases).where(eq(ateFases.ateId, ateId));

  return { ...ate[0], fases };
}

/**
 * Crear una nueva ATE
 */
export async function createATE(data: InsertATE) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(ates).values(data);
  return result;
}

/**
 * Actualizar una ATE
 */
export async function updateATE(ateId: number, userId: number, data: Partial<InsertATE>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(ates).set(data).where(
    and(eq(ates.id, ateId), eq(ates.userId, userId))
  );
}

/**
 * Eliminar una ATE
 */
export async function deleteATE(ateId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Verificar que la ATE pertenece al usuario
  const ate = await db.select().from(ates).where(
    and(eq(ates.id, ateId), eq(ates.userId, userId))
  ).limit(1);

  if (ate.length === 0) throw new Error("ATE not found or unauthorized");

  // Primero eliminar las fases
  await db.delete(ateFases).where(eq(ateFases.ateId, ateId));

  // Luego eliminar la ATE
  await db.delete(ates).where(
    and(eq(ates.id, ateId), eq(ates.userId, userId))
  );
}

/**
 * Duplicar una ATE
 */
export async function duplicateATE(ateId: number, userId: number, newName: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const original = await getATEWithFases(ateId, userId);
  if (!original) throw new Error("ATE not found");

  // Crear nueva ATE
  const newATE = await db.insert(ates).values({
    userId,
    nombre: newName,
    grado: original.grado,
    competencia: original.competencia,
    tipo: original.tipo,
    descripcion: original.descripcion,
    estado: "borrador",
    ultimaFaseCompletada: 0,
  });

  const newATEId = (newATE as any).insertId as number;

  // Duplicar fases
  for (const fase of original.fases) {
    await db.insert(ateFases).values({
      ateId: newATEId,
      numeroFase: fase.numeroFase,
      titulo: fase.titulo,
      contenido: fase.contenido,
      completada: false,
    });
  }

  return newATEId;
}

/**
 * Obtener o crear fases para una ATE
 */
export async function getOrCreateATEFases(ateId: number) {
  const db = await getDb();
  if (!db) return [];

  const existingFases = await db.select().from(ateFases).where(eq(ateFases.ateId, ateId));

  if (existingFases.length === 6) {
    return existingFases;
  }

  // Crear las 6 fases si no existen
  const faseTitles = [
    "Identificación del problema",
    "Exploración y documentación",
    "Diseño de la solución",
    "Planeación y construcción",
    "Evaluación y mejora",
    "Comunicación y socialización"
  ];

  const newFases = [];
  for (let i = 0; i < 6; i++) {
    const result = await db.insert(ateFases).values({
      ateId,
      numeroFase: i + 1,
      titulo: faseTitles[i],
      contenido: {},
      completada: false,
    });
    newFases.push(result);
  }

  return await db.select().from(ateFases).where(eq(ateFases.ateId, ateId));
}

/**
 * Actualizar una fase específica
 */
export async function updateATEFase(faseId: number, ateId: number, userId: number, data: Partial<InsertATEFase>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Verificar que la ATE pertenece al usuario
  const ate = await db.select().from(ates).where(
    and(eq(ates.id, ateId), eq(ates.userId, userId))
  ).limit(1);

  if (ate.length === 0) throw new Error("ATE not found");

  await db.update(ateFases).set(data).where(eq(ateFases.id, faseId));
}

/**
 * Obtener plantillas
 */
export async function getPlantillas() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(plantillas);
}

/**
 * Obtener plantilla por tipo
 */
export async function getPlantillasByTipo(tipo: "producto" | "proceso" | "sistema") {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(plantillas).where(eq(plantillas.tipo, tipo));
}
