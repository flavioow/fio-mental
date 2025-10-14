-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Questionario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "escalaEstresse" INTEGER NOT NULL,
    "motivoEstresse" TEXT,
    "equilibrio" TEXT,
    "reacaoProblema" TEXT,
    "espacoBemEstar" TEXT,
    "motivacao" TEXT,
    "desmotivacao" TEXT,
    "melhorHorario" TEXT,
    "focoColaborativo" TEXT,
    "satisfacao" TEXT,
    "pedirAjuda" TEXT,
    "conflitos" TEXT,
    "senteOuvido" TEXT,
    "ouvido" INTEGER,
    "tipoColega" TEXT,
    "ambienteCalmo" TEXT,
    "habilidades" TEXT,
    "oportunidades" TEXT,
    "confianca" TEXT,
    "palavra" TEXT,
    "mudanca" TEXT,
    "employeeId" INTEGER NOT NULL,
    CONSTRAINT "Questionario_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Questionario" ("ambienteCalmo", "confianca", "conflitos", "desmotivacao", "employeeId", "equilibrio", "escalaEstresse", "espacoBemEstar", "focoColaborativo", "habilidades", "id", "melhorHorario", "motivacao", "motivoEstresse", "mudanca", "oportunidades", "ouvido", "palavra", "pedirAjuda", "reacaoProblema", "satisfacao", "senteOuvido", "tipoColega") SELECT "ambienteCalmo", "confianca", "conflitos", "desmotivacao", "employeeId", "equilibrio", "escalaEstresse", "espacoBemEstar", "focoColaborativo", "habilidades", "id", "melhorHorario", "motivacao", "motivoEstresse", "mudanca", "oportunidades", "ouvido", "palavra", "pedirAjuda", "reacaoProblema", "satisfacao", "senteOuvido", "tipoColega" FROM "Questionario";
DROP TABLE "Questionario";
ALTER TABLE "new_Questionario" RENAME TO "Questionario";
CREATE UNIQUE INDEX "Questionario_employeeId_key" ON "Questionario"("employeeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
