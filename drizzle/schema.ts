import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabla de Actividades Tecnológicas Escolares (ATEs)
 * Almacena la información general de cada ATE creada por un docente
 */
export const ates = mysqlTable("ates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  grado: varchar("grado", { length: 100 }),
  competencia: text("competencia"),
  tipo: mysqlEnum("tipo", ["producto", "proceso", "sistema"]).notNull(),
  descripcion: text("descripcion"),
  estado: mysqlEnum("estado", ["borrador", "en_progreso", "completada"]).default("borrador").notNull(),
  ultimaFaseCompletada: int("ultimaFaseCompletada").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ATE = typeof ates.$inferSelect;
export type InsertATE = typeof ates.$inferInsert;

/**
 * Tabla de fases de una ATE
 * Almacena el contenido específico de cada fase del wizard
 */
export const ateFases = mysqlTable("ate_fases", {
  id: int("id").autoincrement().primaryKey(),
  ateId: int("ateId").notNull(),
  numeroFase: int("numeroFase").notNull(), // 1-6
  titulo: varchar("titulo", { length: 255 }).notNull(),
  contenido: json("contenido").notNull(), // Almacena los campos específicos de cada fase
  completada: boolean("completada").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ATEFase = typeof ateFases.$inferSelect;
export type InsertATEFase = typeof ateFases.$inferInsert;

/**
 * Tabla de plantillas predefinidas
 * Almacena ejemplos de ATEs para cada tipo (producto, proceso, sistema)
 */
export const plantillas = mysqlTable("plantillas", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  tipo: mysqlEnum("tipo", ["producto", "proceso", "sistema"]).notNull(),
  descripcion: text("descripcion"),
  contenido: json("contenido").notNull(), // Estructura completa de la plantilla
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Plantilla = typeof plantillas.$inferSelect;
export type InsertPlantilla = typeof plantillas.$inferInsert;

/**
 * Relaciones
 */
export const usersRelations = relations(users, ({ many }) => ({
  ates: many(ates),
}));

export const atesRelations = relations(ates, ({ one, many }) => ({
  user: one(users, { fields: [ates.userId], references: [users.id] }),
  fases: many(ateFases),
}));

export const ateFasesRelations = relations(ateFases, ({ one }) => ({
  ate: one(ates, { fields: [ateFases.ateId], references: [ates.id] }),
}));