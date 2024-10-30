import pandas as pd
import openpyxl

# Criar campos para todos os meses
mes_ano = []
for ano in ["2018","2019","2020","2021","2022","2023"]:
    for mes in ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]:
        mes_ano.append(mes + "/" + ano)

for mes in ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto"]:
    mes_ano.append(mes + "/2024")

colunas = ["BRICK","DIM","Distrito","Regiao HMR", "Freguesia", "Empresa", "Produto"] + mes_ano

# Carregar o arquivo Excel
df = pd.read_excel('Ficheiro Interno MyPharma.xlsx', sheet_name='hmR COMPLETO', dtype=str)

df.columns = colunas

# Preenchendo os valores nulos na coluna "Freguesia" com "N/D"
df["Freguesia"] = df["Freguesia"].fillna("N/D")

# Limpar e converter colunas de meses/anos
for coluna in df.columns[7:]:
    df[coluna] = pd.to_numeric(df[coluna], errors='coerce').fillna(0).astype(int)


# Associar a cada 7 colunas unicas os valores de todos os meses
data = {}

for index, row in df.iterrows():
    chave_data = tuple(row.iloc[0:7])
    data.setdefault(chave_data, {mes: 0 for mes in mes_ano})

    # Atualiza os valores de cada mês
    for mes in mes_ano:
        data[chave_data][mes] += int(row[mes])# Soma os valores

try:
    with open("tuplo.txt", "w", encoding="utf-8") as f:
        for tupla in data.keys():
            valores_mensais = data[tupla]
            linha = f"{tupla}: {valores_mensais}\n"
            f.write(linha)
    print("Dados escritos em tuplo.txt com sucesso!")
except Exception as e:
    print(f"Erro ao escrever o arquivo: {e}")

# Lista para armazenar as linhas do DataFrame
data_rows = []

# Itera sobre o dicionário para coletar os dados
for chave_tuplo, dic_mes in data.items():
    # Constrói uma linha que combina os elementos do tuplo e os valores de mes_dict
    row = list(chave_tuplo) + [dic_mes.get(mes, 0) for mes in mes_ano]
    data_rows.append(row)

# Cria o DataFrame a partir da lista de linhas
df = pd.DataFrame(data_rows, columns=colunas)

# Escrevendo o DataFrame em um arquivo Excel
df.to_excel('dados_internos.xlsx', index=False, engine='openpyxl')  # ou engine='xlsxwriter'

# Salvar como CSV
#df.to_csv('dados_organizados.csv', sep=';',encoding='utf-8', index=False)