''' This file code provides a tool
to read and record data from files as 
hmR_Mypharma_Agosto'''

import pandas as pd
import argparse
import re

# Definir os nomes das colunas manualmente

# Ler o ficheiro Excel a partir da linha 11, ignorando o cabeçalho original, e definindo os nomes das colunas
parser = argparse.ArgumentParser(description="Process file")
parser.add_argument("path", help="path to file")

args = parser.parse_args()

df = pd.read_excel(args.path,sheet_name='Total Mypharma Regiões',dtype=str)
df.columns = ['Region', 'Entity', 'SO_Units']

# Preencher para baixo os valores faltantes nas colunas 'Entidade' e 'Empresa'
df['Region'] = df['Region'].ffill()
df['Entity'] = df['Entity'].ffill()
df['SO_Units'] = df['SO_Units'].ffill()

# Remover linhas completamente vazias
df.dropna(how='all', inplace=True)

# Remover o apóstrofo das colunas 1, 2 e 3, se presente
for coluna in df.columns:
    df[coluna] = df[coluna].astype(str).str.lstrip("'")

def clean_entidade(entidade):
    if isinstance(entidade, str):
        ent = entidade.lstrip('+')
        return ent.lstrip('-')
    return entidade

df['Entity'] = df['Entity'].apply(clean_entidade)
df['Region'] = df['Region'].apply(clean_entidade)

# Garantir que as colunas Regiao, Empresa e Medicamento sejam strings
for coluna in df.columns:
    df[coluna] = df[coluna].astype(str)

df = df.iloc[10:]

# df.drop(df[df['Region'] == 'National'].index, inplace=True)

# Expressão regular para capturar o padrão
pattern = r".*_(\d{1,2})_(\d{2}|\d{4})\.xlsx$"

# Aplicar a regex
match = re.match(pattern, args.path)

if match:
    # Captura o mês e o ano
    month = match.group(1).zfill(2)  # Adiciona zero à esquerda se necessário
    year = match.group(2)[-2:]       # Garante que o ano é de 2 dígitos
    # Cria o novo nome
    new_filename = f"{month}_{year}.csv"
    print(f"Novo nome do ficheiro: {new_filename}")
    # Salvar como CSV
    df.to_csv("uploads/mypharma_csv/"+new_filename, sep=';', index=False)
    print("CSV gerado com sucesso!")
else:
    print("Formato do nome do ficheiro inválido!")
