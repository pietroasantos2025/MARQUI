# MARQUI — site institucional

Site estático, responsivo e sem dependências de instalação.

## Abrir

Abra `index.html` no navegador. Os estilos, interações e fotografias são carregados dos arquivos desta pasta.

## Publicar na Vercel pelo GitHub

1. Extraia `marqui-site-upload.zip` e coloque o conteúdo extraído no repositório: `index.html`, `styles.css`, `script.js` e a pasta `assets` devem ficar juntos no nível principal.
2. Na Vercel, deixe o **Root Directory** apontando para essa pasta. Em **Build & Development Settings**, use **Other** como Framework Preset; este site não precisa de comando de build. Como não há uma pasta `public`, os arquivos podem ser servidos a partir da raiz do projeto.
3. Envie os arquivos ao GitHub e aguarde a nova publicação da Vercel.

## WhatsApp

Os botões usam o número fornecido em `script.js`, na constante `WHATSAPP_NUMBER`, com uma mensagem inicial adequada a cada contexto.

## Arquivos

- `index.html`: conteúdo e estrutura semântica da página.
- `styles.css`: identidade visual, responsividade e movimento reduzido.
- `script.js`: navegação, filtro, portfólio, FAQ e CTAs.
- `assets/logo-marqui.png`: logo original enviada separadamente.
- `assets/marqui-photos.jpg`: fotografias conceituais locais.

Os exemplos do portfólio são conceituais, e as fotografias são ilustrativas.
