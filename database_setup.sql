CREATE TYPE comment AS (
    login text,
    value text
);

CREATE TABLE FaultType ( -- na razie brak możliwości usuwania rekordów
	ID SERIAL PRIMARY KEY,
	Name VARCHAR(100) UNIQUE NOT NULL
);

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
  Password VARCHAR(50), -- logika w aplikacji jeżeli null to prompt o ustawienie
  Email VARCHAR(50) NOT NULL UNIQUE,
  Role_ID INTEGER NOT NULL REFERENCES Roles(ID)
);

CREATE TABLE Subcontractor (
  ID SERIAL PRIMARY KEY,
  Name VARCHAR(50) NOT NULL,
  City VARCHAR(50) NOT NULL,
  Location_ID INTEGER NOT NULL REFERENCES Location(ID)
);

CREATE TABLE Serviceman (
  ID SERIAL PRIMARY KEY,
  Users_ID INTEGER NOT NULL references Users(ID),
  Qualifications INTEGER[] NOT NULL,
  Subcontractor_ID INTEGER NOT null references Subcontractor(ID)
);

CREATE TABLE TimeSlot (
  ID SERIAL PRIMARY KEY,
  Serviceman_ID INTEGER NOT null references Serviceman(ID),
  Subcontractor_ID INTEGER NOT null references Subcontractor(ID),
  Reserved INTEGER[] NOT NULL, -- ref na fault type
  Date timestamp NOT NULL
);

CREATE TABLE Customer (
  ID SERIAL PRIMARY KEY,
  Full_name VARCHAR(50) NOT NULL, -- Imie Nazwisko
  Password VARCHAR(50),
  Phone VARCHAR(12) NOT NULL UNIQUE,
  Email VARCHAR(50) NOT NULL UNIQUE,
  City VARCHAR(50) NOT NULL,
  Location_ID INTEGER NOT NULL REFERENCES Location(ID),
  Contract_start DATE NOT null,
  Contract_end DATE NOT NULL
);

CREATE TABLE SlotHour (
	ID SERIAL PRIMARY KEY,
	Value VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE FaultStatus (
	ID SERIAL PRIMARY KEY,
	Name VARCHAR(100) UNIQUE NOT NULL,
  Result VARCHAR(30) NOT NULL -- success, to replan, cancelled
);

CREATE TABLE Fault (
  ID SERIAL PRIMARY KEY,
  Customer_ID INTEGER NOT NULL REFERENCES Customer(ID),
  RequestDate timestamp NOT NULL,
  Description VARCHAR(500) NOT NULL,
  FaultType_ID INTEGER NOT NULL REFERENCES FaultType(ID),
  TimeSlot_ID INTEGER NOT NULL REFERENCES TimeSlot(ID),
  Comments comment[],
  SlotHour_ID INTEGER NOT NULL REFERENCES SlotHour(ID),
  IsActive BOOLEAN NOT NULL,
  FaultStatus_ID INTEGER REFERENCES FaultStatus(ID)
);

-- MOCK
INSERT INTO SlotHour (Value)
VALUES
  ('7-9'),
  ('9-11'),
  ('11-13'),
  ('13-15'),
  ('15-17'),
  ('17-19'),
  ('19-21');

INSERT INTO FaultStatus (Name, Result)
VALUES 
  ('skutecznie', 'completed'),
  ('przekazanie do innego działu', 'completed'),
  ('nieskutecznie', 'failed');

INSERT INTO FaultType (Name) VALUES ('Uszkodzenie okablowania w lokalu');
INSERT INTO FaultType (Name) VALUES ('Uszkodzenie okablowania na posesji');

INSERT INTO Roles (Name, Is_admin) VALUES ('Admin', true);
INSERT INTO Roles (Name, Is_admin) VALUES ('Back Office', false);
INSERT INTO Roles (Name, Is_admin) VALUES ('Serviceman', false);
-- INSERT INTO TimeSlot (Username, Subcontractor, Reserved, Date) VALUES ('Joe', 'Test Firm', '{2, 4}', '2023-04-08');
-- INSERT INTO TimeSlot (Username, Subcontractor, Reserved, Date) VALUES ('Adam', 'Test Firm', '{2, 4}', '2023-04-08');
INSERT INTO TimeSlot (Serviceman_ID, Subcontractor_ID, Reserved, Date) VALUES (1, 1, '{2, 4}', '2023-04-08');



INSERT INTO Users (Login, Password, Email, Role_ID) VALUES ('admin', 'admin', 'admin@example.com', 1);
INSERT INTO Users (Login, Password, Email, Role_ID) VALUES ('backoffice', 'bo123', 'backoffice@example.com', 2);
INSERT INTO Users (Login, Password, Email, Role_ID) VALUES ('pawel.kowal', 'pk', 'pawel.kowal@example.com', 3);
INSERT INTO Users (Login, Password, Email, Role_ID) VALUES ('testeusz.idk', 'ti', 'testeusz.idk@example.com', 3);
INSERT INTO Users (Login, Password, Email, Role_ID) VALUES ('maciej.pizza', 'mp', 'maciej.pizza@example.com', 3);

INSERT INTO serviceman (users_id , qualifications , subcontractor_id) VALUES (3, '{1}', 1);
INSERT INTO serviceman (users_id , qualifications , subcontractor_id) VALUES (4, '{1,2}', 1);
INSERT INTO serviceman (users_id , qualifications , subcontractor_id) VALUES (5, '{1,2}', 2);

insert into subcontractor (Name, City, Location_ID) values ('KFC TEST', 'Sulejówek', 2);
insert into subcontractor (Name, City, Location_ID) values ('Klimat', 'Wesoła', 6);

INSERT INTO Customer (Full_name, Password, Phone, Email, City, Location_ID, Contract_start, Contract_end)
VALUES ('Anna Kowalska', 'password123', '555-123-456', 'anna.kowalska@example.com', 'Sulejówek', 5, '2022-01-01', '2022-12-31'),
       ('Piotr Nowak', 'securepassword', '555-987-654', 'piotr.nowak@example.com', 'Warszawa', 6, '2022-02-01', '2022-11-30');

-- VIEWS
CREATE OR REPLACE VIEW user_details AS
SELECT u.login, u.email, r.id AS roleId, r.name AS roleName, r.is_admin AS isAdmin FROM Users u
LEFT JOIN Roles r ON u.Role_ID = r.ID;

CREATE OR REPLACE VIEW customer_details as
select c.id, c.full_name, c.phone, c.email, c.city, l.display_name, l.coordinates,
c.contract_start, c.contract_end from customer c
left join "location" l on l.id = c.location_id ;

CREATE OR REPLACE VIEW v_main_grid as
select t.id as id, u.login as username, s2."name" as subcontractor, t.reserved, t."date"  from timeslot t 
left join serviceman s on s.id = t.serviceman_id 
left join subcontractor s2 on t.subcontractor_id = s2.id 
left join users u on u.id = s.users_id ;


-- POCEDURES
CREATE OR REPLACE PROCEDURE remove_svm (svm_id INT, OUT userId INT)
    LANGUAGE plpgsql
    AS $$
    BEGIN
      SELECT users_id into userId FROM serviceman WHERE id = svm_id;
      DELETE FROM timeslot where serviceman_id = svm_id;
      DELETE FROM serviceman where id = svm_id;
      DELETE FROM users WHERE id = userId;
    END;
    $$;
-- nie można usunąć jak ma zlecenia dlatego można opracować system archiwizacji zleceń tak aby czyścić tabele fault i np. pytać czy usunąć auto po archiwizacji tabeli