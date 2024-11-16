import pandas as pd
import psycopg2
from psycopg2 import sql
import tqdm
import random

# Database connection parameters
DB_USER = "mypharma"
DB_PASSWORD = "mypharma"
DB_HOST = "localhost"
DB_PORT = 5432
DB_NAME = "mypharma"

# Connection string
conn_string = f"dbname={DB_NAME} user={DB_USER} password={DB_PASSWORD} host={DB_HOST} port={DB_PORT}"

BATCH_SIZE = 10000  # Define batch size

# Load data in chunks
chunksize = BATCH_SIZE
df_chunks = pd.read_csv('/home/mirtilo/Downloads/vendas_long.csv', delimiter=';', chunksize=chunksize)

with psycopg2.connect(conn_string) as conn:
    conn.autocommit = False
    with conn.cursor() as cur:
        for df in tqdm.tqdm(df_chunks):
            try:
                data_batch = []
                for _, row in df.iterrows():
                    # Prepare data for batch insert

                    # Check and insert into `Delegate`
                    cur.execute("SELECT id_Delegate FROM delegate WHERE name = %s", (row['DIM'].strip(),))
                    delegate = cur.fetchone()
                    if delegate is None:
                        cur.execute("INSERT INTO delegate (name) VALUES (%s) RETURNING id_Delegate", (row['DIM'].strip(),))
                        delegate = cur.fetchone()
                    delegate_id = delegate[0]

                    # Check and insert into `Region`
                    cur.execute("SELECT id_Region FROM region WHERE name = %s", (row['Region HMR'].strip(),))
                    region = cur.fetchone()
                    if region is None:
                        cur.execute("INSERT INTO region (name) VALUES (%s) RETURNING id_Region", (row['Region HMR'].strip(),))
                        region = cur.fetchone()
                    region_id = region[0]

                    # Check and insert into `District`
                    cur.execute("SELECT id_District FROM district WHERE name = %s", (row['District'].strip(),))
                    district = cur.fetchone()
                    if district is None:
                        cur.execute("INSERT INTO district (name) VALUES (%s) RETURNING id_District", (row['District'].strip(),))
                        district = cur.fetchone()
                    district_id = district[0]

                    # Check and insert into `Town` if applicable
                    town_id = None
                    if pd.notnull(row['Parish']) and row['Parish'].strip():
                        cur.execute("SELECT id_Town FROM town WHERE name = %s", (row['Parish'].strip(),))
                        town = cur.fetchone()
                        if town is None:
                            cur.execute("INSERT INTO town (name) VALUES (%s) RETURNING id_Town", (row['Parish'].strip(),))
                            town = cur.fetchone()
                        town_id = town[0]

                    # Check and insert into `Company`
                    cur.execute("SELECT id_Company FROM company WHERE name = %s", (row['Company'].strip(),))
                    company = cur.fetchone()
                    if company is None:
                        cur.execute("INSERT INTO company (name) VALUES (%s) RETURNING id_Company", (row['Company'].strip(),))
                        company = cur.fetchone()
                    company_id = company[0]

                    # Check and insert into `Product`
                    cur.execute("SELECT CNP FROM product WHERE name = %s AND fk_id_Company = %s", (row['Product'].strip(), company_id))
                    product = cur.fetchone()
                    if product is None:
                        cur.execute("INSERT INTO product (CNP, name, fk_id_Company) VALUES (%s, %s, %s) RETURNING CNP",
                                    (random.randint(1, 1000000000), row['Product'].strip(), company_id))
                        product = cur.fetchone()
                    product_id = product[0]

                    # Check and insert into `HMR_Zone`
                    cur.execute("SELECT brick FROM hmr_zone WHERE brick = %s", (row['Brick'],))
                    hmr_zone = cur.fetchone()
                    if hmr_zone is None:
                        cur.execute("""
                            INSERT INTO hmr_zone (brick, fk_id_Delegate, fk_id_Region, fk_id_District, fk_id_Town)
                            VALUES (%s, %s, %s, %s, %s) RETURNING brick
                        """, (row['Brick'], delegate_id, region_id, district_id, town_id))
                        hmr_zone = cur.fetchone()
                    hmr_zone_id = hmr_zone[0]

                    # Prepare row for batch insertion into `Sale`
                    data_batch.append((
                        row['Brick'],
                        product_id,
                        row['Date'],
                        row['Value']
                    ))
                    sale_id = None  # Replace with logic to obtain `sale_id` if needed

                    # Check and insert into `sale_product`
                    cur.execute("SELECT * FROM sale_product WHERE fk_id_sale = %s AND fk_cnp = %s AND product_amount = %s", (sale_id, product_id, row[8]))
                    sale_product = cur.fetchone()
                    if sale_product is None:
                        cur.execute("""
                            INSERT INTO sale_product (fk_id_sale, fk_cnp, product_amount)
                            VALUES (%s, %s, %s) RETURNING (fk_id_sale, fk_cnp);
                            """, (sale_id, product_id, row[8]))
                    sale_product = cur.fetchone()

                # Insert data in batches
                insert_query = """
                INSERT INTO sale (registry_date, fk_brick) VALUES (%s, %s)
                """
                cur.executemany(insert_query, [(item[2], item[0]) for item in data_batch])

                # Commit the transaction for this batch
                conn.commit()

            except Exception as e:
                print("Error during batch insert:", e)
                conn.rollback()

print("Batch inserts completed successfully.")
