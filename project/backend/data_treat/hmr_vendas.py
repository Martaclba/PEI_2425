import pandas as pd

# Ler o ficheiro Excel
df = pd.read_excel(
    'backend/data_treat/Base_de_Dados_Vendas_hmR.xlsx',
    sheet_name='Base de Dados hmR',
    skiprows=0,  # Ignorar as primeiras 10 linhas
    header=None,     # Usar a linha 11 como cabeçalho
    dtype=str     # Garantir que todas as colunas sejam lidas como strings
)

df = df[1:]
# Definir as colunas de ID esperadas
colunas = ['Brick', 'DIM', 'District', 'Region HMR', 'Parish', 'Company', 'Product']
y = ['2018','2019','2020','2021','2022','2023']
m = ['01', '02','03','04','05','06','07','08','09','10','11','12']
for y_ in y:
    for m_ in m:
        colunas.append(f'{y_}-{m_}-01')

for m_ in ['01', '02','03','04','05','06','07','08','09']:
    colunas.append(f'{2024}-{m_}-01')

df.columns = colunas


def clean_entidade(entidade):
    if isinstance(entidade, str):
        ent = entidade.lstrip('+')
        return ent.lstrip('-').strip()  # Remover espaços extras
    return entidade


for col in df.columns[:8]:
    df[col] = df[col].apply(clean_entidade)


# Tratar valores nulos ou inválidos em `id_columns`
df['Parish'] = df['Parish'].fillna(value="N/D") # Substituir strings vazias, zeros ou None por 'N/D'

for coluna in df[7:]:
    df[coluna] = df[coluna].fillna(0) # Substituir strings vazias, zeros ou None por '0'

print(df.head(20))

# Salvar o arquivo processado
df.to_csv('backend/data_treat/vendas_wide.csv', sep=';', encoding='utf-8', index=False)