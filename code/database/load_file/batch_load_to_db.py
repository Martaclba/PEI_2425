import random
import pandas as pd
import psycopg
import tqdm
import argparse

DB_USER = "mypharma"
DB_PASSWORD = "mypharma"
DB_HOST = "localhost"
DB_PORT = 5432
DB_NAME = "mypharma"

conn_string = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

parser = argparse.ArgumentParser(description="Batch load .csv file to database - TM MyPharma")
parser.add_argument("path", help="Your name")
args = parser.parse_args()

if args is None or args.path is None:
    raise ValueError('Missing argument path!')

df = pd.read_csv(args.path, delimiter=';')

BATCH_SIZE = 5000

with psycopg.connect(conn_string) as conn:
    with conn.cursor() as cur:
        try:
            cur.execute('BEGIN')  # Start transaction
            batch_queries = []  # Collect queries for batch execution
            
            for idx, row in tqdm.tqdm(enumerate(df.values), total=len(df)):
                # Delegate
                cur.execute(f"SELECT id_delegate FROM delegate WHERE name = '{row[1].strip()}';")
                delegate = cur.fetchone()
                if delegate is None:
                    cur.execute(f"INSERT INTO delegate (name) VALUES ('{row[1].strip()}') RETURNING id_delegate;")
                    delegate = cur.fetchone()
                delegate_id = delegate[0]

                # Region
                cur.execute(f"SELECT id_region FROM region WHERE name = '{row[3].strip()}';")
                region = cur.fetchone()
                if region is None:
                    cur.execute(f"INSERT INTO region (name) VALUES ('{row[3].strip()}') RETURNING id_region;")
                    region = cur.fetchone()
                region_id = region[0]

                # District
                cur.execute(f"SELECT id_district FROM district WHERE name = '{row[2].strip()}';")
                district = cur.fetchone()
                if district is None:
                    cur.execute(f"INSERT INTO district (name) VALUES ('{row[2].strip()}') RETURNING id_district;")
                    district = cur.fetchone()
                district_id = district[0]

                # Town
                town_id = None
                if len(row[4]) > 1:
                    cur.execute(f"SELECT id_town FROM town WHERE name = '{row[4].strip()}';")
                    town = cur.fetchone()
                    if town is None:
                        cur.execute(f"INSERT INTO town (name) VALUES ('{row[4].strip()}') RETURNING id_town;")
                        town = cur.fetchone()
                    town_id = town[0]

                # Hmr_Zone
                cur.execute(f"SELECT brick FROM hmr_zone WHERE brick = {row[0]};")
                hmr_zone = cur.fetchone()
                if hmr_zone is None:
                    cur.execute(f"""
                        INSERT INTO hmr_zone (brick, fk_id_delegate, fk_id_region, fk_id_district, fk_id_town) 
                        VALUES ({row[0]}, {delegate_id}, {region_id}, {district_id}, {town_id if town_id else 'NULL'}) 
                        RETURNING brick;
                    """)
                    hmr_zone = cur.fetchone()
                hmr_zone_id = hmr_zone[0]

                # Company
                cur.execute(f"SELECT id_company FROM company WHERE name = '{row[5].strip()}';")
                company = cur.fetchone()
                if company is None:
                    cur.execute(f"INSERT INTO company (name) VALUES ('{row[5].strip()}') RETURNING id_company;")
                    company = cur.fetchone()
                company_id = company[0]

                # Product
                cur.execute(f"SELECT cnp FROM product WHERE name = '{row[6].strip()}' AND fk_id_company = {company_id};")
                product = cur.fetchone()
                if product is None:
                    cur.execute(f"""
                        INSERT INTO product (cnp, name, fk_id_company) 
                        VALUES ({random.randint(1, 1000000000)}, '{row[6].strip()}', {company_id}) 
                        RETURNING cnp;
                    """)
                    product = cur.fetchone()
                product_id = product[0]

                # Sale and Sale_Product
                for i in range(7, len(row)):
                    date_column = df.columns[i]
                    value_column = row[i]

                    if value_column > 0:  # Only process non-zero values
                        cur.execute(f"""
                            SELECT id_sale FROM sale 
                            WHERE registry_date = '{date_column}' AND fk_brick = {row[0]};
                        """)
                        sale = cur.fetchone()
                        if sale is None:
                            cur.execute(f"""
                                INSERT INTO sale (registry_date, fk_brick) 
                                VALUES ('{date_column}', {row[0]}) 
                                RETURNING id_sale;
                            """)
                            sale = cur.fetchone()
                        sale_id = sale[0]

                        # Sale_Product
                        batch_queries.append((
                            sale_id, product_id, value_column
                        ))

                # Execute batch every BATCH_SIZE rows
                if len(batch_queries) >= BATCH_SIZE:
                    cur.executemany(
                        """
                        INSERT INTO sale_product (fk_id_sale, fk_cnp, product_amount) 
                        VALUES (%s, %s, %s) 
                        ON CONFLICT DO NOTHING;
                        """, 
                        batch_queries
                    )
                    batch_queries.clear()

            # Insert remaining rows
            if batch_queries:
                cur.executemany(
                    """
                    INSERT INTO sale_product (fk_id_sale, fk_cnp, product_amount) 
                    VALUES (%s, %s, %s) 
                    ON CONFLICT DO NOTHING;
                    """, 
                    batch_queries
                )

            conn.commit()  # Commit everything

        except Exception as e:
            print("Error:", e)
            conn.rollback()  # Rollback on error