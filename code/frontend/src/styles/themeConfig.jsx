const themeConfig = {
    components: { 
      "Table": {
        "headerBg": "#a93e3e",                // Background da header                
        "headerColor": "#ffffff",             // Texto da header
        "stickyScrollBarBg": "#565656",       // Backgroud da barra de scroll
        "headerSortHoverBg": "#C25858",       // Background da header com hover quando ela tem um sorter aplicado,
        "fixedHeaderSortActiveBg": "#C25858", // Mesma coisa do de cima mas para colunas fixas
        "headerSortActiveBg": "#C25858",      
      },
      "Button": {
        "defaultBg": "rgb(247,230,212)",
        "defaultBorderColor": "rgb(247,230,212)",
        "defaultHoverColor": "rgb(74,0,0)",
        "defaultHoverBorderColor": "rgb(74,0,0)",
        "defaultHoverBg": "rgb(247,230,212)",
        "defaultActiveBorderColor": "rgb(74,0,0)",
        "defaultActiveColor": "rgb(74,0,0)"
      }
    },
}

export default themeConfig