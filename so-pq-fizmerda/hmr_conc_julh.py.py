''' This file code provides a tool
to read and record data from files as 
hmR_Mypharma_Agosto'''

import pandas as pd

# Definir os nomes das colunas manualmente
nomes_colunas = ['Regiao', 'Empresa', 'Medicamento', 'Mes1', 'Mes2','Mes3']

# Ler o ficheiro Excel a partir da linha 11, ignorando o cabeçalho original, e definindo os nomes das colunas
df = pd.read_excel('hmR_Concorrência_Julho.xlsx',sheet_name='Total Concorrência Regiões',dtype=str, names=nomes_colunas)


# Preencher as células unidas nas colunas 1 e 2 com o valor superior (forward fill)
df['Regiao'] = df['Regiao'].ffill()
df['Empresa'] = df['Empresa'].ffill()
df['Medicamento'] = df['Medicamento'].ffill()

# Remover o apóstrofo das colunas 1, 2 e 3, se presente
for coluna in ['Regiao', 'Empresa', 'Medicamento']:
    df[coluna] = df[coluna].astype(str).str.lstrip("'")

# Converter Mes1, Mes2 e Mes3 para tipo inteiro
for mes in ['Mes1', 'Mes2', 'Mes3']:
    df[mes] = pd.to_numeric(df[mes], errors='coerce').fillna(-1).astype(int) 

# Garantir que as colunas Regiao, Empresa e Medicamento sejam strings
for coluna in ['Regiao', 'Empresa', 'Medicamento']:
    df[coluna] = df[coluna].astype(str)

df = df.iloc[10:]

df.to_csv('output.csv',sep=';', encoding='utf-8',index=False)
