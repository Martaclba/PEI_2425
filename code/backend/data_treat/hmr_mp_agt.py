''' This file code provides a tool
to read and record data from files as 
hmR_Mypharma_Agosto'''

import pandas as pd
import argparse

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

df.to_csv('output.csv',sep=';', encoding='utf-8',index=False)
