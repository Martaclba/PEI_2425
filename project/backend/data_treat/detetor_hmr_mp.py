'''This file tries to 
identify the unique values
in each category'''

import pandas as pd
import re

# Carregar o arquivo Excel (substitua pelo caminho correto do arquivo)
df = pd.read_excel('hmR_MyPharma_Agosto.xlsx',sheet_name='Total Mypharma Regiões',dtype=str)

# Renomear as colunas (ajustar conforme o cabeçalho real)
df.columns = ['Region', 'Entity', 'SO_Units']

# Encontrar o índice da linha que contém o cabeçalho "Team - Rep - HMR Region"
header_row = df[df['Entity'] == 'Manufacturer - Product - Pack'].index[0]

# Filtrar apenas as linhas após o cabeçalho
df_filtered = df.iloc[header_row + 1:].reset_index(drop=True)

df['Region'] = df['Region'].ffill()
df['Entity'] = df['Entity'].ffill()
df['SO_Units'] = df['SO_Units'].ffill()

# Dicionários para armazenar os valores únicos com seus números de linha
manufacturers = {}
products = {}

# Padrões para identificar Manufacturer e Product
pattern_manufacturer = r'^\-\s*(.+)'  # Assume que manufacturers começam com "- "
pattern_product = r'^\+\s*(.+)'       # Assume que produtos começam com "+ "

# Loop pelos dados filtrados
for index, row in df_filtered.iterrows():
    entity_info = row['Entity'].strip() if pd.notna(row['Entity']) else ""

    # Verifica se é um manufacturer
    if re.match(pattern_manufacturer, entity_info):
        manufacturers[entity_info.strip()] = index + header_row + 3  # Armazena o valor e a linha correspondente
    # Verifica se é um produto
    elif re.match(pattern_product, entity_info):
        products[entity_info.strip()] = index + header_row + 3  # Armazena o valor e a linha correspondente

# Escrever os valores únicos em um arquivo
with open('resultado_unicos.txt', 'w', encoding='utf-8') as f:
    f.write("Unique Manufacturers:\n")
    for manufacturer, line in sorted(manufacturers.items()):
        f.write(f"{manufacturer} (Linha: {line})\n")

    f.write("\nUnique Products:\n")
    for product, line in sorted(products.items()):
        f.write(f"{product} (Linha: {line})\n")

print("Arquivo de saída 'resultado_unicos.txt' gerado com sucesso!")
