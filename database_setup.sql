CREATE TABLE Location (
	ID SERIAL PRIMARY KEY,
	Display_name VARCHAR(2000) UNIQUE,
	Coordinates POINT
);

CREATE TABLE Roles (
	ID SERIAL PRIMARY KEY,
	Name VARCHAR(100) NOT NULL,
	Is_admin BOOLEAN NOT NULL
);

CREATE TABLE Users (
  ID SERIAL PRIMARY KEY,
  Login VARCHAR(50) NOT NULL UNIQUE, -- imie.nazwisko
  Password VARCHAR(50) NOT NULL,
  Email VARCHAR(50) NOT NULL UNIQUE,
  Role_ID INTEGER NOT NULL REFERENCES Roles(ID)
);

CREATE TABLE TimeSlot (
  ID SERIAL PRIMARY KEY,
  Username VARCHAR(50) NOT NULL,
  Subcontractor VARCHAR(50) NOT NULL,
  Reserved INTEGER[] NOT NULL,
  Date DATE NOT NULL
);


-- MOCK
INSERT INTO TimeSlot (Username, Subcontractor, Reserved, Date) VALUES ('Joe', 'Test Firm', '{2, 4}', '2023-04-08')
INSERT INTO TimeSlot (Username, Subcontractor, Reserved, Date) VALUES ('Adam', 'Test Firm', '{2, 4}', '2023-04-08')

INSERT INTO Roles (Name, Is_admin) VALUES ('Admin', true);
INSERT INTO Roles (Name, Is_admin) VALUES ('Back Office', false);

INSERT INTO User (Login, Password, Email, Role_ID) VALUES ('admin', 'admin', 'admin@example.com', 1);
INSERT INTO User (Login, Password, Email, Role_ID) VALUES ('backoffice', 'bo123', 'backoffice@example.com', 2);


-- VIEWS
CREATE VIEW user_details AS
SELECT u.login, u.email, r.name AS roleName, r.is_admin AS isAdmin FROM Users u
LEFT JOIN Roles r ON u.Role_ID = r.ID


-- USEFUL
-- First, remove all rows from the table:
TRUNCATE Roles;

-- Then, reset the sequence that generates the serial values:
ALTER SEQUENCE Roles_ID_seq RESTART WITH 1;