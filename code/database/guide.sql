How to configure DB:

############################           [Step 1] : Run this to create DB tables and constraints           ############################

CREATE TABLE Specialty (
    id_Specialty SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE Institution (
    id_Institution SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    state BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Company (
    id_Company SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    state BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Contact (
    id_Contact SERIAL PRIMARY KEY,
    email VARCHAR NULL,
    phone VARCHAR NULL,
    state BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE District (
    id_District SERIAL PRIMARY KEY,
    state BOOLEAN NOT NULL DEFAULT TRUE,
    name VARCHAR NOT NULL
);

CREATE TABLE Region (
    id_Region SERIAL PRIMARY KEY,
    state BOOLEAN NOT NULL DEFAULT TRUE,
    name VARCHAR NOT NULL
);

CREATE TABLE Town (
    id_Town SERIAL PRIMARY KEY,
    state BOOLEAN NOT NULL DEFAULT TRUE,
    name VARCHAR NOT NULL
);

CREATE TABLE Doctor (
    professional_id_card INTEGER PRIMARY KEY,
    state BOOLEAN NOT NULL DEFAULT TRUE,
    name VARCHAR NOT NULL
);

CREATE TABLE Delegate (
    id_Delegate SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    registry_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    state BOOLEAN NOT NULL DEFAULT TRUE,
    fk_id_Contact INTEGER NULL,

	CONSTRAINT fk_id_Contact FOREIGN KEY (fk_id_Contact) REFERENCES Contact(id_Contact) ON DELETE NO ACTION
);


CREATE TABLE HMR_Zone (
    brick INTEGER PRIMARY KEY,
    state BOOLEAN NOT NULL DEFAULT TRUE,
    fk_id_Delegate INTEGER NULL,
    fk_id_Region INTEGER NOT NULL,
    fk_id_District INTEGER NOT NULL,
	fk_id_Town INTEGER NULL,

	CONSTRAINT fk_id_Delegate FOREIGN KEY (fk_id_Delegate) REFERENCES Delegate(id_Delegate) ON DELETE NO ACTION,
	CONSTRAINT fk_id_Region FOREIGN KEY (fk_id_Region) REFERENCES Region(id_Region) ON DELETE NO ACTION,
	CONSTRAINT fk_id_District FOREIGN KEY (fk_id_District) REFERENCES District(id_District) ON DELETE NO ACTION,
	CONSTRAINT fk_id_Town FOREIGN KEY (fk_id_Town) REFERENCES Town(id_Town) ON DELETE NO ACTION
);


CREATE TABLE Address (
    id_Address SERIAL PRIMARY KEY,
    street VARCHAR NOT NULL,
    zip_code VARCHAR NOT NULL,
    building VARCHAR NULL,
    state BOOLEAN NOT NULL DEFAULT TRUE,
    fk_brick INTEGER NOT NULL,

	CONSTRAINT fk_brick FOREIGN KEY (fk_brick) REFERENCES HMR_Zone(brick) ON DELETE NO ACTION
);

CREATE TABLE Representative (
    id_Representative SERIAL PRIMARY KEY,
    notes VARCHAR NULL,
    name VARCHAR NOT NULL,
    state BOOLEAN NOT NULL DEFAULT TRUE,
    fk_id_Contact INTEGER NOT NULL,

	CONSTRAINT fk_id_Contact FOREIGN KEY (fk_id_Contact) REFERENCES Contact(id_Contact) ON DELETE NO ACTION
);

CREATE TABLE Pharmacy (
    id_Pharmacy SERIAL PRIMARY KEY,
    state BOOLEAN NOT NULL DEFAULT TRUE,
    registry_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes VARCHAR NULL,
    name VARCHAR NOT NULL,
	fk_id_Address INTEGER NULL,
	fk_id_Representative INTEGER NOT NULL,
	
	CONSTRAINT fk_Address FOREIGN KEY (fk_id_Address) REFERENCES Address(id_Address) ON DELETE NO ACTION,
	CONSTRAINT fk_id_Representative FOREIGN KEY (fk_id_Representative) REFERENCES Representative(id_Representative) ON DELETE NO ACTION
);

CREATE TABLE Visit (
    id_Visit SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    visit_state INTEGER NOT NULL,
    fk_brick INTEGER NOT NULL,
    fk_Doctor INTEGER NULL,
    fk_Pharmacy INTEGER NULL,

	
	CONSTRAINT fk_brick FOREIGN KEY (fk_brick) REFERENCES HMR_Zone(brick) ON DELETE NO ACTION,
	CONSTRAINT fk_Doctor FOREIGN KEY (fk_Doctor) REFERENCES Doctor(professional_id_card) ON DELETE NO ACTION,
	CONSTRAINT fk_Pharmacy FOREIGN KEY (fk_Pharmacy) REFERENCES Pharmacy(id_Pharmacy) ON DELETE NO ACTION,
	CHECK (
        (fk_Doctor IS NOT NULL AND fk_Pharmacy IS NULL) OR 
        (fk_Doctor IS NULL AND fk_Pharmacy IS NOT NULL)
    )
);

CREATE TABLE Product (
    CNP INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    ingredients VARCHAR NULL,
    how_to_consume VARCHAR NULL,
    properties VARCHAR NULL,
    amount VARCHAR NULL,
    state BOOLEAN NOT NULL DEFAULT TRUE,
    fk_id_Company INTEGER NULL,
	
	CONSTRAINT fk_id_Company FOREIGN KEY (fk_id_Company) REFERENCES Company(id_Company) ON DELETE NO ACTION
);

CREATE TABLE Sale (
    id_Sale SERIAL PRIMARY KEY,
    notes VARCHAR NULL,
    registry_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fk_brick INTEGER NULL,
    fk_Doctor INTEGER NULL,
    fk_Pharmacy INTEGER NULL,
	
	CONSTRAINT fk_brick FOREIGN KEY (fk_brick) REFERENCES HMR_Zone(brick) ON DELETE NO ACTION,
	CONSTRAINT fk_Doctor FOREIGN KEY (fk_Doctor) REFERENCES Doctor(professional_id_card) ON DELETE NO ACTION,
	CONSTRAINT fk_Pharmacy FOREIGN KEY (fk_Pharmacy) REFERENCES Pharmacy(id_Pharmacy) ON DELETE NO ACTION
);


CREATE TABLE Manager (
    id_Manager SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    fk_id_Company INTEGER,

	CONSTRAINT fk_id_Company FOREIGN KEY (fk_id_Company) REFERENCES Company(id_Company) ON DELETE NO ACTION
);

CREATE TABLE Doctor_Activity (
    id_Activity SERIAL PRIMARY KEY,
    registry_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    state BOOLEAN NOT NULL DEFAULT TRUE,
    notes VARCHAR NULL,
    fk_id_Address INTEGER NULL,
    fk_Doctor INTEGER NOT NULL,
    fk_id_Contact INTEGER NULL,
    fk_id_Institution INTEGER NULL,
    fk_id_Specialty INTEGER NULL,

	CONSTRAINT fk_Address FOREIGN KEY (fk_id_Address) REFERENCES Address(id_Address) ON DELETE NO ACTION,
	CONSTRAINT fk_Doctor FOREIGN KEY (fk_Doctor) REFERENCES Doctor(professional_id_card) ON DELETE NO ACTION,
	CONSTRAINT fk_id_Contact FOREIGN KEY (fk_id_Contact) REFERENCES Contact(id_Contact) ON DELETE NO ACTION,
	CONSTRAINT fk_id_Institution FOREIGN KEY (fk_id_Institution) REFERENCES Institution(id_Institution) ON DELETE NO ACTION,
	CONSTRAINT fk_id_Specialty FOREIGN KEY (fk_id_Specialty) REFERENCES Specialty(id_Specialty) ON DELETE NO ACTION
);

CREATE TABLE Sale_Product (
    fk_id_Sale INTEGER NOT NULL,
    fk_CNP INTEGER NOT NULL,
    bonus VARCHAR NULL,
    product_amount INTEGER NOT NULL CHECK (product_amount >= 0),

	CONSTRAINT fk_id_Sale FOREIGN KEY (fk_id_Sale) REFERENCES Sale(id_Sale) ON DELETE NO ACTION,
	CONSTRAINT fk_CNP FOREIGN KEY (fk_CNP) REFERENCES Product(CNP) ON DELETE NO ACTION
);

ALTER TABLE delegate ADD CONSTRAINT unique_delegate_name UNIQUE (name);

ALTER TABLE region ADD CONSTRAINT unique_region_name UNIQUE (name);

ALTER TABLE district ADD CONSTRAINT unique_district_name UNIQUE (name);

ALTER TABLE town ADD CONSTRAINT unique_town_name UNIQUE (name);

ALTER TABLE company ADD CONSTRAINT unique_company_name UNIQUE (name);

ALTER TABLE product ADD CONSTRAINT unique_product_company UNIQUE (name, fk_id_company);

ALTER TABLE Contact ADD CONSTRAINT unique_email_phone UNIQUE (email, phone);

ALTER TABLE Doctor ADD CONSTRAINT unique_doctor_name_contact UNIQUE (professional_id_card,name);

ALTER TABLE Address ADD CONSTRAINT unique_address UNIQUE (street, zip_code, building);

ALTER TABLE Representative ADD CONSTRAINT unique_representative UNIQUE (name, fk_id_Contact);

ALTER TABLE Pharmacy ADD CONSTRAINT unique_pharmacy UNIQUE (name, fk_id_Address, fk_id_Representative);

ALTER TABLE Sale_Product ADD CONSTRAINT unique_sale_product UNIQUE (fk_id_Sale, fk_CNP);








############################           [Step 2] : Run batch_load.py file           ############################

INFO: This file can be obtained in the directory "code/api/scripts" and it needs to run the file vendas_wide.csv that can be obtained in the directory "code/database/data_treat"








############################           [Step 3] : Run the next to populate some fake data           ############################

INFO: First we were putting data from state as a boolean but in the future we will change the tables to put the state with different values types

-- Institution
INSERT INTO Institution (name, state)
VALUES
('Hospital Central', TRUE),
('Clinica Boa Saúde', TRUE),
('Instituto de Cardiologia', TRUE),
('Hospital São Lucas', TRUE),
('Centro Médico Vida', TRUE),
('Unidade de Diagnóstico ABC', TRUE),
('Hospital Infantil Esperança', TRUE),
('Hospital Geral Nova Era', TRUE),
('Clínica Popular 24h', TRUE),
('Instituto de Medicina Avançada', TRUE);


-- Speciality
INSERT INTO Specialty (name)
VALUES
('Cardiologia'),
('Dermatologia'),
('Neurologia'),
('Pediatria'),
('Psiquiatria'),
('Oftalmologia'),
('Ortopédica'),
('Anestesiologia'),
('Radiologia'),
('Endocrinologia');

--Doctor
INSERT INTO Doctor (professional_id_card, state, name)
VALUES
(101, TRUE, 'Dr. João Silva'),
(102, TRUE, 'Dra. Maria Souza'),
(103, TRUE, 'Dr. Carlos Alberto'),
(104, TRUE, 'Dra. Ana Oliveira'),
(105, TRUE, 'Dr. Pedro Santos'),
(106, TRUE, 'Dra. Joana Machado'),
(107, TRUE, 'Dr. Antonio Costa'),
(108, TRUE, 'Dra. Lucia Nascimento'),
(109, TRUE, 'Dr. Fernando Lima'),
(110, TRUE, 'Dra. Sara Alves');

-- Contact
INSERT INTO Contact (email, phone, state)
VALUES
('joao.silva@example.com', '111111111', TRUE), -- Médico 1
('maria.souza@example.com', '222222222', TRUE), -- Médico 2
('carlos.alberto@example.com', '333333333', TRUE), -- Médico 3
('ana.oliveira@example.com', '444444444', TRUE), -- Médico 4
('pedro.santos@example.com', '555555555', TRUE), -- Médico 5
('joana.machado@example.com', '666666666', TRUE), -- Médico 6
('antonio.costa@example.com', '777777777', TRUE), -- Médico 7
('lucia.nascimento@example.com', '888888888', TRUE), -- Médico 8
('fernando.lima@example.com', '999999999', TRUE), -- Médico 9
('sara.alves@example.com', '123123123', TRUE), -- Médico 10
('carlos.central@example.com', '111111112', TRUE), -- Representante Farmácia Central
('mariana.natural@example.com', '222222223', TRUE), -- Representante Farmácia Saúde Natural
('rafael.popular@example.com', '333333334', TRUE), -- Representante Farmácia Popular
('ana.sempre@example.com', '444444445', TRUE), -- Representante Farmácia Sempre Aberta
('joao.senior@example.com', '555555556', TRUE), -- Representante Farmácia Desconto Sênior
('paula.beleza@example.com', '666666667', TRUE), -- Representante Farmácia Beleza e Saúde
('fernando.bairro@example.com', '777777778', TRUE), -- Representante Farmácia do Bairro
('clarice.global@example.com', '888888889', TRUE), -- Representante Farmácia Global
('rodrigo.hospitalar@example.com', '999999990', TRUE), -- Representante Farmácia Hospitalar
('juliana.expressa@example.com', '123123124', TRUE); -- Representante Farmácia Expressa



-- Representative
INSERT INTO Representative (name, notes, state, fk_id_Contact)
VALUES
('Carlos Central', 'Representante Farmácia Central', TRUE, 11),
('Mariana Natural', 'Representante Farmácia Saúde Natural', TRUE, 12),
('Rafael Popular', 'Representante Farmácia Popular', TRUE, 13),
('Ana Sempre', 'Representante Farmácia Sempre Aberta', TRUE, 14),
('João Sênior', 'Representante Farmácia Desconto Sênior', TRUE, 15),
('Paula Beleza', 'Representante Farmácia Beleza e Saúde', TRUE, 16),
('Fernando Bairro', 'Representante Farmácia do Bairro', TRUE, 17),
('Clarice Global', 'Representante Farmácia Global', TRUE, 18),
('Rodrigo Hospitalar', 'Representante Farmácia Hospitalar', TRUE, 19),
('Juliana Expressa', 'Representante Farmácia Expressa', TRUE, 20);

INSERT INTO Address (street, zip_code, building, state, fk_brick)
VALUES
('Rua das Flores', '12345-678', '10A', TRUE, 1),
('Avenida Brasil', '98765-432', '123', TRUE, 2),
('Rua do Sol', '23456-789', '45', TRUE, 3),
('Rua das Acácias', '34567-890', '101', TRUE, 4),
('Praça Central', '45678-901', '5', TRUE, 5),
('Rua da Paz', '56789-012', '27B', TRUE, 6),
('Avenida dos Três Lagos', '67890-123', '87', TRUE, 7),
('Rua XV de Novembro', '78901-234', '300', TRUE, 8),
('Alameda dos Eucaliptos', '89012-345', '4', TRUE, 9),
('Rua da Liberdade', '90123-456', '112', TRUE, 10),
('Avenida Nova', '01234-567', '9', TRUE, 11),
('Rua da Estação', '12367-890', '201', TRUE, 12),
('Travessa do Comércio', '23478-901', '12', TRUE, 13),
('Rua São João', '34589-012', '23', TRUE, 14),
('Avenida das Palmeiras', '45690-123', '15', TRUE, 15);

-- Pharmacy
INSERT INTO Pharmacy (state, registry_date, notes, name, fk_id_Address, fk_id_Representative)
VALUES
(TRUE, CURRENT_TIMESTAMP, 'Farmácia bem localizada no centro', 'Farmácia Central', 1, 1),
(TRUE, CURRENT_TIMESTAMP, 'Especializada em medicamentos naturais', 'Farmácia Saúde Natural', 2, 2),
(TRUE, CURRENT_TIMESTAMP, 'Grande variedade de genéricos', 'Farmácia Popular', 3, 3),
(TRUE, CURRENT_TIMESTAMP, 'Atendimento 24 horas', 'Farmácia Sempre Aberta', 4, 4),
(TRUE, CURRENT_TIMESTAMP, 'Oferece descontos para idosos', 'Farmácia Desconto Sênior', 5, 5),
(TRUE, CURRENT_TIMESTAMP, 'Foco em cosméticos e beleza', 'Farmácia Beleza e Saúde', 6, 6),
(TRUE, CURRENT_TIMESTAMP, 'Farmácia do bairro com tradição', 'Farmácia do Bairro', 7, 7),
(TRUE, CURRENT_TIMESTAMP, 'Especialista em produtos importados', 'Farmácia Global', 8, 8),
(TRUE, CURRENT_TIMESTAMP, 'Localizada em frente ao hospital', 'Farmácia Hospitalar', 9, 9),
(TRUE, CURRENT_TIMESTAMP, 'Oferece entrega rápida', 'Farmácia Expressa', 10, 10);

-- Doctor_Activity
INSERT INTO Doctor_Activity (registry_date, state, notes, fk_id_Address, fk_Doctor, fk_id_Contact, fk_id_Institution, fk_id_Specialty)
VALUES
-- Atividades para os médicos
(CURRENT_TIMESTAMP, TRUE, 'Consulta semanal', 1, 101, 1, 1, 1),  -- Dr. João Silva
(CURRENT_TIMESTAMP, TRUE, 'Atendimento mensal', 2, 102, 2, 2, 2),  -- Dra. Maria Souza
(CURRENT_TIMESTAMP, TRUE, 'Consulta especializada', 3, 103, 3, 3, 3),  -- Dr. Carlos Alberto
(CURRENT_TIMESTAMP, TRUE, 'Plantão pediátrico', 4, 104, 4, 4, 4),  -- Dra. Ana Oliveira
(CURRENT_TIMESTAMP, TRUE, 'Sessões semanais', 5, 105, 5, 5, 5),  -- Dr. Pedro Santos
-- Atividades adicionais para os mesmos médicos (se necessário)
(CURRENT_TIMESTAMP, TRUE, 'Atendimento ambulatorial', 1, 101, 1, 6, 1),  -- Dr. João Silva
(CURRENT_TIMESTAMP, TRUE, 'Pós-operatório', 2, 102, 2, 7, 2),  -- Dra. Maria Souza
(CURRENT_TIMESTAMP, TRUE, 'Exame clínico', 3, 103, 3, 8, 3),  -- Dr. Carlos Alberto
(CURRENT_TIMESTAMP, TRUE, 'Consultoria psicológica', 4, 105, 4, 9, 4),  -- Dra. Ana Oliveira
(CURRENT_TIMESTAMP, TRUE, 'Acompanhamento', 5, 105, 5, 10, 5),  -- Dr. Pedro Santos
-- Mais atividades para os médicos
(CURRENT_TIMESTAMP, TRUE, 'Atendimento de emergência', 6, 106, 6, 6, 6),  -- Dra. Joana Machado
(CURRENT_TIMESTAMP, TRUE, 'Consulta de rotina', 7, 107, 7, 7, 7),  -- Dr. Antonio Costa
(CURRENT_TIMESTAMP, TRUE, 'Exame de diagnóstico', 8, 108, 8, 8, 8),  -- Dra. Lucia Nascimento
(CURRENT_TIMESTAMP, TRUE, 'Consultoria médica', 9, 109, 9, 9, 9),  -- Dr. Fernando Lima
(CURRENT_TIMESTAMP, TRUE, 'Encaminhamento para especialista', 10, 110, 10, 10, 10);  -- Dra. Sara Alves

-- Visit
INSERT INTO Visit (date, visit_state, fk_brick, fk_Doctor, fk_Pharmacy)
VALUES
(CURRENT_TIMESTAMP, 1, 1, 101, NULL),
(CURRENT_TIMESTAMP, 2, 2, NULL, 1),
(CURRENT_TIMESTAMP, 3, 2, 102, NULL),
(CURRENT_TIMESTAMP, 1, 4, NULL, 2),
(CURRENT_TIMESTAMP, 1, 5, 103, NULL);









############################           [Step 4] : Run queries to change state type           ############################

INFO: Here we will make the change in the tables' state (the necessary ones)

-- Alterar a tabela Delegate
ALTER TABLE Delegate 
ALTER COLUMN state TYPE VARCHAR 
USING CASE 
    WHEN state = TRUE THEN 'Ativo'
    WHEN state = FALSE THEN 'Inativo'
    ELSE 'Indisponível'
END;

-- Alterar a tabela Doctor
ALTER TABLE Doctor 
ALTER COLUMN state TYPE VARCHAR 
USING CASE 
    WHEN state = TRUE THEN 'Ativo'
    WHEN state = FALSE THEN 'Inativo'
    ELSE 'Indisponível'
END;

-- Alterar a tabela Doctor_Activity
ALTER TABLE Doctor_Activity 
ALTER COLUMN state TYPE VARCHAR 
USING CASE 
    WHEN state = TRUE THEN 'Ativo'
    WHEN state = FALSE THEN 'Inativo'
    ELSE 'Indisponível'
END;

-- Alterar a tabela Pharmacy
ALTER TABLE Pharmacy 
ALTER COLUMN state TYPE VARCHAR 
USING CASE 
    WHEN state = TRUE THEN 'Ativo'
    WHEN state = FALSE THEN 'Inativo'
    ELSE 'Indisponível'
END;









############################           [Step 5] : Run queries to create materialized views           ############################

-- *********************************************        VIEWS        ********************************************************
CREATE MATERIALIZED VIEW general_table AS
SELECT 
    product.name AS product_name,                      -- Product name
    product.cnp AS product_cnp,
    delegate.name AS delegate_name,                   -- Delegate name
    delegate.id_delegate AS id_delegate,
    company.name AS company_name,                     -- Company name
    company.id_company AS company_id,                 -- Company id
    hmr_zone.brick AS brick,                          -- Brick (HMR Zone)
    EXTRACT(YEAR FROM sale.registry_date) AS year,    -- Year of the sale
    SUM(CASE WHEN EXTRACT(MONTH FROM sale.registry_date) = 1 THEN sale_product.product_amount ELSE 0 END) AS Jan,  -- January
    SUM(CASE WHEN EXTRACT(MONTH FROM sale.registry_date) = 2 THEN sale_product.product_amount ELSE 0 END) AS Feb,  -- February
    SUM(CASE WHEN EXTRACT(MONTH FROM sale.registry_date) = 3 THEN sale_product.product_amount ELSE 0 END) AS Mar,  -- March
    SUM(CASE WHEN EXTRACT(MONTH FROM sale.registry_date) = 4 THEN sale_product.product_amount ELSE 0 END) AS Apr,  -- April
    SUM(CASE WHEN EXTRACT(MONTH FROM sale.registry_date) = 5 THEN sale_product.product_amount ELSE 0 END) AS May,  -- May
    SUM(CASE WHEN EXTRACT(MONTH FROM sale.registry_date) = 6 THEN sale_product.product_amount ELSE 0 END) AS Jun,  -- June
    SUM(CASE WHEN EXTRACT(MONTH FROM sale.registry_date) = 7 THEN sale_product.product_amount ELSE 0 END) AS Jul,  -- July
    SUM(CASE WHEN EXTRACT(MONTH FROM sale.registry_date) = 8 THEN sale_product.product_amount ELSE 0 END) AS Aug,  -- August
    SUM(CASE WHEN EXTRACT(MONTH FROM sale.registry_date) = 9 THEN sale_product.product_amount ELSE 0 END) AS Sep,  -- September
    SUM(CASE WHEN EXTRACT(MONTH FROM sale.registry_date) = 10 THEN sale_product.product_amount ELSE 0 END) AS Oct, -- October
    SUM(CASE WHEN EXTRACT(MONTH FROM sale.registry_date) = 11 THEN sale_product.product_amount ELSE 0 END) AS Nov, -- November
    SUM(CASE WHEN EXTRACT(MONTH FROM sale.registry_date) = 12 THEN sale_product.product_amount ELSE 0 END) AS Dec  -- December
FROM 
    sale
JOIN 
    sale_product ON sale.id_Sale = sale_product.fk_id_Sale
JOIN 
    product ON sale_product.fk_CNP = product.CNP
JOIN 
    company ON product.fk_id_Company = company.id_Company
JOIN 
    hmr_zone ON sale.fk_brick = hmr_zone.brick
JOIN 
    delegate ON hmr_zone.fk_id_Delegate = delegate.id_Delegate
GROUP BY 
    product_name, 
    product_cnp,
    delegate_name,
    id_delegate,
    company_name,
    company_id, 
    brick, 
    year;


CREATE MATERIALIZED VIEW general_table_per_years AS
SELECT 
    product.name AS product_name,                     -- Product name
    product.cnp AS product_cnp,
    delegate.name AS delegate_name,                  -- Delegate name
    delegate.id_delegate AS id_delegate,
    company.name AS company_name,                    -- Company name
    company.id_company AS company_id,                 -- Company id
    hmr_zone.brick AS brick,                         -- Brick (HMR Zone)
	SUM(CASE WHEN EXTRACT(YEAR FROM sale.registry_date) = 2018 THEN sale_product.product_amount ELSE 0 END) AS "2018",  -- Year 2018
    SUM(CASE WHEN EXTRACT(YEAR FROM sale.registry_date) = 2019 THEN sale_product.product_amount ELSE 0 END) AS "2019",  -- Year 2019
    SUM(CASE WHEN EXTRACT(YEAR FROM sale.registry_date) = 2020 THEN sale_product.product_amount ELSE 0 END) AS "2020",  -- Year 2020
    SUM(CASE WHEN EXTRACT(YEAR FROM sale.registry_date) = 2021 THEN sale_product.product_amount ELSE 0 END) AS "2021",  -- Year 2021
    SUM(CASE WHEN EXTRACT(YEAR FROM sale.registry_date) = 2022 THEN sale_product.product_amount ELSE 0 END) AS "2022",  -- Year 2022
    SUM(CASE WHEN EXTRACT(YEAR FROM sale.registry_date) = 2023 THEN sale_product.product_amount ELSE 0 END) AS "2023",  -- Year 2023
    SUM(CASE WHEN EXTRACT(YEAR FROM sale.registry_date) = 2024 THEN sale_product.product_amount ELSE 0 END) AS "2024"   -- Year 2024
FROM 
    sale
JOIN 
    sale_product ON sale.id_Sale = sale_product.fk_id_Sale
JOIN 
    product ON sale_product.fk_CNP = product.CNP
JOIN 
    company ON product.fk_id_Company = company.id_Company
JOIN 
    hmr_zone ON sale.fk_brick = hmr_zone.brick
JOIN 
    delegate ON hmr_zone.fk_id_Delegate = delegate.id_Delegate
GROUP BY 
    product_name, 
    product_cnp,
    delegate_name, 
    id_delegate,
    company_name, 
    company_id,
    brick;


CREATE MATERIALIZED VIEW general_delegates_and_bricks AS
SELECT DISTINCT
    del.id_Delegate AS id_delegate,
    del.name AS delegate,
    hz.brick AS brick,
    d.id_District AS id_district,
    d.name AS district,
    r.id_Region AS id_region,
    r.name AS region,
    t.id_Town AS id_parish,
    t.name AS parish,
    del.state AS state
FROM 
    Delegate del
LEFT JOIN 
    HMR_Zone hz ON del.id_Delegate = hz.fk_id_Delegate
LEFT JOIN 
    District d ON hz.fk_id_District = d.id_District
LEFT JOIN 
    Region r ON hz.fk_id_Region = r.id_Region
LEFT JOIN 
    Town t ON hz.fk_id_Town = t.id_Town;



CREATE MATERIALIZED VIEW general_doctors AS
SELECT DISTINCT
    doc.professional_id_card AS id_doctor,
    doc.name AS medico,
    hz.brick AS brick,
    d.id_District AS id_district,
    d.name AS district,
    inst.id_Institution AS id_institution,
    inst.name AS institution,
    sp.id_Specialty AS id_speciality,
    sp.name AS speciality,
    doc.state AS state,
    addr.street AS street,
    addr.zip_code AS zip_code,
    addr.building AS building,
    CONCAT(addr.street, ', ', addr.zip_code, 
        CASE WHEN addr.building IS NOT NULL THEN ', ' || addr.building ELSE '' END) AS full_address
FROM 
    Doctor doc
LEFT JOIN Doctor_Activity da ON doc.professional_id_card = da.fk_Doctor
LEFT JOIN Institution inst ON da.fk_id_Institution = inst.id_Institution
LEFT JOIN Specialty sp ON da.fk_id_Specialty = sp.id_Specialty
LEFT JOIN Address addr ON da.fk_id_Address = addr.id_Address
LEFT JOIN HMR_Zone hz ON addr.fk_brick = hz.brick
LEFT JOIN District d ON hz.fk_id_District = d.id_District;

CREATE MATERIALIZED VIEW general_pharmacies AS
SELECT DISTINCT
    ph.id_Pharmacy AS id_pharmacy,
    ph.name AS pharmacy,
    hz.brick AS brick,
    d.id_District AS id_district,
    d.name AS district,
    r.id_Region AS id_region,
    r.name AS region,
    t.id_Town AS id_parish,
    t.name AS parish,
    CONCAT(addr.street, ', ', addr.zip_code, 
        CASE WHEN addr.building IS NOT NULL THEN ', ' || addr.building ELSE '' END) AS address,
    rep.id_Representative AS id_representative,
    rep.name AS representative
FROM 
    Pharmacy ph
LEFT JOIN 
    Address addr ON ph.fk_id_Address = addr.id_Address
LEFT JOIN 
    HMR_Zone hz ON addr.fk_brick = hz.brick
LEFT JOIN 
    District d ON hz.fk_id_District = d.id_District
LEFT JOIN 
    Region r ON hz.fk_id_Region = r.id_Region
LEFT JOIN 
    Town t ON hz.fk_id_Town = t.id_Town
LEFT JOIN 
    Representative rep ON ph.fk_id_Representative = rep.id_Representative;





