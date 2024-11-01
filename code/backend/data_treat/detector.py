'''This file tries to 
identify the unique values
in each category'''

import pandas as pd
import re

# Carregar o arquivo Excel (substitua pelo caminho correto do arquivo)
df = pd.read_excel('hmR_Concorrência_Julho.xlsx', sheet_name='Total Concorrência Regiões', dtype=str)

# Renomear as colunas (ajustar conforme o cabeçalho real)
df.columns = ['Entidade', 'Empresa', 'Market_SubMarket_Product_Pack', 'SO_Units_May_2024', 'SO_Units_June_2024', 'SO_Units_July_2024']

# Encontrar o índice da linha que contém o cabeçalho "Team - Rep - HMR Region"
header_row = df[df['Entidade'] == 'Team - Rep - HMR Region'].index[0]

# Filtrar apenas as linhas após o cabeçalho
df_filtered = df.iloc[header_row + 1:].reset_index(drop=True)

# Preencher valores vazios nas colunas de 'Entidade' e 'Empresa'
df_filtered['Entidade'] = df_filtered['Entidade'].ffill()
df_filtered['Empresa'] = df_filtered['Empresa'].ffill()

# Padrões para identificar submarkets, produtos e packs
pattern_submarket = r'\bH\d{2}\b|\+All-Market|-All-Market'  # Exemplo para submarkets (inclui também All-Market) 
pattern_product = r'^\-\s*(.+)'                             # Exemplo para produtos
pattern_pack = r'^\s*(.+)'                                  # Exemplo para packs

# Dicionários para armazenar os valores únicos com seus números de linha
markets = {}  # Para submarkets
products = {}  # Para produtos
packs = {}     # Para packs

# Loop pelos dados filtrados
for index, row in df_filtered.iterrows():
    market_info = row['Market_SubMarket_Product_Pack'].strip() if pd.notna(row['Market_SubMarket_Product_Pack']) else ""

    # Verifica se é um submarket
    if re.search(pattern_submarket, market_info):
        markets[market_info.strip()] = index + header_row + 3  # Armazena o valor e a linha correspondente
    # Verifica se é um produto
    elif re.match(pattern_product, market_info):
        products[market_info.strip()] = index + header_row + 3  # Armazena o valor e a linha correspondente
    # Caso não seja um sub-market nem produto, classifica como pack
    elif re.match(pattern_pack, market_info):
        packs[market_info.strip()] = index + header_row + 3  # Armazena o valor e a linha correspondente

# Escrever os valores únicos em um arquivo
with open('resultado_unicos.txt', 'w',encoding='utf-8') as f:
    f.write("Unique Markets:\n")
    for market, line in sorted(markets.items()):
        f.write(f"{market} (Linha: {line})\n")

    f.write("\nUnique Products:\n")
    for product, line in sorted(products.items()):
        f.write(f"{product} (Linha: {line})\n")

    f.write("\nUnique Packs:\n")
    for pack, line in sorted(packs.items()):
        f.write(f"{pack} (Linha: {line})\n")

print("Arquivo de saída 'resultado_unicos.txt' gerado com sucesso!")
