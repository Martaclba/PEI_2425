CREATE MATERIALIZED VIEW general_table AS
SELECT 
    product.name AS product_name,                      -- Product name
    delegate.name AS delegate_name,                   -- Delegate name
    company.name AS company_name,                     -- Company name
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
    delegate_name, 
    company_name, 
    brick, 
    year;

CREATE MATERIALIZED VIEW general_table_per_years AS
SELECT 
    product.name AS product_name,                     -- Product name
    delegate.name AS delegate_name,                  -- Delegate name
    company.name AS company_name,                    -- Company name
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
    delegate_name, 
    company_name, 
    brick;

-- This is to apply filters to general_table
SELECT 
    product_name, 
    delegate_name, 
    company_name, 
    brick, 
    year,
    SUM(Jan) AS Jan,
    SUM(Feb) AS Feb,
    SUM(Mar) AS Mar,
    SUM(Apr) AS Apr,
    SUM(May) AS May,
    SUM(Jun) AS Jun,
    SUM(Jul) AS Jul,
    SUM(Aug) AS Aug,
    SUM(Sep) AS Sep,
    SUM(Oct) AS Oct,
    SUM(Nov) AS Nov,
    SUM(Dec) AS Dec
FROM 
    general_table
WHERE 
    (product_name = ANY(:product_names) OR :product_names IS NULL) AND
    (delegate_name = ANY(:delegate_names) OR :delegate_names IS NULL) AND
    (company_name = ANY(:company_names) OR :company_names IS NULL) AND
    (brick = ANY(:bricks) OR :bricks IS NULL) AND
    (year = ANY(:years) OR :years IS NULL)
GROUP BY 
    product_name, 
    delegate_name, 
    company_name, 
    brick, 
    year;

-- This is to apply filters to general_table_per_years
SELECT 
    product_name, 
    delegate_name, 
    company_name, 
    brick,
    SUM(CASE WHEN '2018' = ANY(:years) THEN "2018" ELSE 0 END) AS "2018",
    SUM(CASE WHEN '2019' = ANY(:years) THEN "2019" ELSE 0 END) AS "2019",
    SUM(CASE WHEN '2020' = ANY(:years) THEN "2020" ELSE 0 END) AS "2020",
    SUM(CASE WHEN '2021' = ANY(:years) THEN "2021" ELSE 0 END) AS "2021",
    SUM(CASE WHEN '2022' = ANY(:years) THEN "2022" ELSE 0 END) AS "2022",
    SUM(CASE WHEN '2023' = ANY(:years) THEN "2023" ELSE 0 END) AS "2023",
    SUM(CASE WHEN '2024' = ANY(:years) THEN "2024" ELSE 0 END) AS "2024"
FROM 
    general_table_per_years
WHERE 
    (product_name = ANY(:product_names) OR :product_names IS NULL) AND
    (delegate_name = ANY(:delegate_names) OR :delegate_names IS NULL) AND
    (company_name = ANY(:company_names) OR :company_names IS NULL) AND
    (brick = ANY(:bricks) OR :bricks IS NULL)
GROUP BY 
    product_name, 
    delegate_name, 
    company_name, 
    brick;
