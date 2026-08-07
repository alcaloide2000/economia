import pandas as pd
import streamlit as st

from sources import NOTEBOOK_ID, NOTEBOOK_URL, SOURCES

st.set_page_config(page_title="Huerta de Soto — Índice de fuentes", page_icon="📚", layout="wide")


def source_type(title: str) -> str:
    return "PDF" if title.lower().endswith(".pdf") else "Video"


df = pd.DataFrame(SOURCES)
df["type"] = df["title"].apply(source_type)
df = df.rename(columns={"title": "Título", "type": "Tipo", "id": "Source ID"})
df = df[["Título", "Tipo", "Source ID"]]

st.title("📚 Índice de fuentes — Notebook \"Huerta de Soto\"")
st.caption(f"[Abrir notebook en NotebookLM]({NOTEBOOK_URL}) · ID `{NOTEBOOK_ID}` · {len(df)} fuentes")

col1, col2 = st.columns([3, 1])
with col1:
    query = st.text_input("Buscar por título", placeholder="p. ej. cálculo económico")
with col2:
    types = st.multiselect("Tipo", options=sorted(df["Tipo"].unique()), default=sorted(df["Tipo"].unique()))

filtered = df[df["Tipo"].isin(types)]
if query:
    filtered = filtered[filtered["Título"].str.contains(query, case=False, na=False)]

st.dataframe(filtered, use_container_width=True, hide_index=True)

st.caption(f"Mostrando {len(filtered)} de {len(df)} fuentes")
