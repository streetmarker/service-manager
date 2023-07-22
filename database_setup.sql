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
  Role_ID INTEGER NOT NULL REFERENCES Roles(ID),
  isActive bool NULL DEFAULT true
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

CREATE TABLE OperationsLogs (
    LogID SERIAL PRIMARY KEY,
    TableName VARCHAR(50) NOT NULL,
    Action VARCHAR(10) NOT NULL,
    ActionDate TIMESTAMP NOT NULL,
    OldData JSONB,
    NewData JSONB
);

-- DICT
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
  ('w trakcie', 'inprogress'),
  ('przekazanie do innego działu', 'completed'),
  ('nieskutecznie', 'failed');

INSERT INTO FaultType (Name) VALUES ('Uszkodzenie okablowania w lokalu');
INSERT INTO FaultType (Name) VALUES ('Uszkodzenie okablowania na posesji');

INSERT INTO Roles (Name, Is_admin) VALUES ('Admin', true);
INSERT INTO Roles (Name, Is_admin) VALUES ('Back Office', false);
INSERT INTO Roles (Name, Is_admin) VALUES ('Serviceman', false);

-- MOCK
-- INSERT INTO TimeSlot (Username, Subcontractor, Reserved, Date) VALUES ('Joe', 'Test Firm', '{2, 4}', '2023-04-08');
-- INSERT INTO TimeSlot (Username, Subcontractor, Reserved, Date) VALUES ('Adam', 'Test Firm', '{2, 4}', '2023-04-08');
-- INSERT INTO TimeSlot (Serviceman_ID, Subcontractor_ID, Reserved, Date) VALUES (1, 1, '{2, 4}', '2023-04-08');



INSERT INTO Users (Login, Password, Email, Role_ID) VALUES ('admin', '123', 'admin@example.com', 1);
INSERT INTO Users (Login, Password, Email, Role_ID) VALUES ('backoffice', '123', 'backoffice@example.com', 2);
-- INSERT INTO Users (Login, Password, Email, Role_ID) VALUES ('pawel.kowal', '123', 'pawel.kowal@example.com', 3);
-- INSERT INTO Users (Login, Password, Email, Role_ID) VALUES ('testeusz.idk', '123', 'testeusz.idk@example.com', 3);
-- INSERT INTO Users (Login, Password, Email, Role_ID) VALUES ('maciej.pizza', '123', 'maciej.pizza@example.com', 3);

-- INSERT INTO serviceman (users_id , qualifications , subcontractor_id) VALUES (3, '{1}', 1);
-- INSERT INTO serviceman (users_id , qualifications , subcontractor_id) VALUES (4, '{1,2}', 1);
-- INSERT INTO serviceman (users_id , qualifications , subcontractor_id) VALUES (5, '{1,2}', 2);

-- insert into subcontractor (Name, City, Location_ID) values ('KFC TEST', 'Sulejówek', 2);
-- insert into subcontractor (Name, City, Location_ID) values ('Klimat', 'Wesoła', 6);

-- INSERT INTO Customer (Full_name, Password, Phone, Email, City, Location_ID, Contract_start, Contract_end)
-- VALUES ('Anna Kowalska', '123', '555-123-456', 'anna.kowalska@example.com', 'Sulejówek', 5, '2022-01-01', '2022-12-31'),
--        ('Piotr Nowak', '123', '555-987-654', 'piotr.nowak@example.com', 'Warszawa', 6, '2022-02-01', '2022-11-30');

-- VIEWS
CREATE OR REPLACE VIEW user_details AS
SELECT u.id, u.login, u.email, s.id as svmId, r.id AS roleId, r.name AS roleName, r.is_admin AS isAdmin FROM Users u
LEFT JOIN Serviceman s ON u.id = s.users_id
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

-- FUNCTIONS

CREATE OR REPLACE FUNCTION get_comments_by_id(fault_id integer)
  RETURNS TABLE (id integer, login text, value text)
  AS $$
  BEGIN
    RETURN QUERY
      select
      f.id ,
      comment.login AS login,
      comment.value AS value
      FROM
        fault f,
        unnest(f.comments) AS comment
      WHERE
        f.id = fault_id;
  END;
  $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION deactivateFault()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT Result FROM FaultStatus WHERE ID = NEW.FaultStatus_ID) = 'completed' THEN
    UPDATE Fault SET IsActive = false WHERE ID = NEW.ID;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION logAction() RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO OperationsLogs (TableName, Action, ActionDate, OldData)
        VALUES (TG_TABLE_NAME, 'DELETE', NOW(), row_to_json(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO OperationsLogs (TableName, Action, ActionDate, OldData, NewData)
        VALUES (TG_TABLE_NAME, 'UPDATE', NOW(), row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO OperationsLogs (TableName, Action, ActionDate, NewData)
        VALUES (TG_TABLE_NAME, 'INSERT', NOW(), row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- PROCEDURES
CREATE OR REPLACE PROCEDURE remove_svm (svm_id INT, OUT userId INT, out result TEXT)
    LANGUAGE plpgsql
    AS $$
    BEGIN
      SELECT users_id into userId FROM serviceman WHERE id = svm_id;
      update users set isactive = false where id = userId;
      DELETE FROM timeslot where serviceman_id = svm_id and reserved = '{}';
--      DELETE FROM serviceman where id = svm_id;
--      DELETE FROM users WHERE id = userId;
     EXCEPTION WHEN SQLSTATE '23503' then result = 'Nie można usunąć rekordu';
    END;
    $$;
-- NIEAKTUALNE nie można usunąć jak ma zlecenia dlatego można opracować system archiwizacji zleceń tak aby czyścić tabele fault i np. pytać czy usunąć auto po archiwizacji tabeli
-- AKTUALNIE usuwamy puste timesloty dla svm i ustawiamy flagę isactive

-- TRIGGERS

CREATE TRIGGER t_deactivateFault
AFTER UPDATE ON Fault
FOR EACH ROW
WHEN (OLD.FaultStatus_ID IS DISTINCT FROM NEW.FaultStatus_ID)
EXECUTE FUNCTION deactivateFault();

CREATE TRIGGER t_log_action
AFTER INSERT OR UPDATE OR DELETE ON Fault
FOR EACH ROW
EXECUTE FUNCTION logAction();

-- DROP
-- Remove the views
DROP VIEW IF EXISTS user_details CASCADE;
DROP VIEW IF EXISTS customer_details CASCADE;
DROP VIEW IF EXISTS v_main_grid CASCADE;

-- Remove the trigger
DROP TRIGGER IF EXISTS t_deactivateFault ON Fault;

-- Remove the function
DROP FUNCTION IF EXISTS deactivateFault();

-- Remove the tables in the correct order
DROP TABLE IF EXISTS Fault CASCADE;
DROP TABLE IF EXISTS TimeSlot CASCADE;
DROP TABLE IF EXISTS Serviceman CASCADE;
DROP TABLE IF EXISTS Subcontractor CASCADE;
DROP TABLE IF EXISTS Customer CASCADE;
DROP TABLE IF EXISTS FaultStatus CASCADE;
DROP TABLE IF EXISTS SlotHour CASCADE;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Roles CASCADE;
DROP TABLE IF EXISTS Location CASCADE;
DROP TABLE IF EXISTS FaultType CASCADE;





INSERT INTO Location (Display_name, Coordinates)
values
('Aleja Jana Pawła II 10, Śródmieście', point(52.230417,21.005853)),
('Ul. Chmielna 25, Śródmieście', point(52.232693,21.017216)),
('Plac Trzech Krzyży 3, Śródmieście', point(52.229294,21.023076)),
('Ul. Marszałkowska 140, Ochota', point(52.217097,20.995671)),
('Al. Jerozolimskie 65/79, Wola', point(52.225825,20.981721)),
('Ul. Nowy Świat 22, Śródmieście', point(52.238431,21.017075)),
('Plac Konstytucji 1, Śródmieście', point(52.222345,21.015891)),
('Ul. Puławska 2, Mokotów', point(52.212203,21.026603)),
('Aleje Ujazdowskie 7, Śródmieście', point(52.217711,21.031541)),
('Ul. Wilcza 46, Śródmieście', point(52.222189,21.014247)),
('Plac Zamkowy 4, Śródmieście', point(52.248349,21.014620)),
('Al. Solidarności 64, Praga-Północ', point(52.251342,21.042543)),
('Ul. Grzybowska 63, Wola', point(52.232211,20.992854)),
('Plac Wilsona 1, Żoliborz', point(52.254943,20.984786)),
('Ul. Hoża 51, Śródmieście', point(52.228383,21.020404)),
('Niepodległości 101, Mokotów', point(52.214783,21.011647)),
('Ul. Krucza 16, Śródmieście', point(52.230989,21.017855)),
('Plac Bankowy 2, Śródmieście', point(52.249337,21.013431)),
('Ul. Belwederska 9, Mokotów', point(52.212638,21.035927)),
('Aleje Jerozolimskie 44, Śródmieście', point(52.228702,21.004316)),
('Ul. Grójecka 186, Ochota', point(52.214894,20.982371)),
('Plac Defilad 1, Śródmieście', point(52.232993,21.006792)),
('Ul. Górczewska 124, Wola', point(52.229615,20.947139)),
('Al. Niepodległości 18, Śródmieście', point(52.226582,21.002477)),
('Ul. Rakowiecka 37, Mokotów', point(52.201953,21.018687)),
('Plac Piłsudskiego 1, Śródmieście', point(52.237049,21.015252)),
('Ul. Nowowiejska 1/3, Żoliborz', point(52.256543,20.992551)),
('Aleja Wyzwolenia 18, Ochota', point(52.219786,20.985581)),
('Ul. Marsa 56, Wola', point(52.231399,20.965134)),
('Plac Zbawiciela 1, Śródmieście', point(52.218378,21.023175)),
('Ul. Targowa 54, Praga-Południe', point(52.251839,21.036470)),
('Aleja Róż 1, Mokotów', point(52.190221,21.013629)),
('Ul. Świętokrzyska 14, Śródmieście', point(52.229089,21.005799)),
('Plac Na Rozdrożu 2, Białołęka', point(52.312679,20.979458)),
('Ul. Tamka 49, Śródmieście', point(52.243904,21.006332)),
('Aleja Armii Ludowej 16, Mokotów', point(52.204987,21.020978)),
('Ul. Andersa 5, Żoliborz', point(52.259798,20.981485)),
('Plac Artura Zawiszy 1, Wola', point(52.234513,20.972681)),
('Ul. Puławska 104, Mokotów', point(52.214863,21.010899)),
('Al. Jana Pawła II 80, Wola', point(52.229508,20.970820))


insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Deane Roiz', 123, '633-196-8012', 'droiz3@theglobeandmail.com', 4, 'Warszawa', '19/02/2023', '22/11/2023');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Carmelia Baudoux', 123, '459-232-2516', 'cbaudoux4@creativecommons.org', 5, 'Warszawa', '30/12/2022', '04/08/2022');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Morgen Loyd', 123, '546-864-3039', 'mloyd5@elpais.com', 6, 'Warszawa', '23/11/2022', '25/01/2024');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Evaleen Terrans', 123, '611-394-8243', 'eterrans6@nba.com', 7, 'Warszawa', '31/10/2022', '28/09/2022');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Karoly Rumney', 123, '606-482-3551', 'krumney7@who.int', 8, 'Warszawa', '25/01/2023', '19/08/2022');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Karyn Donegan', 123, '399-315-0491', 'kdonegan8@weebly.com', 9, 'Warszawa', '29/09/2022', '12/12/2023');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Alphard MacCurley', 123, '204-940-4402', 'amaccurley9@columbia.edu', 10, 'Warszawa', '07/08/2022', '05/09/2022');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Elisa Dunstone', 123, '606-560-4079', 'edunstonea@engadget.com', 11, 'Warszawa', '09/01/2023', '11/04/2023');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Haydon Shanks', 123, '555-459-4614', 'hshanksb@discovery.com', 12, 'Warszawa', '11/10/2022', '15/02/2023');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Milena Hanwright', 123, '742-688-9622', 'mhanwrightc@npr.org', 13, 'Warszawa', '06/08/2022', '26/09/2023');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Hadrian Boner', 123, '769-331-9324', 'hbonerd@businesswire.com', 14, 'Warszawa', '13/01/2023', '16/11/2023');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Lura Beachamp', 123, '599-888-4600', 'lbeachampe@sphinn.com', 15, 'Warszawa', '21/09/2022', '14/12/2023');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Lew Burchell', 123, '775-456-2408', 'lburchellf@craigslist.org', 16, 'Warszawa', '22/04/2023', '03/08/2023');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Seward Masterton', 123, '337-723-1649', 'smastertong@reference.com', 17, 'Warszawa', '20/03/2023', '03/12/2022');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Ragnar Skurm', 123, '828-172-3547', 'rskurmh@vkontakte.ru', 18, 'Warszawa', '21/03/2023', '01/01/2023');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Hansiain Vampouille', 123, '361-411-3610', 'hvampouillei@amazon.co.uk', 19, 'Warszawa', '23/08/2022', '26/12/2023');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Minnaminnie Farrent', 123, '566-869-1174', 'mfarrentj@nymag.com', 20, 'Warszawa', '27/07/2022', '30/05/2023');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Kit Crafter', 123, '588-931-8140', 'kcrafterk@wikia.com', 21, 'Warszawa', '18/11/2022', '15/09/2023');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Noni Zorzutti', 123, '795-698-3655', 'nzorzuttil@nbcnews.com', 22, 'Warszawa', '11/07/2022', '24/12/2023');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Darryl Berks', 123, '709-869-2864', 'dberksm@pagesperso-orange.fr', 23, 'Warszawa', '24/08/2022', '25/09/2023');
insert into customer (full_name, password, phone, email, location_id, City, contract_start, contract_end) values ('Juliana Greenhead', 123, '473-963-3489', 'jgreenheadn@va.gov', 24, 'Warszawa', '01/04/2023', '01/06/2024');

insert into subcontractor (Name, City, Location_ID) values ('FiberTech Services', 'Warszawa', 25);
insert into subcontractor (Name, City, Location_ID) values ('OptiNet Solutions', 'Warszawa', 26);
insert into subcontractor (Name, City, Location_ID) values ('FiberConnect Pro', 'Warszawa', 27);
insert into subcontractor (Name, City, Location_ID) values ('SpeedLink Communications', 'Warszawa', 28);
insert into subcontractor (Name, City, Location_ID) values ('FiberCare Experts', 'Warszawa', 29);
insert into subcontractor (Name, City, Location_ID) values ('OptiFusion Technologies', 'Warszawa', 30);
insert into subcontractor (Name, City, Location_ID) values ('FiberWorks Solutions', 'Warszawa', 31);
insert into subcontractor (Name, City, Location_ID) values ('UltraNet Services', 'Warszawa', 32);
insert into subcontractor (Name, City, Location_ID) values ('FiberLink Maintenance', 'Warszawa', 33);
insert into subcontractor (Name, City, Location_ID) values ('SwiftFiber Solutions', 'Warszawa', 34);

insert into users (login, password, email, role_id) values ('karina eede', 123, 'keede0@hexun.com', 3);
insert into users (login, password, email, role_id) values ('manda dymocke', 123, 'mdymocke1@cnet.com', 3);
insert into users (login, password, email, role_id) values ('staford ellick', 123, 'sellick2@studiopress.com', 3);
insert into users (login, password, email, role_id) values ('hadria wands', 123, 'hwands3@npr.org', 3);
insert into users (login, password, email, role_id) values ('ninette schooling', 123, 'nschooling4@earthlink.net', 3);
insert into users (login, password, email, role_id) values ('laraine le quesne', 123, 'lle5@ucla.edu', 3);
insert into users (login, password, email, role_id) values ('yoshi waple', 123, 'ywaple6@wikia.com', 3);
insert into users (login, password, email, role_id) values ('sheela stoffel', 123, 'sstoffel7@blogger.com', 3);
insert into users (login, password, email, role_id) values ('barth bortolozzi', 123, 'bbortolozzi8@mlb.com', 3);
insert into users (login, password, email, role_id) values ('nat creser', 123, 'ncreser9@rakuten.co.jp', 3);
insert into users (login, password, email, role_id) values ('gerrie nozzolinii', 123, 'gnozzoliniia@usa.gov', 3);
insert into users (login, password, email, role_id) values ('martha hyndley', 123, 'mhyndleyb@hhs.gov', 3);
insert into users (login, password, email, role_id) values ('cammy bruyet', 123, 'cbruyetc@yellowbook.com', 3);
insert into users (login, password, email, role_id) values ('lek cawse', 123, 'lcawsed@comcast.net', 3);
insert into users (login, password, email, role_id) values ('nicola civitillo', 123, 'ncivitilloe@usgs.gov', 3);
insert into users (login, password, email, role_id) values ('alberik humpherson', 123, 'ahumphersonf@netlog.com', 3);
insert into users (login, password, email, role_id) values ('gustie winfrey', 123, 'gwinfreyg@merriam-webster.com', 3);
insert into users (login, password, email, role_id) values ('tina burtwhistle', 123, 'tburtwhistleh@1688.com', 3);
insert into users (login, password, email, role_id) values ('hilary stadden', 123, 'hstaddeni@usatoday.com', 3);
insert into users (login, password, email, role_id) values ('alla meldon', 123, 'ameldonj@histats.com', 3);
insert into users (login, password, email, role_id) values ('benny charrisson', 123, 'bcharrissonk@discuz.net', 3);
insert into users (login, password, email, role_id) values ('adah richt', 123, 'arichtl@techcrunch.com', 3);
insert into users (login, password, email, role_id) values ('baxie lowes', 123, 'blowesm@amazon.com', 3);
insert into users (login, password, email, role_id) values ('hubey hukin', 123, 'hhukinn@amazonaws.com', 3);
insert into users (login, password, email, role_id) values ('lalo reckus', 123, 'lreckuso@scientificamerican.com', 3);
insert into users (login, password, email, role_id) values ('batholomew duckinfield', 123, 'bduckinfieldp@bing.com', 3);
insert into users (login, password, email, role_id) values ('keefe pashler', 123, 'kpashlerq@yellowpages.com', 3);
insert into users (login, password, email, role_id) values ('gracia swindell', 123, 'gswindellr@seattletimes.com', 3);
insert into users (login, password, email, role_id) values ('cristine matzaitis', 123, 'cmatzaitiss@wired.com', 3);
insert into users (login, password, email, role_id) values ('bryant kelsell', 123, 'bkelsellt@sakura.ne.jp', 3);
insert into users (login, password, email, role_id) values ('kizzie allenby', 123, 'kallenbyu@prweb.com', 3);
insert into users (login, password, email, role_id) values ('gnni dyton', 123, 'gdytonv@sfgate.com', 3);
insert into users (login, password, email, role_id) values ('jemmie carnie', 123, 'jcarniew@wikia.com', 3);
insert into users (login, password, email, role_id) values ('maggee brashier', 123, 'mbrashierx@umn.edu', 3);
insert into users (login, password, email, role_id) values ('nicolis dorkens', 123, 'ndorkensy@last.fm', 3);
insert into users (login, password, email, role_id) values ('ellynn dillingham', 123, 'edillinghamz@rakuten.co.jp', 3);
insert into users (login, password, email, role_id) values ('lulu dodshun', 123, 'ldodshun10@hugedomains.com', 3);
insert into users (login, password, email, role_id) values ('martina tinmouth', 123, 'mtinmouth11@smh.com.au', 3);
insert into users (login, password, email, role_id) values ('val willoughley', 123, 'vwilloughley12@drupal.org', 3);
insert into users (login, password, email, role_id) values ('conn cassey', 123, 'ccassey13@mlb.com', 3);

insert into serviceman (users_id, qualifications, subcontractor_id) values (1, '{1,2}', 6);
insert into serviceman (users_id, qualifications, subcontractor_id) values (2, '{1,2}', 10);
insert into serviceman (users_id, qualifications, subcontractor_id) values (3, '{1,2}', 12);
insert into serviceman (users_id, qualifications, subcontractor_id) values (4, '{1,2}', 2);
insert into serviceman (users_id, qualifications, subcontractor_id) values (5, '{1,2}', 11);
insert into serviceman (users_id, qualifications, subcontractor_id) values (6, '{1,2}', 8);
insert into serviceman (users_id, qualifications, subcontractor_id) values (7, '{1,2}', 1);
insert into serviceman (users_id, qualifications, subcontractor_id) values (8, '{1,2}', 1);
insert into serviceman (users_id, qualifications, subcontractor_id) values (9, '{1,2}', 1);
insert into serviceman (users_id, qualifications, subcontractor_id) values (10, '{1,2}', 12);
insert into serviceman (users_id, qualifications, subcontractor_id) values (11, '{1,2}', 3);
insert into serviceman (users_id, qualifications, subcontractor_id) values (12, '{1,2}', 1);
insert into serviceman (users_id, qualifications, subcontractor_id) values (13, '{1,2}', 2);
insert into serviceman (users_id, qualifications, subcontractor_id) values (14, '{1,2}', 12);
insert into serviceman (users_id, qualifications, subcontractor_id) values (15, '{1,2}', 10);
insert into serviceman (users_id, qualifications, subcontractor_id) values (16, '{1,2}', 8);
insert into serviceman (users_id, qualifications, subcontractor_id) values (17, '{1,2}', 5);
insert into serviceman (users_id, qualifications, subcontractor_id) values (18, '{1,2}', 11);
insert into serviceman (users_id, qualifications, subcontractor_id) values (19, '{1,2}', 12);
insert into serviceman (users_id, qualifications, subcontractor_id) values (20, '{1,2}', 9);
insert into serviceman (users_id, qualifications, subcontractor_id) values (21, '{1,2}', 12);
insert into serviceman (users_id, qualifications, subcontractor_id) values (22, '{1,2}', 5);
insert into serviceman (users_id, qualifications, subcontractor_id) values (23, '{1,2}', 12);
insert into serviceman (users_id, qualifications, subcontractor_id) values (24, '{1,2}', 9);
insert into serviceman (users_id, qualifications, subcontractor_id) values (25, '{1,2}', 5);
insert into serviceman (users_id, qualifications, subcontractor_id) values (26, '{1,2}', 12);
insert into serviceman (users_id, qualifications, subcontractor_id) values (27, '{1,2}', 10);
insert into serviceman (users_id, qualifications, subcontractor_id) values (28, '{1,2}', 5);
insert into serviceman (users_id, qualifications, subcontractor_id) values (29, '{1,2}', 9);
insert into serviceman (users_id, qualifications, subcontractor_id) values (30, '{1,2}', 7);
insert into serviceman (users_id, qualifications, subcontractor_id) values (31, '{1,2}', 7);
insert into serviceman (users_id, qualifications, subcontractor_id) values (32, '{1,2}', 3);
insert into serviceman (users_id, qualifications, subcontractor_id) values (33, '{1,2}', 3);
insert into serviceman (users_id, qualifications, subcontractor_id) values (34, '{1,2}', 1);
insert into serviceman (users_id, qualifications, subcontractor_id) values (35, '{1,2}', 4);
insert into serviceman (users_id, qualifications, subcontractor_id) values (36, '{1,2}', 8);
insert into serviceman (users_id, qualifications, subcontractor_id) values (37, '{1,2}', 6);
insert into serviceman (users_id, qualifications, subcontractor_id) values (38, '{1,2}', 3);
insert into serviceman (users_id, qualifications, subcontractor_id) values (39, '{1,2}', 5);
insert into serviceman (users_id, qualifications, subcontractor_id) values (40, '{1,2}', 5);