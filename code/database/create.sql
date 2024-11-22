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
