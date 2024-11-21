import random
import pandas as pd
import psycopg
import tqdm

DB_USER = "mypharma_admin"
DB_PASSWORD = "admin"
DB_HOST = "localhost"
DB_PORT = 5432
DB_NAME = "mypharma"

conn_string =f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

df = pd.read_csv('backend/data_treat/vendas_long.csv', delimiter=';')

batch_size = 1000
batch_data = []

with psycopg.connect(conn_string) as conn:
    with conn.cursor() as cur:
        cur.execute('BEGIN')
        
        try:
            for i, row in tqdm.tqdm(enumerate(df.values)):
                # Delegate
                delegate_name = row[1].strip()
                cur.execute(f"INSERT INTO delegate (name) VALUES (%s) ON CONFLICT (name) DO NOTHING RETURNING id_delegate;", (delegate_name,))
                delegate = cur.fetchone()
                if delegate is not None:
                    delegate_id = delegate[0]
                else:
                    # If delegate doesn't exist, set id to None
                    delegate_id = None

                # Region
                region_name = row[3].strip()
                cur.execute(f"INSERT INTO region (name) VALUES (%s) ON CONFLICT (name) DO NOTHING RETURNING id_region;", (region_name,))
                region = cur.fetchone()
                if region is not None:
                    region_id = region[0]
                else:
                    region_id = None

                # District
                district_name = row[2].strip()
                cur.execute(f"INSERT INTO district (name) VALUES (%s) ON CONFLICT (name) DO NOTHING RETURNING id_district;", (district_name,))
                district = cur.fetchone()
                if district is not None:
                    district_id = district[0]
                else:
                    district_id = None

                # Town
                town_id = None
                if len(row[4]) > 1:
                    town_name = row[4].strip()
                    cur.execute(f"INSERT INTO town (name) VALUES (%s) ON CONFLICT (name) DO NOTHING RETURNING id_town;", (town_name,))
                    town = cur.fetchone()
                    if town is not None:
                        town_id = town[0]
                    else:
                        town_id = None

                # Hmr Zone
                brick = row[0]
                cur.execute(f"""
                    INSERT INTO hmr_zone (brick, fk_id_delegate, fk_id_region, fk_id_district, fk_id_town)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (brick) DO NOTHING RETURNING brick;
                """, (brick, delegate_id, region_id, district_id, town_id if len(row[4]) > 1 else None))
                hmr_zone = cur.fetchone()
                if hmr_zone is not None:
                    hmr_zone_id = hmr_zone[0]
                else:
                    hmr_zone_id = None

                # Company
                company_name = row[5].strip()
                cur.execute(f"INSERT INTO company (name) VALUES (%s) ON CONFLICT (name) DO NOTHING RETURNING id_company;", (company_name,))
                company = cur.fetchone()
                if company is not None:
                    company_id = company[0]
                else:
                    company_id = None

                # Product
                product_name = row[6].strip()
                cnp = random.randint(1, 1000000000)  # Dummy CNP
                cur.execute(f"INSERT INTO product (cnp, name, fk_id_company) VALUES (%s, %s, %s) ON CONFLICT (name, fk_id_company) DO NOTHING RETURNING cnp;", (cnp, product_name, company_id))
                product = cur.fetchone()
                if product is not None:
                    product_id = product[0]
                else:
                    product_id = None

                # Sale
                sale_date = row[7]
                product_amount = row[8]
                cur.execute(f"""
                    INSERT INTO sale (registry_date, fk_brick)
                    VALUES (%s, %s)
                    ON CONFLICT (registry_date, fk_brick) DO NOTHING RETURNING id_sale;
                """, (sale_date, brick))
                sale = cur.fetchone()
                if sale is not None:
                    sale_id = sale[0]
                else:
                    sale_id = None

                # Sale Product
                cur.execute(f"""
                    INSERT INTO sale_product (fk_id_sale, fk_cnp, product_amount)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (fk_id_sale, fk_cnp) DO NOTHING;
                """, (sale_id, product_id, product_amount))
                
                batch_data.append((delegate_id, region_id, district_id, town_id, hmr_zone_id, company_id, product_id, sale_id))
                
                # Commit batch every `batch_size` rows
                if (i + 1) % batch_size == 0:
                    conn.commit()
                    batch_data = []  # Clear batch after commit

            # Final commit
            conn.commit()
            
        except Exception as e:
            print("Error: ", e)
            cur.execute('ROLLBACK')
