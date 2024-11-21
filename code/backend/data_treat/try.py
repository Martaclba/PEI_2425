import csv
import pandas as pd

# Load the input CSV file
input_file = "backend/data_treat/vendas_wide.csv"  # Replace with the path to your input CSV file
output_file = "backend/data_treat/vendas_wide.csv"  # Replace with the desired output CSV file path

# Read the input CSV file
df = pd.read_csv(input_file, delimiter=";")

# Melt the DataFrame to unpivot the date columns
# Keep the identifying columns as-is, unpivot all date columns
id_vars = ["Brick", "DIM", "District", "Region HMR", "Parish", "Company", "Product"]
value_vars = [col for col in df.columns if col not in id_vars]  # Assume date columns are all other columns

# Perform the melting operation
melted_df = pd.melt(df, id_vars=id_vars, value_vars=value_vars, var_name="Date", value_name="Value")

# Optional: Convert the "Date" column to datetime format (helps with consistency)
melted_df["Date"] = pd.to_datetime(melted_df["Date"])

# Save the resulting DataFrame to a new CSV file
melted_df.to_csv(output_file, index=False, sep=";")