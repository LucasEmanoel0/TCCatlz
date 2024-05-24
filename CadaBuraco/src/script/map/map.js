
// Variáveis globais
var map;
var infoDiv;
var infoWindow;
var raio = 15; // Raio de 15 metros
var raioCircle; // Variável para armazenar o círculo do raio
var marker; // Variável para armazenar o marcador
///
function playBip() {
    // URL do som de bip em MP3
    var bipSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    
    // Função para tocar o som repetidamente
    function playSound() {
        bipSound.currentTime = 0; // Reiniciar o som
        bipSound.play();
    }

    // Tocar o som imediatamente
    playSound();

    // Tocar o som a cada 300ms (ajuste conforme necessário para o seu som de bip)
    var interval = setInterval(playSound, 300);

    // Parar de tocar após 3 segundos
    setTimeout(function() {
        clearInterval(interval);
    }, 3000);
}

 ///

// Função de inicialização do mapa
async function initMap() {
    // Ícone para localização do buraco
    var localizacaoIcon = {
        url: '../../img/hole.png',
        scaledSize: new google.maps.Size(30, 30)
    };

    let currentMarkerType = 'localizacao';

    // Atualização periódica das coordenadas do banco de dados
    setInterval(  () => {
         fetch('recuperarcoordenada.php')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data && data.length > 0) {
                    verificarCoordenadasNoRaio(data);
                    adicionarMarcadoresDoBancoDeDados(data);
                } else {
                    console.log('Nenhuma coordenada encontrada no banco de dados.');
                }
            })
            .catch(function (error) {
                console.error('Erro na solicitação AJAX:', error);
            });
    }, 2000); // Atualização a cada 1000 milissegundos (1segundos)

    // Inicialização do mapa
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let userLatLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            let mapOptions = {
                zoom: 14,
                center: userLatLng,
                disableDefaultUI:true,
            };

            map = new google.maps.Map(document.getElementById('map'), mapOptions);

            // Criar o marcador de localização do usuário
            var iconLocalizacaoMarker = new google.maps.Marker({
                position: userLatLng,
                map: map,
                icon: {
                    url: 'https://cdn-icons-png.flaticon.com/128/4202/4202839.png',
                    scaledSize: new google.maps.Size(30, 30)
                },
            });

            // Atualiza a posição do usuário no mapa
            function updateUserPosition() {
                if (navigator.geolocation) {
                    navigator.geolocation.watchPosition(function (position) {
                        let newLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            
                        // Mover o marcador existente para a nova posição
                        if (iconLocalizacaoMarker) {
                            iconLocalizacaoMarker.setPosition(newLatLng);
                            map.panTo(newLatLng);
                            
                            // Atualizar o centro do círculo de raio
                            raioCircle.setCenter(newLatLng);
                        }
                    });
                }
            }
            updateUserPosition();

            // Criar o círculo de raio ao redor do marcador de localização
            raioCircle = new google.maps.Circle({
                map: map,
                center: userLatLng,
                radius: raio,
                fillColor: '#007bff',
                fillOpacity: 0.2,
                strokeColor: '#007bff',
                strokeOpacity: 0.8,
                strokeWeight: 2
            });

            iconLocalizacaoMarker.addListener('position_changed', function () {
                raioCircle.setCenter(iconLocalizacaoMarker.getPosition());
            });

            infoDiv = document.getElementById('info');
            infoWindow = new google.maps.InfoWindow();

            // Adicionar evento de clique no mapa
            // Adicionar evento de clique no mapa
map.addListener('click', function (event) {
    let confirmacao = confirm("Você deseja cadastrar um buraco nessa localização?");
    if (confirmacao) {
        marker = new google.maps.Marker({
            position: event.latLng,
            map: map,
            title: 'Novo Marcador de Localizacao',
            icon: localizacaoIcon
        });

        // Verificar se o marker foi criado com sucesso
        if (marker) {
            // Adicionar ouvintes de eventos ao marker
            marker.addListener('mouseover', handleMouseOver);
            marker.addListener('mouseout', handleMouseOut);

            if (currentMarkerType === 'localizacao') {
                enviarCoordenadas(event.latLng.lat(), event.latLng.lng());
            }
            Toastify({
                text: "buraco cadastrado com sucesso",
                duration: 5000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "green",
                },
                ariaLive: "polite",
                avatar: "../../img/buraco.png"
            }).showToast();
        } else {
            console.error('Erro ao criar o marcador.');
        }
    }
});


        }, function () {
            alert('Não foi possível obter sua localização.');
        });
    } else {
        alert('Seu navegador não suporta geolocalização.');
    }

    // Botão para adicionar raio
    var adicionarRaioButton = document.getElementById('adicionar-raio');
    adicionarRaioButton.addEventListener('click', function () {
        var raioInput = prompt('Informe a medida em metros para o raio em torno do Boneco(metros):');
        if (raioInput !== null) {
            raio = parseFloat(raioInput);
            if (!isNaN(raio) && raio > 0) {
                raioCircle.setRadius(raio);
                Toastify({
                    text: "raio adicionado para " + raioInput + " metros",
                    duration: 5000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                      background: "green",
                    },
                    ariaLive:"polite",
                    avatar:"../../img/circulo.png"
                  }).showToast();
                
            } else {
                alert('Por favor, insira um valor válido para o raio em metros.');
            }
        }
    });

    // Recuperar coordenadas do banco de dados e adicionar marcadores
    fetch('./recuperarcoordenada.php')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data && data.length > 0) {
                verificarCoordenadasNoRaio(data);
                adicionarMarcadoresDoBancoDeDados(data);
            } else {
                console.log('Nenhuma coordenada encontrada no banco de dados.');
            }
        })
        .catch(function (error) {
            console.error('Erro na solicitação AJAX:', error);
        })
}

// Função para lidar com o mouseover do marcador
function handleMouseOver() {
    var markerPosition = marker.getPosition();
    infoWindow.setContent('Latitude: ' + markerPosition.lat() + '<br>Longitude: ' + markerPosition.lng());
    infoWindow.open(map, marker);
}

// Função para lidar com o mouseout do marcador
function handleMouseOut() {
    infoWindow.close();
}

// Função para enviar coordenadas para o servidor
function enviarCoordenadas(latitude, longitude) {
    var formData = new FormData();
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    fetch('./salvarcoordenada.php', {
        method: 'POST',
        body: formData
    })
        .then(function (response) {
            return response.text();
        })
        .then(function (data) {
            console.log(data);
        })
        .catch(function (error) {
            console.error('Erro:', error);
        });
}

// Função para remover coordenadas do servidor
function removerCoordenadas(latitude, longitude) {
    var formData = new FormData();
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    fetch('./removercoordenada.php', {
        method: 'POST',
        body: formData
    })
        .then(function (response) {
            return response.text();
        })
        .then(function (data) {
            console.log(data);
        })
        .catch(function (error) {
            console.error('Erro:', error);
        });
}

// Função para verificar coordenadas dentro do raio
var alertedBuracos = {};
async function verificarCoordenadasNoRaio(coordenadasDoBanco) {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const usuarioLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        const geocoder = new google.maps.Geocoder();

        coordenadasDoBanco.forEach(coordenada => {
            const coo = new google.maps.LatLng(coordenada.latitude, coordenada.longitude);
            const distancia = google.maps.geometry.spherical.computeDistanceBetween(coo, usuarioLatLng);

            if (distancia <= raio && !alertedBuracos[coordenada.latitude]) {
                playBip()
                geocoder.geocode({ 'location': coo }, function(results, status) {
                    if (status === 'OK') {
                        if (results[0]) {
                            let enderecoFormatado = '';
                            const addressComponents = results[0].address_components;
                            for (let i = 0; i < addressComponents.length; i++) {
                                if (!addressComponents[i].types.includes('country') && 
                                    !addressComponents[i].types.includes('administrative_area_level_1') && 
                                    !addressComponents[i].types.includes('administrative_area_level_2') && 
                                    !addressComponents[i].types.includes('locality')) {
                                    enderecoFormatado += addressComponents[i].long_name + ', ';
                                }
                            }
                            enderecoFormatado = enderecoFormatado.slice(0, -2); // Remover a vírgula extra no final
                      
                            Toastify({
                                text: "Existe um buraco a " + distancia.toFixed(0) + " metros em " + enderecoFormatado,
                                duration: 5000,
                                destination: "https://github.com/apvarun/toastify-js",
                                newWindow: true,
                                close: true,
                                gravity: "top", 
                                position: "center", 
                                stopOnFocus: true, 
                                style: {
                                  background: "red",
                                },
                                ariaLive:"polite",
                                avatar:"../../img/hole.png"
                            }).showToast();
                        } else {
                            console.log('Nenhum resultado encontrado');
                        }
                    } else {
                        console.log('Geocoder falhou devido a: ' + status);
                    }
                });
                alertedBuracos[coordenada.latitude] = true;
                 // Definir o valor de alertedBuracos[coordenada.latitude] para falso depois de 1 minuto
                 setTimeout(() => {
                    alertedBuracos[coordenada.latitude] = false;
                    console.log(alertedBuracos);
                }, 60000); // 60000 milissegundos = 1 minuto
            }
        });
    } catch (error) {
        alert('Erro ao obter a localização do usuário:', error);
    }
}

// Função para adicionar marcadores do banco de dados no mapa
function adicionarMarcadoresDoBancoDeDados(coordenadasDoBanco) {
    coordenadasDoBanco.forEach(function (coordenada) {
        var marker = new google.maps.Marker({
            position: { lat: parseFloat(coordenada.latitude), lng: parseFloat(coordenada.longitude) },
            map: map,
            title: 'Marcador do Banco de Dados',
            icon: {
                url: '../../img/hole.png',
                scaledSize: new google.maps.Size(30, 30)
            }
        });

        marker.addListener('click', function () {
            console.log('Clicou em um marcador do banco de dados:', coordenada);
        });

        // Exibir informações no mouseover
        marker.addListener('mouseover', function () {
            var contentString = 'Latitude: ' + coordenada.latitude + '<br>Longitude: ' + coordenada.longitude;
            infoWindow.setContent(contentString);
            infoWindow.open(map, marker);
        });

        // Fechar o infoWindow quando o mouse sair do marcador
        marker.addListener('mouseout', function () {
            infoWindow.close();
        });
    });
}

