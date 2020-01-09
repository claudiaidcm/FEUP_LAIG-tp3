manageRow(Row) :-
    write('  > Row    '),
    read(Row).
    /* validateRow(Row, NewRow).*/

manageColumn(Column) :-
    write('  > Column '),
    read(Column).
    /* validateColumn(Column, NewColumn).*/

managePlanet(Planet, Cards) :-
    readPlanet(NewPlanet),
    checkPlanet(NewPlanet, Planet, Cards).

checkPlanet(NewPlanet, Planet, _):-
    Planet is NewPlanet.

checkPlanet(NewPlanet, Planet, Cards):-
    NewPlanet < 1,
    write('\nInvalid Planet :( \n'),
    managePlanet(Planet, Cards).

checkPlanet(NewPlanet, Planet, Cards):-
    length(Cards, SizeCards),
    NewPlanet > SizeCards,
    write('\nInvalid Planet :( \n'),
    managePlanet(Planet, Cards).

checkPlanet(NewPlanet, Planet, Cards):-
    NewPlanet > 6,
    write('\nInvalid Planet :( \n'),
    managePlanet(Planet, Cards).

readPlanet(Planet) :-
    write('  > Planet: '),
    read(Planet).

    

