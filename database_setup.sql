-- Tworzenie tabeli activity
CREATE TABLE activity (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- Tworzenie tabeli goal
CREATE TABLE goal (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- Tworzenie tabeli user
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL,
  height FLOAT NOT NULL,
  weight FLOAT NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(10) NOT NULL,
  activity_id INTEGER REFERENCES activity(id),
  goal_id INTEGER REFERENCES goal(id)
);

-- Tworzenie tabeli recipes
CREATE TABLE recipes (
	recipe_id SERIAL NOT NULL,
	recipe_name VARCHAR(100) NOT NULL,
	ingredients TEXT NOT NULL,
	instructions TEXT NOT NULL,
	calories INTEGER NOT NULL,
	protein INTEGER NOT NULL,
	fat INTEGER NOT NULL,
	carbs INTEGER NOT NULL
);

-- Wstawianie danych testowych do tabeli activity
INSERT INTO activity (name)
VALUES 
  ('Mała'),
  ('Średnia'),
  ('Duża');
 
-- Wstawianie danych testowych do tabeli goal
INSERT INTO goal (name)
VALUES 
  ('Chcę schudnąć'),
  ('Chcę utrzymać wagę'),
  ('Chcę przytyć');
 
-- Wstawianie danych testowych do tabeli users
INSERT INTO users (firstname, lastname, email, password, height, weight, age, gender, activity_id, goal_id)
VALUES 
  ('John', 'Doe', 'john.doe@example.com', 'password', 170, 70, 25, 'Mężczyzna', 2, 1),
  ('Jane', 'Doe', 'jane.doe@example.com', 'password', 160, 60, 30, 'Kobieta', 3, 1),
  ('Bob', 'Smith', 'bob.smith@example.com', 'password', 180, 80, 40, 'Mężczyzna', 1, 2);

 -- Wstawianie danych testowych do tabeli recipes
INSERT INTO recipes (recipe_name, ingredients, instructions, calories, protein, fat, carbs) 
VALUES 
('Pierogi ruskie', 'mąka, ziemniaki, ser biały, cebula, masło', '1. Zrobić farsz z ziemniaków i sera. 2. Wyrobić ciasto z mąki i wody. 3. Uformować pierogi i ugotować w osolonej wodzie. 4. Podsmażyć cebulę na maśle i dodać do pierogów.', 350, 10, 12, 50),
('Kotlet schabowy', 'schab, jajko, bułka tarta, mąka, sól, pieprz', '1. Rozbić mięso, posolić i popieprzyć. 2. Obtoczyć w mące, jajku i bułce tartej. 3. Smażyć na patelni z olejem na złoty kolor.', 400, 30, 20, 40),
('Sałatka Cezar', 'sałata rzymska, kurczak, pomidor, parmezan, sos Caesar', '1. Ugotować kurczaka, pokroić na kawałki. 2. Ułożyć sałatę na talerzu, dodać pomidory i kurczaka. 3. Posypać startym parmezanem i polać sosem Caesar.', 250, 20, 10, 15),
('Tortilla z kurczakiem', 'tortilla, kurczak, cebula, papryka, ser żółty', '1. Usmażyć na patelni pokrojonego kurczaka z cebulą i papryką. 2. Ułożyć farsz na tortilli, dodać starty ser. 3. Zwinąć tortillę i podgrzać na patelni.', 350, 25, 15, 40),
('Krem z dyni', 'dynia, cebula, czosnek, bulion, śmietana, oliwa', '1. Pokroić dynię, cebulę i czosnek, zeszklić na oliwie. 2. Dodać bulion i gotować do miękkości. 3. Zmiksować i dodać śmietanę. Podawać z grzankami.', 150, 5, 10, 20);

-- View do pobrania danych usera
create view user_details as
select u.id, u.firstname, u.lastname, u.email, u.password, u.height, u.weight, u.age, u.gender, a.id as activity_id, a.name as activity_name, g.id as goal_id, g.name as goal_name from users u
left join activity a on a.id=u.activity_id 
left join goal g on g.id=u.goal_id;
