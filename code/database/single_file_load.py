import pandas as pd
import psycopg2
import tqdm

DB_USER = "mypharma"
DB_PASSWORD = "mypharma"
DB_HOST = "localhost"
DB_PORT = 5432
DB_NAME = "mypharma"

conn_string =f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

df = pd.read_csv("backend/data_treat/vendas_wide.csv",delimiter=';')

# Connect to the database
with psycopg2.connect(conn_string) as conn:
    with conn.cursor() as cur:
        cur.execute('BEGIN')
        
        try:
            for row in tqdm.tqdm(df.values):
                # Example row:

                # Delegate
                cur.execute(f"SELECT * FROM delegate WHERE name = '{row[1].strip()}';")
                delegate = cur.fetchone()
                if delegate is None:
                    cur.execute(f"INSERT INTO delegate (name) VALUES ('{row[1].strip()}') RETURNING id_delegate;")
                    delegate = cur.fetchone()
                delegate_id = delegate[0]

                # Handle the `District`
                cur.execute(f"SELECT * FROM district WHERE name = '{row[2].strip()}';")
                district = cur.fetchone()
                if district is None:
                    cur.execute(f"INSERT INTO district (name) VALUES ('{row[2].strip()}') RETURNING id_district;")
                    district = cur.fetchone()
                district_id = district[0]
                
                # Handle the `Region`
                cur.execute(f"SELECT * FROM region WHERE name = '{row[3].strip()}';")
                region = cur.fetchone()
                if region is None:
                    cur.execute(f"INSERT INTO region (name) VALUES ('{row[3].strip()}') RETURNING id_region;")
                    region = cur.fetchone()
                region_id = region[0]

                town_id = None
                if len(row[4]) > 1:
                    cur.execute(f"SELECT * FROM town WHERE name = '{row[4].strip()}';")
                    town = cur.fetchone()
                    if town is None:
                        cur.execute(f"INSERT INTO town (name) VALUES ('{row[4].strip()}') RETURNING id_town;")
                        town = cur.fetchone()
                    town_id = town[0]
                
                # Handle the `Company`
                cur.execute(f"SELECT * FROM company WHERE name = '{row[5].strip()}';")
                company = cur.fetchone()
                if company is None:
                    cur.execute(f"INSERT INTO company (name) VALUES ('{row[5].strip()}') RETURNING id_company;")
                    company = cur.fetchone()
                company_id = company[0]
                
                # Handle the `Product`
                cur.execute(f"SELECT * FROM product WHERE name = '{row[6].strip()}';")
                product = cur.fetchone()
                if product is None:
                    cur.execute(f"INSERT INTO product (name) VALUES ('{row[6].strip()}') RETURNING cnp;")
                    product = cur.fetchone()
                product_cnp = product[0]
                
                # Handle the Date and Value columns for each month
                for i in range(7, len(row)):  # Skipping first 7 columns
                    date_column = df.columns[i]
                    value_column = row[i]
                    
                    # Insert the value into your database (assuming a table that needs these monthly data)
                    # Assuming you have a table like `sales_data` to store the date and value for the specific product
                    cur.execute(
                        "INSERT INTO sales_data (cnp, date, value) VALUES (%s, %s, %s);",
                        (product_cnp, date_column, value_column)
                    )

            # Commit the transaction if all rows are processed successfully
            conn.commit()
        except Exception as e:
            # If an error occurs, rollback the transaction
            conn.rollback()
            print(f"An error occurred: {e}")
