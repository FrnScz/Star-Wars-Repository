let currentPageUrl = 'https://swapi.dev/api/people/';

window.onload = async () => {
    try {
        await loadCharacters(currentPageUrl)
    } catch (error) { 
        console.log(error);
        alert('Error loading characters');
    }

    const nextButton = document.getElementById('next-button');
    const backButton = document.getElementById('back-button');

    nextButton.addEventListener('click', loadNextPage); // serve para monitorar um evento do button e executar ele 
    backButton.addEventListener('click', loadPreviousPage);
};

async function  loadCharacters(url) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // limpa os resultados anteriores 

    try {   
        const response =  await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((character) => { 
            const card = document.createElement("div"); // serve para criar um novo elemento html com o javascript
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')` // /\D/g, "" = é regexp, ele faz uma expressão matemática apenas para pegar o id do personagem
            card.className = "cards" // serve para dar uma classe para a variavel

            const characterNameBg = document.createElement("div")
            characterNameBg.className = "character-name-bg"

            const characterName = document.createElement("span")
            characterName.className = "character-name"

            characterName.innerText = `${character.name}`

            characterNameBg.appendChild(characterName)  // insere um elemento dentro de outro
            card.appendChild(characterNameBg)

            card.onclick = () => {
                const modal = document.getElementById("modal")
                modal.style.visibility = "visible"

                const modalContent = document.getElementById("modal-content") 
                modalContent.innerHTML = ''

                const characterImage = document.createElement("div")
                characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`

                characterImage.className = "character-image"

                const name = document.createElement("span")
                name.className = "character-details"
                name.innerText = `Nome: ${character.name}`

                const characterHeight = document.createElement("span")
                characterHeight.className = "character-details"
                characterHeight.innerText = `Altura: ${convertHeight(character.height)}`

                const mass = document.createElement("span")
                mass.className = "character-details"
                mass.innerText = `Peso: ${convertMass(character.mass)}`

                const eyeColor = document.createElement("span")
                eyeColor.className = "character-details"
                eyeColor.innerText = `Cor dos olhos: ${convertEyeColor(character.eye_color)}`

                const birthYear = document.createElement("span")
                birthYear.className = "character-details"
                birthYear.innerText = `Nascimento: ${convertBirthYear(character.birth_year)}`

                modalContent.appendChild(characterImage)
                modalContent.appendChild(name)
                modalContent.appendChild(characterHeight)
                modalContent.appendChild(mass)
                modalContent.appendChild(eyeColor)
                modalContent.appendChild(birthYear)
            }

            mainContent.appendChild(card)
        });

        const nextButton = document.getElementById('next-button')
        const backButton = document.getElementById('back-button')
        nextButton.disable = !response.next // desabilita o button quando a pagina chegar no final, se usado sem o ! ele vai ficar desabilitado sempre
        backButton.disable = !response.Previous // desabilita o button quando a pagina estiver no inicio 

        backButton.style.visibility = responseJson.previous? "visible" : "hidden"

        currentPageUrl = url

    } catch (error) {
        alert('Error loading characters');
        console.log(error);
    }
}

async function loadNextPage() {
    if (!currentPageUrl) return;

    try{
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()

        await loadCharacters(responseJson.next)
    } catch(error) {
        console.log(error)
        alert('Error to load the next page')
    }
}

async function loadPreviousPage() {
    if (!currentPageUrl) return;

    try{
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()
        
        await loadCharacters(responseJson.Previous)
    } catch(error) {
        console.log(error)
        alert('Error to load the previous page')
    }
}

function hideModal() {
    const modal = document.getElementById("modal")
    modal.style.visibility = "hidden"
}

function convertEyeColor(eyeColor) {
    const cores = {
        blue: "azul",
        brown: "castanho",
        green: "verde",
        yellow: "amarelo",
        black: "preto",
        pink: "rosa",
        red: "vermelho",
        orange: "laranja",
        hazel: "avelã",
        unknown: "desconhecido"};

    return cores[eyeColor.toLowerCase()] || eyeColor;
      };


function convertHeight(height){
    if (height === "unknown") {
        return "desconhecido"
    }    
 return (height / 100).toFixed(2);  }

 
function convertMass (mass) {
    if (mass === "unknown") {
        return "desconhecido"
    }  
    return `${mass} Kg`  
}

function convertBirthYear (birthYear) {
    if (birthYear === "unknown") {
        return "desconhecido"
    }    
    return birthYear
}
