/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cpf" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "questionarioId" INTEGER,
    CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Employee_questionarioId_fkey" FOREIGN KEY ("questionarioId") REFERENCES "Questionario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cnpj" TEXT NOT NULL,
    "endereco" TEXT,
    "setor" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Psychologist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cpf" TEXT NOT NULL,
    "crp" TEXT NOT NULL,
    "tempoAtuacao" INTEGER NOT NULL,
    "descricao" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Psychologist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Questionario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "escalaEstresse" INTEGER NOT NULL,
    "motivoEstresse" TEXT,
    "equilibrio" BOOLEAN NOT NULL,
    "reacaoProblema" TEXT,
    "espacoBemEstar" BOOLEAN NOT NULL,
    "motivacao" TEXT,
    "desmotivacao" TEXT,
    "melhorHorario" TEXT,
    "focoColaborativo" BOOLEAN NOT NULL,
    "satisfacao" TEXT,
    "pedirAjuda" BOOLEAN NOT NULL,
    "conflitos" TEXT,
    "senteOuvido" BOOLEAN NOT NULL,
    "ouvido" INTEGER NOT NULL,
    "tipoColega" TEXT,
    "ambienteCalmo" BOOLEAN NOT NULL,
    "habilidades" TEXT,
    "oportunidades" BOOLEAN NOT NULL,
    "confianca" TEXT,
    "palavra" TEXT,
    "mudanca" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "img" TEXT,
    "telefone" INTEGER NOT NULL,
    "role" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "name") SELECT "email", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_cpf_key" ON "Employee"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_cnpj_key" ON "Company"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Company_userId_key" ON "Company"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Psychologist_cpf_key" ON "Psychologist"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Psychologist_crp_key" ON "Psychologist"("crp");

-- CreateIndex
CREATE UNIQUE INDEX "Psychologist_userId_key" ON "Psychologist"("userId");
