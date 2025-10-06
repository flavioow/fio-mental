/*
  Warnings:

  - You are about to drop the column `questionarioId` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `nome` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeId` to the `Questionario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "endereco" TEXT,
    "setor" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Company" ("cnpj", "endereco", "id", "setor", "userId") SELECT "cnpj", "endereco", "id", "setor", "userId" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE UNIQUE INDEX "Company_cnpj_key" ON "Company"("cnpj");
CREATE UNIQUE INDEX "Company_userId_key" ON "Company"("userId");
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
CREATE TABLE "new_Questionario" (
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
    "ouvido" INTEGER,
    "tipoColega" TEXT,
    "ambienteCalmo" BOOLEAN NOT NULL,
    "habilidades" TEXT,
    "oportunidades" BOOLEAN NOT NULL,
    "confianca" TEXT,
    "palavra" TEXT,
    "mudanca" TEXT,
    "employeeId" INTEGER NOT NULL,
    CONSTRAINT "Questionario_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Questionario" ("ambienteCalmo", "confianca", "conflitos", "desmotivacao", "equilibrio", "escalaEstresse", "espacoBemEstar", "focoColaborativo", "habilidades", "id", "melhorHorario", "motivacao", "motivoEstresse", "mudanca", "oportunidades", "ouvido", "palavra", "pedirAjuda", "reacaoProblema", "satisfacao", "senteOuvido", "tipoColega") SELECT "ambienteCalmo", "confianca", "conflitos", "desmotivacao", "equilibrio", "escalaEstresse", "espacoBemEstar", "focoColaborativo", "habilidades", "id", "melhorHorario", "motivacao", "motivoEstresse", "mudanca", "oportunidades", "ouvido", "palavra", "pedirAjuda", "reacaoProblema", "satisfacao", "senteOuvido", "tipoColega" FROM "Questionario";
DROP TABLE "Questionario";
ALTER TABLE "new_Questionario" RENAME TO "Questionario";
CREATE UNIQUE INDEX "Questionario_employeeId_key" ON "Questionario"("employeeId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "img" TEXT,
    "telefone" TEXT,
    "role" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "img", "name", "password", "role", "telefone") SELECT "email", "id", "img", "name", "password", "role", "telefone" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
