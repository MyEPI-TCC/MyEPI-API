import app from './app.js';

const port = 3000;
app.listen(port, () => {
    console.log('Olá mundo!')
    console.log(`Escutando na porta ${port}`)
    console.log(`CTRL + Clique em http://localhost:${port}`)
});