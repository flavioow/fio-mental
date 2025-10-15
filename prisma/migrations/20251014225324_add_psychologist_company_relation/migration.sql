/*
  Warnings:

  - Added the required column `companyId` to the `Psychologist` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Psychologist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cpf" TEXT NOT NULL,
    "crp" TEXT NOT NULL,
    "tempoAtuacao" INTEGER,
    "descricao" TEXT,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    CONSTRAINT "Psychologist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Psychologist_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Psychologist" ("cpf", "crp", "descricao", "id", "tempoAtuacao", "userId") SELECT "cpf", "crp", "descricao", "id", "tempoAtuacao", "userId" FROM "Psychologist";
DROP TABLE "Psychologist";
ALTER TABLE "new_Psychologist" RENAME TO "Psychologist";
CREATE UNIQUE INDEX "Psychologist_cpf_key" ON "Psychologist"("cpf");
CREATE UNIQUE INDEX "Psychologist_crp_key" ON "Psychologist"("crp");
CREATE UNIQUE INDEX "Psychologist_userId_key" ON "Psychologist"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
