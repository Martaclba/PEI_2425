import pandas as pd

# Ler o ficheiro Excel
df = pd.read_excel(
    'backend/data_treat/Base_de_Dados_Vendas_hmR.xlsx',
    sheet_name='Base de Dados hmR',
    skiprows=10,  # Ignorar as primeiras 10 linhas
    header=0,     # Usar a linha 11 como cabeçalho
    dtype=str     # Garantir que todas as colunas sejam lidas como strings
)


# Definir as colunas de ID esperadas
id_columns = ['Brick', 'DIM', 'District', 'Region HMR', 'Parish', 'Company', 'Product']

# Identificar automaticamente colunas de meses com base no formato
month_columns = [col for col in df.columns if '/' in str(col)]

# Renomear colunas corretamente se necessário
if len(month_columns) == 0:
    # Criar nomes padrão para os meses, assumindo que as colunas adicionais correspondem a períodos
    new_month_columns = [
        f"{month}/{year}" for year in range(2018, 2025) for month in ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
    ][: len(df.columns) - len(id_columns)]
    df.columns = id_columns + new_month_columns


# Tratar valores nulos ou inválidos em `id_columns`
for coluna in id_columns:
    df[coluna] = df[coluna].replace(['', '0', None], 'N/D')  # Substituir strings vazias, zeros ou None por 'N/D'

def clean_entidade(entidade):
    if isinstance(entidade, str):
        ent = entidade.lstrip('+')
        return ent.lstrip('-').strip()  # Remover espaços extras
    return entidade

if 'Product' in df.columns:
    df['Product'] = df['Product'].apply(clean_entidade)
else:
    print("A coluna 'Product' não foi encontrada.")

if 'Company' in df.columns:
    df['Company'] = df['Company'].apply(clean_entidade)
else:
    print("A coluna 'Company' não foi encontrada.")

# Converter colunas de meses para numérico, preenchendo valores nulos com 0
for coluna in new_month_columns:
    df[coluna] = pd.to_numeric(df[coluna], errors='coerce').fillna(0)

# Salvar o arquivo processado
df.to_csv('backend/data_treat/vendas_wide.csv', sep=';', encoding='utf-8', index=False)
