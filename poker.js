// Elementos del DOM
var playerCards = document.getElementById('playerCards');
var communityCards = document.getElementById('communityCards');
var bot1Cards = document.getElementById('bot1Cards');
var bot2Cards = document.getElementById('bot2Cards');
var bot3Cards = document.getElementById('bot3Cards');
var betButton = document.getElementById('betButton');
var raiseButton = document.getElementById('raiseButton');
var nextRoundButton = document.getElementById('nextRoundButton');
var dealButton = document.getElementById('dealButton');
var flopButton = document.getElementById('flopButton');
var turnButton = document.getElementById('turnButton');
var riverButton = document.getElementById('riverButton');
var betAmountInput = document.getElementById('betAmount');
var message = document.getElementById('message');
var playerMoneyDisplay = document.getElementById('playerMoney');
var potDisplay = document.getElementById('pot');
var resetButton = document.getElementById('resetButton');
var continueButton = document.getElementById('continueButton');

// Variables del juego
var baraja = ['A♠', '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠',
              'A♥', '2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥',
              'A♦', '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦',
              'A♣', '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣'];
var playerBet = 0;
var bot1Bet = 0;
var bot2Bet = 0;
var bot3Bet = 0;
var round = 0;
var playerHand = [];
var bot1Hand = [];
var bot2Hand = [];
var bot3Hand = [];
var playerMoney = 1000;
var bot1Money = 1000;
var bot2Money = 1000;
var bot3Money = 1000;
var pot = 0;
var flopCards = [];
var turnCard = null;
var riverCard = null;
var barajaBarajada = [];

// Mostrar el dinero del jugador y de los bots
playerMoneyDisplay.textContent = "Dinero del jugador: $" + playerMoney;
potDisplay.textContent = "Bote: $" + pot;

// Función para barajar la baraja
function barajarBaraja(baraja) {
    if (baraja.length !== 52) {
        message.textContent = "La baraja debe tener 52 cartas.";
        return [];
    }
    for (var i = baraja.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = baraja[i];
        baraja[i] = baraja[j];
        baraja[j] = temp;
    }
    return baraja;
}

// Función para repartir las cartas
function repartirCartas(baraja, numJugadores) {
    var manos = Array.from({ length: numJugadores }, () => []);
    var jugadorActual = 0;

    while (baraja.length > 52 - (numJugadores * 2)) {
        manos[jugadorActual].push(baraja.pop());
        jugadorActual = (jugadorActual + 1) % numJugadores;
    }

    return manos;
}

// Función para hacer una apuesta
function hacerApuesta(cantidad) {
    if (cantidad > playerMoney) {
        message.textContent = "No tienes suficiente dinero para hacer esta apuesta.";
        return false;
    }
    playerBet += cantidad;
    playerMoney -= cantidad;
    pot += cantidad;

    // Los bots igualan la apuesta del jugador
    if (cantidad > bot1Money) {
        bot1Bet += bot1Money;
        bot1Money = 0;
        pot += bot1Bet;
    }else { bot1Bet += cantidad;
            bot1Money -= cantidad;
            pot += cantidad;}

    if (cantidad > bot2Money) {
        bot2Bet += bot2Money;
        bot2Money = 0;
        pot += bot2Bet;
    }else { bot2Bet += cantidad;
            bot2Money -= cantidad;
            pot += cantidad;}

     if (cantidad > bot3Money) {
        bot3Bet += bot3Money;
        bot3Money = 0;
        pot += bot3Bet;
    }else{  bot3Bet += cantidad;
            bot3Money -= cantidad;
            pot += cantidad;}

    actualizarDisplayDinero();
    message.textContent = "Has apostado $" + cantidad;
    return true;
}

// Función para subir la apuesta
function subirApuesta(cantidad) {
    if (cantidad > playerMoney) {
        message.textContent = "No tienes suficiente dinero para hacer esta apuesta.";
        return false;
    }
    playerBet += cantidad;
    playerMoney -= cantidad;
    pot += cantidad;
        if (cantidad > bot1Money) {
        bot1Bet += bot1Money;
        bot1Money = 0;
        pot += bot1Bet;
    }else { bot1Bet += cantidad;
            bot1Money -= cantidad;
            pot += cantidad;}

    if (cantidad > bot2Money) {
        bot2Bet += bot2Money;
        bot2Money = 0;
        pot += bot2Bet;
    }else { bot2Bet += cantidad;
            bot2Money -= cantidad;
            pot += cantidad;}

     if (cantidad > bot3Money) {
        bot3Bet += bot3Money;
        bot3Money = 0;
        pot += bot3Bet;
    }else{  bot3Bet += cantidad;
            bot3Money -= cantidad;
            pot += cantidad;}

    actualizarDisplayDinero();
    message.textContent = "Has subido la apuesta en $" + cantidad;
    return true;
}

// Función para actualizar el display del dinero
function actualizarDisplayDinero() {
    playerMoneyDisplay.textContent = "Dinero del jugador: $" + playerMoney;
    potDisplay.textContent = "Bote: $" + pot;

    // Mostrar el dinero de todos los jugadores en una lista
    var listaDinero = `
        <ul>
            <li>Jugador: $${playerMoney}</li>
            <li>Bot 1: $${bot1Money}</li>
            <li>Bot 2: $${bot2Money}</li>
            <li>Bot 3: $${bot3Money}</li>
        </ul>
    `;
    document.getElementById('moneyList').innerHTML = listaDinero;
}

// Función para mostrar el flop
function mostrarFlop() {
    if (barajaBarajada.length < 3) {
        message.textContent = "No hay suficientes cartas en la baraja para el flop.";
        return;
    }
    flopCards = [barajaBarajada.pop(), barajaBarajada.pop(), barajaBarajada.pop()];
    communityCards.textContent = "Flop: " + flopCards.join(', ');
    message.textContent = "Se ha mostrado el flop.";
    flopButton.style.display = 'none'; // Ocultar el botón de flop
}

// Función para mostrar el turn
function mostrarTurn() {
    if (barajaBarajada.length < 1) {
        message.textContent = "No hay suficientes cartas en la baraja para el turn.";
        return;
    }
    turnCard = barajaBarajada.pop();
    communityCards.textContent += ", Turn: " + turnCard;
    message.textContent = "Se ha mostrado el turn.";
    turnButton.style.display = 'none'; // Ocultar el botón de turn
}

// Función para mostrar el river
function mostrarRiver() {
    if (barajaBarajada.length < 1) {
        message.textContent = "No hay suficientes cartas en la baraja para el river.";
        return;
    }
    riverCard = barajaBarajada.pop();
    communityCards.textContent += ", River: " + riverCard;
    message.textContent = "Se ha mostrado el river.";
    riverButton.style.display = 'none'; // Ocultar el botón de river
}

// Función para determinar el ganador
function determinarGanador() {
   /*
   Este array esta hecho como objeto porque era la única forma en la que funciona.
   Para ello pedí ayuda.
   */ 
    var manosCompletas = [
        { mano: playerHand.concat(flopCards, turnCard, riverCard), jugador: 'Jugador', dinero: playerMoney },
        { mano: bot1Hand.concat(flopCards, turnCard, riverCard), jugador: 'Bot 1', dinero: bot1Money },
        { mano: bot2Hand.concat(flopCards, turnCard, riverCard), jugador: 'Bot 2', dinero: bot2Money },
        { mano: bot3Hand.concat(flopCards, turnCard, riverCard), jugador: 'Bot 3', dinero: bot3Money }
    ];

    manosCompletas.forEach(function(jugador) {
        jugador.valorMano = evaluarMano(jugador.mano);
    });

    manosCompletas.sort(function(a, b) {
        return b.valorMano - a.valorMano;
    });

    var ganador = manosCompletas[0];
    ganador.dinero += pot;
    pot = 0;

    // Actualizar el dinero del ganador
    if (ganador.jugador === 'Jugador') {
        playerMoney = ganador.dinero;
    } else if (ganador.jugador === 'Bot 1') {
        bot1Money = ganador.dinero;
    } else if (ganador.jugador === 'Bot 2') {
        bot2Money = ganador.dinero;
    } else if (ganador.jugador === 'Bot 3') {
        bot3Money = ganador.dinero;
    }

    actualizarDisplayDinero();

    potDisplay.textContent = "Bote: $" + pot;
    message.textContent = "El ganador es: " + ganador.jugador + " con la combinación: " + obtenerNombreCombinacion(ganador.valorMano);

    // Mostrar las cartas de todos los jugadores
    playerCards.textContent = "Cartas del Jugador: " + playerHand.join(', ');
    bot1Cards.textContent = "Cartas del Bot 1: " + bot1Hand.join(', ');
    bot2Cards.textContent = "Cartas del Bot 2: " + bot2Hand.join(', ');
    bot3Cards.textContent = "Cartas del Bot 3: " + bot3Hand.join(', ');

    // Mostrar las cartas de todos los jugadores en una lista
    var listaCartas = `
        <ul>
            <li>Jugador: ${playerHand.join(', ')}</li>
            <li>Bot 1: ${bot1Hand.join(', ')}</li>
            <li>Bot 2: ${bot2Hand.join(', ')}</li>
            <li>Bot 3: ${bot3Hand.join(', ')}</li>
        </ul>
    `;
    message.innerHTML += listaCartas;

    // Mostrar el botón de seguir jugando
    continueButton.classList.remove('hidden');
}

// Función para reiniciar la partida manteniendo el dinero actual
function seguirJugando() {
    // Restablecer las variables del juego excepto el dinero
    playerBet = 0;
    bot1Bet = 0;
    bot2Bet = 0;
    bot3Bet = 0;
    round = 0;
    playerHand = [];
    bot1Hand = [];
    bot2Hand = [];
    bot3Hand = [];
    pot = 0;
    flopCards = [];
    turnCard = null;
    riverCard = null;
    barajaBarajada = [];

    // Actualizar la interfaz
    actualizarDisplayDinero();
    playerCards.textContent = "Cartas del Jugador: ";
    bot1Cards.textContent = "Cartas del Bot 1: ";
    bot2Cards.textContent = "Cartas del Bot 2: ";
    bot3Cards.textContent = "Cartas del Bot 3: ";
    communityCards.textContent = "Cartas Comunes: ";
    message.textContent = "Nueva ronda comenzada.";

    // Ocultar el botón de seguir jugando
    continueButton.classList.add('hidden');

    // Mostrar los botones de flop, turn y river
    flopButton.style.display = 'inline-block';
    turnButton.style.display = 'inline-block';
    riverButton.style.display = 'inline-block';
}

// Función para obtener el nombre de la combinación ganadora
function obtenerNombreCombinacion(valorMano) {
    switch (valorMano) {
        case 10: return "Escalera Real";
        case 9: return "Escalera de Color";
        case 8: return "Póker";
        case 7: return "Full House";
        case 6: return "Color";
        case 5: return "Escalera";
        case 4: return "Trío";
        case 3: return "Doble Pareja";
        case 2: return "Pareja";
        case 1: return "Carta Alta";
        default: return "Combinación Desconocida";
    }
}

// Función para evaluar la mano
function evaluarMano(mano) {
    // Ordenar las cartas por valor
    mano.sort((a, b) => valorCarta(b) - valorCarta(a));

    // Comprobar las diferentes combinaciones
    if (esEscaleraReal(mano)) return 10;
    if (esEscaleraDeColor(mano)) return 9;
    if (esPoker(mano)) return 8;
    if (esFullHouse(mano)) return 7;
    if (esColor(mano)) return 6;
    if (esEscalera(mano)) return 5;
    if (esTrio(mano)) return 4;
    if (esDoblePareja(mano)) return 3;
    if (esPareja(mano)) return 2;
    return 1; // Carta alta
}

// Funciones auxiliares para evaluar las combinaciones.
/*Para las funciones me vuelven a ayudar porque la forma en la que estaba no funcionaba.
 ' =>' es una función en flecha, te ahorra las llaves y lo hace más claro y conciso.
*/
function valorCarta(carta) {
    var valores = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14};
    return valores[carta.slice(0, -1)];
}

function esEscaleraReal(mano) {
    var palos = mano.map(carta => carta.slice(-1)); //Coge el último valor del string, el string lo devuelve carta.
    var valores = mano.map(carta => valorCarta(carta));
    return new Set(palos).size === 1 && valores.join('') === '1011121314';
}

function esEscaleraDeColor(mano) {
    var palos = mano.map(carta => carta.slice(-1));
    var valores = mano.map(carta => valorCarta(carta)).sort((a, b) => a - b);//Crea un array con los valores numéricos de las cartas y los ordena.
    return new Set(palos).size === 1 && valores.every((val, i, arr) => i === 0 || val === arr[i - 1] + 1);//Verifica si el valor actual es el primero del array o si es uno más que el valor anterior.
}

function esPoker(mano) {
    var valores = mano.map(carta => valorCarta(carta));
    return valores.some(val => valores.filter(v => v === val).length === 4); // Filtra el array para encontrar cuántas veces aparece el valor actual y verifica si es cuatro.
}

function esFullHouse(mano) {
    var valores = mano.map(carta => valorCarta(carta));
    var tres = valores.some(val => valores.filter(v => v === val).length === 3);//Verifica si algún valor aparece tres veces.
    var dos = valores.some(val => valores.filter(v => v === val).length === 2); //Verifica si algún valor aparece dos veces.
    return tres && dos;
}

function esColor(mano) {
    var palos = mano.map(carta => carta.slice(-1));
    return new Set(palos).size === 1;
}

function esEscalera(mano) {
    var valores = mano.map(carta => valorCarta(carta)).sort((a, b) => a - b);
    return valores.every((val, i, arr) => i === 0 || val === arr[i - 1] + 1);
}

function esTrio(mano) {
    var valores = mano.map(carta => valorCarta(carta));
    return valores.some(val => valores.filter(v => v === val).length === 3);
}

function esDoblePareja(mano) {
    var valores = mano.map(carta => valorCarta(carta));
    var parejas = valores.filter((val, i, arr) => arr.indexOf(val) !== i); //Filtra el array para encontrar los valores que aparecen más de una vez.
    return new Set(parejas).size === 2;
}

function esPareja(mano) {
    var valores = mano.map(carta => valorCarta(carta));
    return valores.some(val => valores.filter(v => v === val).length === 2);//Verifica que algo aparezca dos veces. 
}

function reiniciarPartida() {
    // Restablecer las variables del juego
    playerBet = 0;
    bot1Bet = 0;
    bot2Bet = 0;
    bot3Bet = 0;
    round = 0;
    playerHand = [];
    bot1Hand = [];
    bot2Hand = [];
    bot3Hand = [];
    playerMoney = 1000;
    bot1Money = 1000;
    bot2Money = 1000;
    bot3Money = 1000;
    pot = 0;
    flopCards = [];
    turnCard = null;
    riverCard = null;
    barajaBarajada = [];

    // Actualizar la interfaz
    playerMoneyDisplay.textContent = "Dinero del jugador: $" + playerMoney;
    potDisplay.textContent = "Bote: $" + pot;
    playerCards.textContent = "Tus cartas: ";
    bot1Cards.textContent = "Cartas del Bot 1: ";
    bot2Cards.textContent = "Cartas del Bot 2: ";
    bot3Cards.textContent = "Cartas del Bot 3: ";
    communityCards.textContent = "Cartas Comunitarias: ";
    message.textContent = "La partida ha sido reiniciada.";

    // Mostrar los botones de flop, turn y river
    flopButton.style.display = 'inline-block';
    turnButton.style.display = 'inline-block';
    riverButton.style.display = 'inline-block';
}


// Eventos para los botones
betButton.addEventListener('click', function() {
    var cantidad = parseInt(betAmountInput.value, 10);
    if (hacerApuesta(cantidad)) {
        console.log("Apuesta realizada: $" + cantidad);
    }
});

raiseButton.addEventListener('click', function() {
    var cantidad = parseInt(betAmountInput.value, 10);
    if (subirApuesta(cantidad)) {
        console.log("Apuesta subida: $" + cantidad);
    }
});

dealButton.addEventListener('click', function() {
    barajaBarajada = barajarBaraja([...baraja]); // Barajar la baraja y asignarla a barajaBarajada
    manos = repartirCartas(barajaBarajada, 4);
    playerHand = manos[0];
    bot1Hand = manos[1];
    bot2Hand = manos[2];
    bot3Hand = manos[3];
    playerCards.textContent = "Tus cartas: " + playerHand.join(', ');
    console.log("Tus cartas:", playerHand);
    console.log("Cartas del bot 1:", bot1Hand);
    console.log("Cartas del bot 2:", bot2Hand);
    console.log("Cartas del bot 3:", bot3Hand);
});

flopButton.addEventListener('click', function() {
    mostrarFlop();
});

turnButton.addEventListener('click', function() {
    mostrarTurn();
});

riverButton.addEventListener('click', function() {
    mostrarRiver();
});

nextRoundButton.addEventListener('click', function() {
    determinarGanador();
});

resetButton.addEventListener('click', function() {
    reiniciarPartida();
});

continueButton.addEventListener('click', function() {
    seguirJugando();
});