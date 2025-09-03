'''This file have the code
that esxecutes'''

import pandas as pd
import re
import argparse


def processar_ficheiro(nomeficheiro,nomesheet):

    # Carregar o arquivo Excel
    df = pd.read_excel(nomeficheiro, sheet_name=nomesheet, dtype=str)

    # Renomear as colunas
    df.columns = ['Entidade', 'Empresa', 'Market_SubMarket_Product_Pack', 'SO_Units_M1', 'SO_Units_M2', 'SO_Units_M3']

    # Preencher para baixo os valores faltantes nas colunas 'Entidade' e 'Empresa'
    df['Entidade'] = df['Entidade'].ffill()
    df['Empresa'] = df['Empresa'].ffill()

    # Remover linhas completamente vazias
    df.dropna(how='all', inplace=True)

    # Preencher valores vazios nas colunas de unidades com 0 e converter para int
    for col in ['SO_Units_M1', 'SO_Units_M2', 'SO_Units_M3']:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)

    # Função para limpar a coluna 'Entidade'
    def clean_entidade(entidade):
        if isinstance(entidade, str):
            return entidade.lstrip(' +')
        return entidade

    # Aplicar a limpeza na coluna 'Entidade'
    df['Entidade'] = df['Entidade'].apply(clean_entidade)

    # Lista para armazenar os dados organizados
    data = []

    # Padrões para identificar submarkets, produtos e packs
    pattern_submarket = r'\bH\d{2}\b'   # Exemplo para submarkets
    pattern_product = r'^-\s*(.+)'      # Exemplo para produtos
    pattern_pack = r"^\s*(.+)"          # Exemplo para packs
    pattern_region = r'\d{3}'           # Padrão para identificar Regiões (contém números)

    # Variáveis de controle
    submarket_atual = None
    produto_atual = "N/D"
    delegado_atual = None  # Para guardar o último delegado lido
    regiao_atual = "N/D" # Para guardar a última região lida


    # Loop pelos dados
    for index, row in df.iterrows():
        entidade_atual = row['Entidade'].strip()  # Remover espaços em branco
        empresa_atual = row['Empresa'].strip() if isinstance(row['Empresa'], str) else 'N/D'
        market_info = row['Market_SubMarket_Product_Pack'].strip() if pd.notna(row['Market_SubMarket_Product_Pack']) else ""

        # Verifica se é Delegado ou Região
        if re.search(pattern_region, entidade_atual):
            # Se for uma região, usamos o último delegado encontrado e a região atual
            regiao_atual = entidade_atual
        else:
            # Se for um Delegado, atualizamos o último delegado
            delegado_atual = entidade_atual
            regiao_atual = 'N/D'

        # Verifica se é All Market
        if 'All Market' in market_info:
            market_to_use = 'All Market'
            data.append([delegado_atual, regiao_atual, empresa_atual, market_to_use, 'N/D', 'N/D', 
                        row['SO_Units_M1'], row['SO_Units_M2'], row['SO_Units_M3']])
            continue

        # Verifica se contém um código de submarket
        if re.search(pattern_submarket, market_info):
            submarket_atual = market_info.strip()  # Captura o submarket atual
            data.append([delegado_atual, regiao_atual, empresa_atual, submarket_atual, 'N/D', 'N/D', 
                        row['SO_Units_M1'], row['SO_Units_M2'], row['SO_Units_M3']])
        
        # Caso seja um produto no sub-market
        elif re.match(pattern_product, market_info):
            produto_atual = re.match(pattern_product, market_info).group(1).strip()  # Captura o produto atual
            data.append([delegado_atual, regiao_atual, empresa_atual, submarket_atual, produto_atual, 'N/D', 
                        row['SO_Units_M1'], row['SO_Units_M2'], row['SO_Units_M3']])
        
        # Caso seja um pack relacionado ao produto
        elif produto_atual and re.match(pattern_pack, market_info):
            pack_atual = re.match(pattern_pack, market_info).group(1).strip()  # Captura o pack atual
            data.append([delegado_atual, regiao_atual, empresa_atual, submarket_atual, produto_atual, pack_atual, 
                        row['SO_Units_M1'], row['SO_Units_M2'], row['SO_Units_M3']])

    data = data[1:]

    # Criação do DataFrame de saída
    df_final = pd.DataFrame(data, columns=['Delegado', 'Regiao', 'Empresa', 'Market', 'Product', 'Pack', 'Mes1', 'Mes2', 'Mes3'])
    
    # Expressão regular para capturar o padrão
    pattern = r".*_(\d{1,2})_(\d{2}|\d{4})\.xlsx$"

    # Aplicar a regex
    match = re.match(pattern, nomeficheiro)
    

    if match:
        # Captura o mês e o ano
        month = match.group(1).zfill(2)  # Adiciona zero à esquerda se necessário
        year = match.group(2)[-2:]       # Garante que o ano é de 2 dígitos
        # Cria o novo nome
        new_filename = f"{month}_{year}.csv"
        print(f"Novo nome do ficheiro: {new_filename}")
        # Salvar como CSV
        df_final.to_csv("uploads/conc_csv/"+new_filename, sep=';', index=False)
        print("CSV gerado com sucesso!")
    else:
        print("Formato do nome do ficheiro inválido!")

        


if __name__ == "__main__":

    parser = argparse.ArgumentParser(description="Process file")
    parser.add_argument("path", help="path to file")

    args = parser.parse_args()

    processar_ficheiro(args.path,"Total Concorrência Regiões")
