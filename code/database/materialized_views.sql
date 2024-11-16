CREATE MATERIALIZED VIEW product_sales_summary AS
SELECT 
    product.name AS product_name,                -- Product name
    company.name AS company_name,                -- Company name
    hmr_zone.brick AS brick,                     -- Brick (HMR Zone)
    DATE_PART('year', sale.registry_date) AS year, -- Extract year from sale date
    SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 1 THEN sale_product.product_amount ELSE 0 END) AS Jan, -- January
    SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 2 THEN sale_product.product_amount ELSE 0 END) AS Feb, -- February
    SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 3 THEN sale_product.product_amount ELSE 0 END) AS Mar, -- March
    SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 4 THEN sale_product.product_amount ELSE 0 END) AS Apr, -- April
    SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 5 THEN sale_product.product_amount ELSE 0 END) AS May, -- May
    SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 6 THEN sale_product.product_amount ELSE 0 END) AS Jun, -- June
    SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 7 THEN sale_product.product_amount ELSE 0 END) AS Jul, -- July
    SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 8 THEN sale_product.product_amount ELSE 0 END) AS Aug, -- August
    SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 9 THEN sale_product.product_amount ELSE 0 END) AS Sep, -- September
    SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 10 THEN sale_product.product_amount ELSE 0 END) AS Oct, -- October
    SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 11 THEN sale_product.product_amount ELSE 0 END) AS Nov, -- November
    SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 12 THEN sale_product.product_amount ELSE 0 END) AS Dec -- December
FROM 
    sale
JOIN 
    sale_product ON sale.id_Sale = sale_product.fk_id_Sale
JOIN 
    product ON sale_product.fk_CNP = product.CNP
JOIN 
    company ON product.fk_id_Company = company.id_Company
JOIN 
    hmr_zone ON sale.fk_brick = hmr_zone.brick -- Assuming brick (HMR Zone) is in the Sale table
GROUP BY 
    product_name, 
    company_name, 
    brick, 
    year;



CREATE MATERIALIZED VIEW delegate_sales_summary AS
SELECT 
    delegate.name AS delegate_name,                   -- Delegate name
    company.name AS company_name,                      -- Company name
    hmr_zone.brick AS brick,                           -- Brick (HMR Zone)
    EXTRACT(YEAR FROM sale.registry_date) AS year,     -- Extract year from sale date
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
    delegate_name, 
    company_name, 
    brick, 
    year;
