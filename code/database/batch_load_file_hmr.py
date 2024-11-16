import pandas as pd
import psycopg2
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
                # Create lists to hold data for batch inserts
                delegate_batch = []
                region_batch = []
                district_batch = []
                town_batch = []
                company_batch = []
                product_batch = []
                hmr_zone_batch = []
                sale_batch = []
                sale_product_batch = []

                # Process each row in the chunk
                for _, row in df.iterrows():
                    # Prepare data for batch inserts

                    # Delegate processing
                    delegate_id = None
                    cur.execute("SELECT id_Delegate FROM delegate WHERE name = %s", (row['DIM'].strip(),))
                    delegate = cur.fetchone()
                    if delegate is None:
                        delegate_batch.append((row['DIM'].strip(),))
                    else:
                        delegate_id = delegate[0]

                    # Region processing
                    region_id = None
                    cur.execute("SELECT id_Region FROM region WHERE name = %s", (row['Region HMR'].strip(),))
                    region = cur.fetchone()
                    if region is None:
                        region_batch.append((row['Region HMR'].strip(),))
                    else:
                        region_id = region[0]

                    # District processing
                    district_id = None
                    cur.execute("SELECT id_District FROM district WHERE name = %s", (row['District'].strip(),))
                    district = cur.fetchone()
                    if district is None:
                        district_batch.append((row['District'].strip(),))
                    else:
                        district_id = district[0]

                    # Town processing (if applicable)
                    town_id = None
                    if pd.notnull(row['Parish']) and row['Parish'].strip():
                        cur.execute("SELECT id_Town FROM town WHERE name = %s", (row['Parish'].strip(),))
                        town = cur.fetchone()
                        if town is None:
                            town_batch.append((row['Parish'].strip(),))
                        else:
                            town_id = town[0]

                    # Company processing
                    company_id = None
                    cur.execute("SELECT id_Company FROM company WHERE name = %s", (row['Company'].strip(),))
                    company = cur.fetchone()
                    if company is None:
                        company_batch.append((row['Company'].strip(),))
                    else:
                        company_id = company[0]

                    # Product processing
                    product_id = None
                    cur.execute("SELECT CNP FROM product WHERE name = %s AND fk_id_Company = %s", 
                                (row['Product'].strip(), company_id))
                    product = cur.fetchone()
                    if product is None:
                        product_batch.append((random.randint(1, 1000000000), row['Product'].strip(), company_id))
                    else:
                        product_id = product[0]

                    # HMR_Zone processing
                    hmr_zone_id = None
                    cur.execute("SELECT brick FROM hmr_zone WHERE brick = %s", (row['Brick'],))
                    hmr_zone = cur.fetchone()
                    if hmr_zone is None:
                        hmr_zone_batch.append((row['Brick'], delegate_id, region_id, district_id, town_id))
                    else:
                        hmr_zone_id = hmr_zone[0]

                    # Sale processing
                    cur.execute("""
                        INSERT INTO sale (registry_date, fk_brick) 
                        VALUES (%s, %s) RETURNING id_sale
                    """, (row['Date'], row['Brick']))
                    sale_id = cur.fetchone()[0]

                    # Sale Product processing
                    product_amount = row.iloc[8]  # Access the 9th column (index 8)
                    sale_product_batch.append((sale_id, product_id, product_amount))

                # Now insert all batch data at once
                if delegate_batch:
                    cur.executemany("INSERT INTO delegate (name) VALUES (%s) RETURNING id_Delegate", delegate_batch)
                if region_batch:
                    cur.executemany("INSERT INTO region (name) VALUES (%s) RETURNING id_Region", region_batch)
                if district_batch:
                    cur.executemany("INSERT INTO district (name) VALUES (%s) RETURNING id_District", district_batch)
                if town_batch:
                    cur.executemany("INSERT INTO town (name) VALUES (%s) RETURNING id_Town", town_batch)
                if company_batch:
                    cur.executemany("INSERT INTO company (name) VALUES (%s) RETURNING id_Company", company_batch)
                if product_batch:
                    cur.executemany("INSERT INTO product (CNP, name, fk_id_Company) VALUES (%s, %s, %s) RETURNING CNP", product_batch)
                if hmr_zone_batch:
                    cur.executemany("""
                        INSERT INTO hmr_zone (brick, fk_id_Delegate, fk_id_Region, fk_id_District, fk_id_Town)
                        VALUES (%s, %s, %s, %s, %s) RETURNING brick
                    """, hmr_zone_batch)
                if sale_product_batch:
                    cur.executemany("""
                        INSERT INTO sale_product (fk_id_sale, fk_cnp, product_amount)
                        VALUES (%s, %s, %s)
                    """, sale_product_batch)

                # Commit the entire transaction for this batch
                conn.commit()

            except Exception as e:
                print("Error during batch insert:", e)
                conn.rollback()

print("Batch inserts completed successfully.")
