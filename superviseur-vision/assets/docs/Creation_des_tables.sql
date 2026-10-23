
IF DB_ID('SuperviseurVision') IS NULL
BEGIN
    CREATE DATABASE SuperviseurVision;
END
GO

USE SuperviseurVision;
GO

IF OBJECT_ID('Phase', 'U') IS NOT NULL DROP TABLE Phase;
IF OBJECT_ID('Statut', 'U') IS NOT NULL DROP TABLE Statut;
IF OBJECT_ID('Intervenant', 'U') IS NOT NULL DROP TABLE Intervenant;
IF OBJECT_ID('Dossier', 'U') IS NOT NULL DROP TABLE Dossier;
IF OBJECT_ID('Echeance', 'U') IS NOT NULL DROP TABLE Echeance;
IF OBJECT_ID('Blocage', 'U') IS NOT NULL DROP TABLE Blocage;
IF OBJECT_ID('Evenement', 'U') IS NOT NULL DROP TABLE Evenement;
GO

CREATE TABLE Phase (
    phase_id INT IDENTITY(1,1) PRIMARY KEY,
    nom_phase NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Statut (
    statut_id INT IDENTITY(1,1) PRIMARY KEY,
    nom_statut NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Intervenant (
    intervenant_id INT IDENTITY(1,1) PRIMARY KEY,
    nom_intervenant NVARCHAR(100) NOT NULL,
    role NVARCHAR(50),
    unite NVARCHAR(50),
    zone NVARCHAR(50)
);

CREATE TABLE Dossier (
    dossier_id INT IDENTITY(1,1) PRIMARY KEY,
    code_dossier NVARCHAR(20) UNIQUE NOT NULL,
    nom_site NVARCHAR(100) NOT NULL,
    region NVARCHAR(50) NOT NULL,
    type_dossier NVARCHAR(50),
    client_projet NVARCHAR(100),
    criticite NVARCHAR(20),
    date_creation DATE NOT NULL,
    phase_id INT NOT NULL,
    statut_id INT NOT NULL,
    intervenant_id INT NOT NULL,

    FOREIGN KEY (phase_id)
        REFERENCES Phase(phase_id),

    FOREIGN KEY (statut_id)
        REFERENCES Statut(statut_id),

    FOREIGN KEY (intervenant_id)
        REFERENCES Intervenant(intervenant_id)
);

CREATE TABLE Echeance (
    echeance_id INT IDENTITY(1,1) PRIMARY KEY,
    dossier_id INT NOT NULL,
    date_cible DATE NOT NULL,
    date_prevue DATE,
    date_reelle DATE,
    FOREIGN KEY (dossier_id)
        REFERENCES Dossier(dossier_id)
);

CREATE TABLE Blocage (
    blocage_id INT IDENTITY(1,1) PRIMARY KEY,
    dossier_id INT NOT NULL,
    type_blocage NVARCHAR(100),
    date_apparition DATE NOT NULL,
    etat_resolution NVARCHAR(20),
    impact_estime NVARCHAR(20),
    commentaire NVARCHAR(255),
    FOREIGN KEY (dossier_id) REFERENCES Dossier(dossier_id)
);

CREATE TABLE Evenement (
    evenement_id INT IDENTITY(1,1) PRIMARY KEY,
    dossier_id INT NOT NULL,
    date_evenement DATETIME NOT NULL,
    type_evenement NVARCHAR(50),
    commentaire NVARCHAR(255),
    FOREIGN KEY (dossier_id) REFERENCES Dossier(dossier_id)
);