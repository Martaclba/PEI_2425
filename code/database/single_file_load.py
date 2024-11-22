import random
import pandas as pd
import psycopg
import tqdm

DB_USER = "mypharma"
DB_PASSWORD = "mypharma"
DB_HOST = "localhost"
DB_PORT = 5432
DB_NAME = "mypharma"

conn_string =f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

df = pd.read_csv('../backend/data_treat/vendas_wide.csv', delimiter=';')

with psycopg.connect(conn_string) as conn:
    with conn.cursor() as cur:
        cur.execute('BEGIN')
        
        try:
            for row in tqdm.tqdm(df.values):
                #print(row)
                # Delegate
                cur.execute(f"SELECT * FROM delegate WHERE name = '{row[1].strip()}';")
                delegate = cur.fetchone()
                if delegate is None:
                    cur.execute(f"INSERT INTO delegate (name) VALUES ('{row[1].strip()}') RETURNING id_delegate;")
                    delegate = cur.fetchone()
                delegate_id = delegate[0]
                #print(delegate)
                
                # Region
                cur.execute(f"SELECT * FROM region WHERE name = '{row[3].strip()}';")
                region = cur.fetchone()
                if region is None:
                    cur.execute(f"INSERT INTO region (name) VALUES ('{row[3].strip()}') RETURNING id_region;")
                    region = cur.fetchone()
                region_id = region[0]
                #print(region)
                
                # District
                cur.execute(f"SELECT * FROM district WHERE name = '{row[2].strip()}';")
                district = cur.fetchone()
                if district is None:
                    cur.execute(f"INSERT INTO district (name) VALUES ('{row[2].strip()}') RETURNING id_district;")
                    district = cur.fetchone()
                district_id = district[0]
                #print(district)
                
                # Town
                town_id = None
                if len(row[4]) > 1:
                    cur.execute(f"SELECT * FROM town WHERE name = '{row[4].strip()}';")
                    town = cur.fetchone()
                    if town is None:
                        cur.execute(f"INSERT INTO town (name) VALUES ('{row[4].strip()}') RETURNING id_town;")
                        town = cur.fetchone()
                    town_id = town[0]
                    #print(town)
                
                # Hmr_Zone
                cur.execute(f"SELECT * FROM hmr_zone WHERE brick = {row[0]};")
                hmr_zone = cur.fetchone()
                if hmr_zone is None:
                    cur.execute(f"INSERT INTO hmr_zone (brick, fk_id_delegate, fk_id_region, fk_id_district, fk_id_town) VALUES ({row[0]}, {delegate_id}, {region_id}, {district_id}, {town_id if len(row[4])>1 else 'NULL'}) RETURNING brick;")
                    hmr_zone = cur.fetchone()
                hmr_zone_id = hmr_zone[0]
                #print(hmr_zone)
                
                
                # Company
                cur.execute(f"SELECT * FROM company WHERE name = '{row[5].strip()}';")
                company = cur.fetchone()
                if company is None:
                    cur.execute(f"INSERT INTO company (name) VALUES ('{row[5].strip()}') RETURNING id_company;")
                    company = cur.fetchone()
                company_id = company[0]
                #print(company)
                
                
                # Product
                # RANDOM CNP - CHANGE THIS LATER
                cur.execute(f"SELECT * FROM product WHERE name = '{row[6].strip()}' AND fk_id_company = {company_id};")
                product = cur.fetchone()
                if product is None:
                    cur.execute(f"INSERT INTO product (cnp, name, fk_id_company) VALUES ({random.randint(1,1000000000)},'{row[6].strip()}', {company_id}) RETURNING cnp;")
                    product = cur.fetchone()
                product_id = product[0]
                #print(product)
                
                
                for i in range(7, len(row)):  # Skip first 7 columns
                    date_column = df.columns[i]
                    value_column = row[i]
                                    
                    cur.execute(f"SELECT * FROM sale JOIN sale_product ON sale_product.fk_id_sale = sale.id_sale WHERE fk_brick = {row[0]} AND registry_date = '{date_column}' AND sale_product.fk_cnp = {product_id} AND sale_product.product_amount = {value_column};")
                    sale = cur.fetchone()
                    if sale is None:
                        cur.execute(f"INSERT INTO sale (registry_date, fk_brick) VALUES ('{date_column}', {row[0]}) RETURNING id_sale;")
                        sale = cur.fetchone()
                    sale_id = sale[0]
                    #print(sale)
                    
                    # sale_product
                    cur.execute(f"SELECT * FROM sale_product WHERE fk_id_sale = {sale_id} AND fk_cnp = {product_id} AND product_amount = {value_column};")
                    sale_product = cur.fetchone()
                    if sale_product is None:
                        cur.execute(f"INSERT INTO sale_product (fk_id_sale, fk_cnp, product_amount) VALUES ({sale_id}, {product_id}, {value_column}) RETURNING (fk_id_sale,fk_cnp);")
                        sale_product = cur.fetchone()
                    #sale_product_id = sale_product[0]
                    #print(sale_product)
            conn.execute('COMMIT')     
        except Exception as e:
            print("Error: ", e)
            cur.execute('ROLLBACK')