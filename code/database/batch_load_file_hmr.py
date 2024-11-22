import random
import pandas as pd
import psycopg
import tqdm

DB_USER = "mypharma"
DB_PASSWORD = "mypharma"
DB_HOST = "localhost"
DB_PORT = 5432
DB_NAME = "mypharma"

conn_string = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
df = pd.read_csv('backend/data_treat/vendas_wide.csv', delimiter=';')

with psycopg.connect(conn_string) as conn:
    with conn.cursor() as cur:
        try:
            for index, row in enumerate(tqdm.tqdm(df.values)):
                try:
                    # Delegate
                    cur.execute("SELECT id_delegate FROM delegate WHERE name = %s;", (row[1].strip(),))
                    delegate = cur.fetchone()
                    if delegate is None:
                        cur.execute("INSERT INTO delegate (name) VALUES (%s) RETURNING id_delegate;", (row[1].strip(),))
                        delegate = cur.fetchone()
                    delegate_id = delegate[0]

                    # Region
                    cur.execute("SELECT id_region FROM region WHERE name = %s;", (row[3].strip(),))
                    region = cur.fetchone()
                    if region is None:
                        cur.execute("INSERT INTO region (name) VALUES (%s) RETURNING id_region;", (row[3].strip(),))
                        region = cur.fetchone()
                    region_id = region[0]

                    # District
                    cur.execute("SELECT id_district FROM district WHERE name = %s;", (row[2].strip(),))
                    district = cur.fetchone()
                    if district is None:
                        cur.execute("INSERT INTO district (name) VALUES (%s) RETURNING id_district;", (row[2].strip(),))
                        district = cur.fetchone()
                    district_id = district[0]

                    # Town
                    town_id = None
                    if len(row[4]) > 1:
                        cur.execute("SELECT id_town FROM town WHERE name = %s;", (row[4].strip(),))
                        town = cur.fetchone()
                        if town is None:
                            cur.execute("INSERT INTO town (name) VALUES (%s) RETURNING id_town;", (row[4].strip(),))
                            town = cur.fetchone()
                        town_id = town[0]

                    # Hmr_Zone
                    cur.execute("SELECT brick FROM hmr_zone WHERE brick = %s;", (row[0],))
                    hmr_zone = cur.fetchone()
                    if hmr_zone is None:
                        cur.execute("""
                            INSERT INTO hmr_zone (brick, fk_id_delegate, fk_id_region, fk_id_district, fk_id_town)
                            VALUES (%s, %s, %s, %s, %s) RETURNING brick;
                        """, (row[0], delegate_id, region_id, district_id, town_id))
                        hmr_zone = cur.fetchone()
                    hmr_zone_id = hmr_zone[0]

                    # Company
                    cur.execute("SELECT id_company FROM company WHERE name = %s;", (row[5].strip(),))
                    company = cur.fetchone()
                    if company is None:
                        cur.execute("INSERT INTO company (name) VALUES (%s) RETURNING id_company;", (row[5].strip(),))
                        company = cur.fetchone()
                    company_id = company[0]

                    # Product
                    cur.execute("SELECT cnp FROM product WHERE name = %s AND fk_id_company = %s;", (row[6].strip(), company_id))
                    product = cur.fetchone()
                    if product is None:
                        cnp = random.randint(1, 1000000000)
                        cur.execute("""
                            INSERT INTO product (cnp, name, fk_id_company)
                            VALUES (%s, %s, %s) RETURNING cnp;
                        """, (cnp, row[6].strip(), company_id))
                        product = cur.fetchone()
                    product_id = product[0]

                    # Sale and Sale_Product
                    for i in range(7, len(row)):  # Skip first 7 columns
                        date_column = df.columns[i]
                        value_column = row[i]

                        cur.execute("""
                            SELECT id_sale FROM sale
                            JOIN sale_product ON sale_product.fk_id_sale = sale.id_sale
                            WHERE fk_brick = %s AND registry_date = %s AND fk_cnp = %s AND product_amount = %s;
                        """, (row[0], date_column, product_id, value_column))
                        sale = cur.fetchone()
                        if sale is None:
                            cur.execute("""
                                INSERT INTO sale (registry_date, fk_brick)
                                VALUES (%s, %s) RETURNING id_sale;
                            """, (date_column, row[0]))
                            sale = cur.fetchone()
                        sale_id = sale[0]

                        cur.execute("""
                            SELECT * FROM sale_product WHERE fk_id_sale = %s AND fk_cnp = %s AND product_amount = %s;
                        """, (sale_id, product_id, value_column))
                        sale_product = cur.fetchone()
                        if sale_product is None:
                            cur.execute("""
                                INSERT INTO sale_product (fk_id_sale, fk_cnp, product_amount)
                                VALUES (%s, %s, %s);
                            """, (sale_id, product_id, value_column))

                    # Commit in batches (every 1000 rows)
                    if index % 1000 == 0:
                        conn.commit()

                except Exception as row_error:
                    print(f"Error processing row {index}: {row_error}")
                    conn.rollback()

            # Final commit
            conn.commit()

        except Exception as e:
            print(f"Critical Error: {e}")
            conn.rollback()
