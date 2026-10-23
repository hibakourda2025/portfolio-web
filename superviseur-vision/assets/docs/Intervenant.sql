
USE SuperviseurVision;
GO

IF OBJECT_ID('Dossier_Intervenant', 'U') IS NOT NULL DROP TABLE Dossier_Intervenant;
GO

CREATE TABLE Dossier_Intervenant (
    dossier_intervenant_id INT IDENTITY(1,1) PRIMARY KEY,
    dossier_id             INT NOT NULL,
    intervenant_id         INT NOT NULL,
    role_affectation       NVARCHAR(50) NOT NULL DEFAULT 'Collaborateur',  -- 'Responsable principal' / 'Collaborateur'
    est_principal          BIT NOT NULL DEFAULT 0,
    date_affectation       DATE NOT NULL,

    CONSTRAINT FK_DI_Dossier
        FOREIGN KEY (dossier_id) REFERENCES Dossier(dossier_id),
    CONSTRAINT FK_DI_Intervenant
        FOREIGN KEY (intervenant_id) REFERENCES Intervenant(intervenant_id),
    CONSTRAINT UQ_Dossier_Intervenant
        UNIQUE (dossier_id, intervenant_id)   -- un intervenant ne peut être lié qu'une fois au même dossier
);
GO

CREATE INDEX IX_DI_Intervenant ON Dossier_Intervenant(intervenant_id);
CREATE INDEX IX_DI_Dossier     ON Dossier_Intervenant(dossier_id);
GO

-- 2) Migration : chaque affectation actuelle (Dossier.intervenant_id) devient le "Responsable principal" dans la table de liaison

INSERT INTO Dossier_Intervenant (dossier_id, intervenant_id, role_affectation, est_principal, date_affectation)
SELECT dossier_id, intervenant_id, 'Responsable principal', 1, date_creation
FROM Dossier;
GO

INSERT INTO Dossier_Intervenant (dossier_id, intervenant_id, role_affectation, est_principal, date_affectation)
SELECT
    d.dossier_id,
    ((d.intervenant_id % 20) + 1) AS intervenant_id_collaborateur,
    'Collaborateur',
    0,
    DATEADD(DAY, 5, d.date_creation)
FROM Dossier d
WHERE d.dossier_id % 3 = 0;
GO



CREATE TABLE Phase_Poids (
    phase_id INT PRIMARY KEY,
    poids_charge DECIMAL(4,2) NOT NULL,
    CONSTRAINT FK_PP_Phase FOREIGN KEY (phase_id) REFERENCES Phase(phase_id)
);

INSERT INTO Phase_Poids (phase_id, poids_charge) VALUES
(1, 0.5),  -- Recherche site : charge légère
(2, 1.0),  -- Acquisition
(3, 0.7),  -- Coordination/Mailing
(4, 1.5),  -- DAO : charge lourde (technique)
(5, 1.3),  -- APS
(6, 1.5),  -- APD : charge lourde
(7, 0.5);  -- Validation : charge légère
