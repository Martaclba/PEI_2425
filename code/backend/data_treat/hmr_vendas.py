import pandas as pd

# Ler o ficheiro Excel a partir da linha 11, ignorando o cabeçalho original
df = pd.read_excel('Base_de_Dados_Vendas_hmR.xlsx', sheet_name='Base de Dados hmR', dtype=str)


# Definir as colunas de ID (as primeiras 7)
id_columns = ['Brick', 'DIM', 'District', 'Region HMR', 'Parish', 'Company', 'Product']

# Definir o número de colunas de mês (restantes)
month_columns = df.columns[len(id_columns):]  # O resto das colunas


# Agora, podemos atribuir corretamente os nomes das colunas
df.columns = id_columns + month_columns.tolist()

# Preencher para baixo os valores faltantes em todas as colunas
df = df.ffill()


# Remover linhas completamente vazias
df.dropna(how='all', inplace=True)

# Converter todas as colunas para string (se necessário)
for coluna in df.columns:
    df[coluna] = df[coluna].astype(str)

def clean_entidade(entidade):
    if isinstance(entidade, str):
        ent = entidade.lstrip('+')
        return ent.lstrip('-')
    return entidade


df['Product'] = df['Product'].apply(clean_entidade)

# Ignorar as primeiras 10 linhas (já que você tem a linha de cabeçalho do Excel em outro lugar)
df = df.iloc[10:]

# *** Data Reshaping to Long Format ***
# Realizando o "melt" para transformar de formato largo para longo
df_long = df.melt(id_vars=id_columns, value_vars=month_columns, var_name='Date', value_name='Value')

# *** Convertendo a coluna 'Date' para datetime ***
# Aqui, assumimos que o formato da data está em 'Month Year' (ex. 'Jan 2024')
df_long['Date'] = pd.to_datetime(df_long['Date'], format='%b %Y')

# *** Salvar o arquivo processado ***
# Gravar os dados em um arquivo CSV
df_long.to_csv('vendas_long.csv', sep=';', encoding='utf-8', index=False)

