-- CreateTable
CREATE TABLE "PsychologistAvailability" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "psychologistId" INTEGER NOT NULL,
    CONSTRAINT "PsychologistAvailability_psychologistId_fkey" FOREIGN KEY ("psychologistId") REFERENCES "Psychologist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "psychologistId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    CONSTRAINT "Appointment_psychologistId_fkey" FOREIGN KEY ("psychologistId") REFERENCES "Psychologist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "PsychologistAvailability_psychologistId_idx" ON "PsychologistAvailability"("psychologistId");

-- CreateIndex
CREATE UNIQUE INDEX "PsychologistAvailability_psychologistId_dayOfWeek_startTime_endTime_key" ON "PsychologistAvailability"("psychologistId", "dayOfWeek", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "Appointment_psychologistId_idx" ON "Appointment"("psychologistId");

-- CreateIndex
CREATE INDEX "Appointment_employeeId_idx" ON "Appointment"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_psychologistId_date_startTime_endTime_key" ON "Appointment"("psychologistId", "date", "startTime", "endTime");
