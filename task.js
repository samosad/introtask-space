 /**
 * Создает экземпляр космического корабля.
 * @name Vessel
 * @param {String} name Название корабля.
 * @param {Number}[] position Местоположение корабля.
 * @param {Number} capacity Грузоподъемность корабля.
 */
function Vessel(name, position, capacity) {
    if(typeof(name) !== 'string' || name.length === 0) throw new Error("Некорректное название корабля");
    if(isNaN(capacity) || capacity < 0) throw new Error("Некорректно грузоподъемность корабля");

    if(!(position instanceof Array) || position.length !== 2)
        throw new Error('Некорректное местоположение корабля');
    else
        for(var i = 0; i < position.length; i++)
            if (isNaN(position[i]))
                throw new Error('Некорректная '+(i+1)+'-ая координата местоположения корабля');

    
    this.name = name;
	this.flyTo(position);
	this.capacity = capacity;
    this.cargoWeight = 0;
}

/**
 * Выводит текущее состояние корабля: имя, местоположение, доступную грузоподъемность.
 * @example
 * vessel.report(); // Грузовой корабль. Местоположение: Земля. Товаров нет.
 * @example
 * vesserl.report(); // Грузовой корабль. Местоположение: 50,20. Груз: 200т.
 * @name Vessel.report
 */
Vessel.prototype.report = function () {
    var message = "";
    message += "Корабль \"" + this.name + "\". ";
    message += "Местоположение: " + this.position + ". ";
    message += "Груз: " + (this.cargoWeight? this.cargoWeight + "т." : "Товаров нет.") ;
    return message;
};

/**
 * Выводит количество свободного места на корабле.
 * @name Vessel.getFreeSpace
 */
Vessel.prototype.getFreeSpace = function () {
    return this.capacity - this.cargo;
};

/**
 * Выводит количество занятого места на корабле.
 * @name Vessel.getOccupiedSpace
 */
Vessel.prototype.getOccupiedSpace = function () {
    return this.cargoWeight;
};

/**
 * Переносит корабль в указанную точку.
 * @param {Number}[]|Planet newPosition Новое местоположение корабля.
 * @example
 * vessel.flyTo([1,1]);
 * @example
 * var earth = new Planet('Земля', [1,1]);
 * vessel.flyTo(earth);
 * @name Vessel.report
 */
Vessel.prototype.flyTo = function (newPosition) {
    if (newPosition instanceof Planet) {
        this.position = newPosition.position;        
    } else if (newPosition instanceof Array && newPosition.length === 2) {
        this.position = newPosition;
    } else {
        console.log("Неверный параметр");
    }
};

/**
 * Создает экземпляр планеты.
 * @name Planet
 * @param {String} name Название Планеты.
 * @param {Number}[] position Местоположение планеты.
 * @param {Number} availableAmountOfCargo Доступное количество груза.
 */
function Planet(name, position, availableAmountOfCargo) {
    if(typeof name !== 'string' || name.length === 0)
        throw new Error("Указано некорректное название планеты");

    if(!(position instanceof  Array) || position.length !== 2)
        throw new Error('Указаны некорректные координаты планеты');

    for(var i = 0; i<position.length; i++)
        if (isNaN(position[i]))
            throw new Error('Указана некоректная '+(i+1)+'-ая координата планеты');

    if(isNaN(availableAmountOfCargo) || availableAmountOfCargo < 0)
        throw new Error('Указано некоректное значение доступного количества груза на планете');
        
    this.name = name;
    this.position = position;
	this.availableAmountOfCargo = availableAmountOfCargo;
}

/**
 * Выводит текущее состояние планеты: имя, местоположение, количество доступного груза.
 * @name Planet.report
 */
Planet.prototype.report = function () {
    var message = "";
    message += "Планета \"" + this.name + "\". ";
    message += "Местоположение: " + this.position + ". ";
    message += "Доступно груза: " + (this.availableAmountOfCargo? this.availableAmountOfCargo + "т." : "Грузов нет.") ;
    return message;
};

/**
 * Возвращает доступное количество груза планеты.
 * @name Vessel.getAvailableAmountOfCargo
 */
Planet.prototype.getAvailableAmountOfCargo = function () {
    return this.availableAmountOfCargo();
};

/**
 * Загружает на корабль заданное количество груза.
 * 
 * Перед загрузкой корабль должен приземлиться на планету.
 * @param {Vessel} vessel Загружаемый корабль.
 * @param {Number} cargoWeight Вес загружаемого груза.
 * @name Vessel.loadCargoTo
 */
Planet.prototype.loadCargoTo = function (vessel, cargoWeight) {
    if(!(vessel instanceof Vessel))
        throw new Error('Загружаемый объект должен быть кораблем');

    if(vessel.position[0] !== this.position[0] || vessel.position[1] !== this.position[1])
        throw new Error('Корабль должен находится на планете для загрузки');

    if(isNaN(cargoWeight) || cargoWeight < 0)
        throw new Error('Некорректно указан вес загружаемого груза');

    if(cargoWeight > this.availableAmountOfCargo)
        throw new Error('Вес загружемого груза превышает вес груза имеющегося на планете. Доступно для загрузки: ' + this.availableAmountOfCargo+'т.');

    if(cargoWeight > (vessel.capacity - vessel.cargoWeight)){
        throw new Error('Вес загружаемого груза превышает количество свободного места на корабле. Возможно загрузить не более ' + (vessel.capacity - vessel.cargoWeight)+'т. груза.');
    }
    else{
        vessel.cargoWeight += cargoWeight;
        this.availableAmountOfCargo = this.availableAmountOfCargo - cargoWeight;
    }
};

/**
 * Выгружает с корабля заданное количество груза.
 * 
 * Перед выгрузкой корабль должен приземлиться на планету.
 * @param {Vessel} vessel Разгружаемый корабль.
 * @param {Number} cargoWeight Вес выгружаемого груза.
 * @name Vessel.unloadCargoFrom
 */
Planet.prototype.unloadCargoFrom = function (vessel, cargoWeight) {
    if(!(vessel instanceof Vessel))
        throw new Error('Разгружаемый объект должен быть кораблем');

    if(vessel.position[0] !== this.position[0] || vessel.position[1] !== this.position[1])
        throw new Error('Корабль должен находится на планете для разгрузки');

    if(isNaN(cargoWeight) || cargoWeight < 0)
        throw new Error('Количество выгружаемого груза должно быть положительным числом');

    if(cargoWeight > vessel.cargoWeight){
       throw new Error ('На корабле недостаточное количество груза. Доступно для отгрузки: '+vessel.cargoWeight+'т. груза');
    }
    else{
        vessel.cargoWeight -= cargoWeight;
        this.availableAmountOfCargo += cargoWeight;
    }
};


// var yandex = new Vessel('Яндекс', [1, 1], 2000),
//     rambler = new Vessel('Рамблер', [10, 10], 1000),
//     earth = new Planet('Земля', [1, 1], 5000),
//     mars = new Planet('Марс', [100, 50], 3000);
// function tests() {        
//     yandex.report();
//     rambler.report();
//     earth.report();
//     earth.loadCargoTo(yandex, 100);
//     yandex.report();
//     earth.loadCargoTo(yandex, 2000);
//     yandex.flyTo([50, 50]);
//     yandex.flyTo(mars);
//     mars.unloadCargoFrom(yandex, 200);
//     yandex.report();
//     mars.unloadCargoFrom(yandex, 100);
//     yandex.report();
// }