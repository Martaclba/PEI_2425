CREATE MATERIALIZED VIEW Sum_Sales_Month_Delegate_ManagerView AS
SELECT delegate.id_delegate AS delegate_id,
		delegate.name AS delegate_name,
		DATE_PART('year', sale.registry_date) AS cur_year,
		SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 1 THEN 1 ELSE 0 END) AS Jan,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 2 THEN 1 ELSE 0 END) AS Feb,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 3 THEN 1 ELSE 0 END) AS Mar,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 4 THEN 1 ELSE 0 END) AS Apr,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 5 THEN 1 ELSE 0 END) AS May,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 6 THEN 1 ELSE 0 END) AS Jun,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 7 THEN 1 ELSE 0 END) AS Jul,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 8 THEN 1 ELSE 0 END) AS Aug,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 9 THEN 1 ELSE 0 END) AS Sep,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 10 THEN 1 ELSE 0 END) AS Oct,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 11 THEN 1 ELSE 0 END) AS Nov,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 12 THEN 1 ELSE 0 END) AS Dec
FROM sale, delegate, hmr_zone
WHERE sale.fk_brick = hmr_zone.brick AND hmr_zone.fk_id_delegate = delegate.id_delegate
GROUP BY 
    delegate_id, 
    DATE_PART('year', sale.registry_date);


CREATE MATERIALIZED VIEW Sum_Sales_Month_Product_ManagerView AS
SELECT product.cnp AS product_cnp,
		product.name AS product_name,
		DATE_PART('year', sale.registry_date) AS cur_year,
		SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 1 THEN 1 ELSE 0 END) AS Jan,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 2 THEN 1 ELSE 0 END) AS Feb,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 3 THEN 1 ELSE 0 END) AS Mar,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 4 THEN 1 ELSE 0 END) AS Apr,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 5 THEN 1 ELSE 0 END) AS May,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 6 THEN 1 ELSE 0 END) AS Jun,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 7 THEN 1 ELSE 0 END) AS Jul,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 8 THEN 1 ELSE 0 END) AS Aug,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 9 THEN 1 ELSE 0 END) AS Sep,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 10 THEN 1 ELSE 0 END) AS Oct,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 11 THEN 1 ELSE 0 END) AS Nov,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 12 THEN 1 ELSE 0 END) AS Dec
FROM sale, product, sale_product
WHERE sale.id_sale = sale_product.fk_id_sale AND sale_product.fk_cnp = product.cnp
GROUP BY 
    product_cnp, 
    DATE_PART('year', sale.registry_date);


CREATE MATERIALIZED VIEW Sum_Sales_Month_Brick_ManagerView AS
SELECT hmr_zone.brick AS id_brick,
		region.name AS region_name,
		district.name AS district_name,
		town.name AS town_name,
		DATE_PART('year', sale.registry_date) AS cur_year,
		SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 1 THEN 1 ELSE 0 END) AS Jan,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 2 THEN 1 ELSE 0 END) AS Feb,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 3 THEN 1 ELSE 0 END) AS Mar,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 4 THEN 1 ELSE 0 END) AS Apr,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 5 THEN 1 ELSE 0 END) AS May,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 6 THEN 1 ELSE 0 END) AS Jun,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 7 THEN 1 ELSE 0 END) AS Jul,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 8 THEN 1 ELSE 0 END) AS Aug,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 9 THEN 1 ELSE 0 END) AS Sep,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 10 THEN 1 ELSE 0 END) AS Oct,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 11 THEN 1 ELSE 0 END) AS Nov,
        SUM(CASE WHEN DATE_PART('month', sale.registry_date) = 12 THEN 1 ELSE 0 END) AS Dec
FROM sale, hmr_zone, region, district, town
WHERE sale.fk_brick = hmr_zone.brick AND hmr_zone.fk_id_region = region.id_region AND hmr_zone.fk_id_district = district.id_district AND hmr_zone.fk_id_town = town.id_town
GROUP BY 
    id_brick, 
	region_name,
	district_name,
	town_name,
    DATE_PART('year', sale.registry_date);