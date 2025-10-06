/*
  Warnings:

  - You are about to drop the column `telefone` on the `Employee` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cpf" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Employee" ("cpf", "id", "userId") SELECT "cpf", "id", "userId" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
CREATE UNIQUE INDEX "Employee_cpf_key" ON "Employee"("cpf");
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");
CREATE TABLE "new_Psychologist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cpf" TEXT NOT NULL,
    "crp" TEXT NOT NULL,
    "tempoAtuacao" INTEGER,
    "descricao" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Psychologist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Psychologist" ("cpf", "crp", "descricao", "id", "tempoAtuacao", "userId") SELECT "cpf", "crp", "descricao", "id", "tempoAtuacao", "userId" FROM "Psychologist";
DROP TABLE "Psychologist";
ALTER TABLE "new_Psychologist" RENAME TO "Psychologist";
CREATE UNIQUE INDEX "Psychologist_cpf_key" ON "Psychologist"("cpf");
CREATE UNIQUE INDEX "Psychologist_crp_key" ON "Psychologist"("crp");
CREATE UNIQUE INDEX "Psychologist_userId_key" ON "Psychologist"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
