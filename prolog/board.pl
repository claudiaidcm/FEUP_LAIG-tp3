initialBoard([[sun]]).

/*Size colour type */
allCards([planet(small, red, terrestrial), planet(small, green, terrestrial), planet(medium, green, terrestrial), planet(large, green, terrestrial), planet(medium, blue, terrestrial),
          planet(small, red, gaseous), planet(small, green, gaseous), planet(medium, green, gaseous), planet(large, green, gaseous), planet(medium, blue, gaseous),
          planet(small, red, ringed), planet(small, green, ringed), planet(medium, green, ringed), planet(large, green, ringed), planet(small, blue, ringed),
          planet(medium, red, ringed), planet(large, red, ringed), planet(large, blue, terrestrial), planet(large, blue, gaseous), planet(large, blue, ringed),
          planet(medium, red, gaseous), planet(large, red, gaseous), planet(small, blue, terrestrial), planet(small, blue, gaseous), planet(small, blue, ringed),
          planet(medium, red, terrestrial), planet(large, red, terrestrial)
          ]).

printCards(List) :-
length(List, LenList),
getLenListNew(LenList, LenListNew),
writeNumbersRow(LenListNew, 1),
printLineCards(List, 0),
write('\n').

getLenListNew(LenList, LenListNew):-
LenList < 6,
LenListNew is LenList - 1.

getLenListNew(_, 5).

/*Prints each Line for Cards*/
printLineCards([], _).

printLineCards([Head|Tail], N) :-
    N < 6,
    symbol(Head, S),
    write(' '),
    write(S),
    write(' |'),
    N1 is N + 1,
    printLineCards(Tail, N1).

printLineCards(_, _).


printBoard([Head | Tail]) :-
    length(Head, LenList),
    writeNumbersRow(LenList, 0),
    writeDivisions(LenList),
    printMatrix([Head | Tail], 0, LenList).


%Writing Divisions%
writeDivisions(0) :- write('-----|-----|-----|\n').

writeDivisions(N) :-
    N > 0,
    N1 is N - 1,
    write('-----|'),
    writeDivisions(N1).


/* Write Top Row Of Numbers */

/* Base Case */
writeNumbersRow(N, CurrentNumber) :- 
    CurrentNumber > N + 1,
    write('\n').

/* Special Case to Add the First Space*/
writeNumbersRow(N, 0) :-
    write('     |'),
    writeNumber(0),
    writeNumbersRow(N, 1).

/* Recursive Case */
writeNumbersRow(N, CurrentNumber) :-
    CurrentNumber =< N + 1,
    writeNumber(CurrentNumber),
    N1 is CurrentNumber + 1,
    writeNumbersRow(N, N1).

/* Write Number*/
writeNumber(N) :-
N < 10,
write('  '), write(N), write('  |').

/* Write Number*/
writeNumber(N) :-
 write('  '), write(N), write(' |').


/* Prints N empty Spaces */
writeEmptySpaces(0) :-
    write('     |     |\n').

writeEmptySpaces(N) :-
    write('     |'),
    N1 is N-1,
    writeEmptySpaces(N1).



%Prints the Matrix
printMatrix([], N, LenList) :-
    writeNumber(N),
    writeEmptySpaces(LenList),
    write('\n').

printMatrix([Head | Tail], 0, LenList) :-
    writeNumber(0),
    writeEmptySpaces(LenList),
    writeDivisions(LenList),
    printMatrix([Head | Tail], 1, LenList).

printMatrix([Head | Tail], N, LenList) :-
    writeNumber(N),
    write('     |'),
    printLine(Head),
    write('     |\n'),
    writeDivisions(LenList),
    N1 is N+1,
    printMatrix(Tail, N1, LenList).


%Prints each Line
printLine([]).

printLine([Head|Tail]) :-
    symbol(Head, S),
    write(' '),
    write(S),
    write(' |'),
    printLine(Tail).

%Representing a player

symbol(empty, '   ').

symbol(sun, 'sun').

symbol(planet(Size, Colour, Type), S):-
    symbolSize(Size, S1),
    symbolColour(Colour, S2),
    symbolType(Type, S3),
    atom_concat(S1, S2, SF1),
    atom_concat(SF1, S3, S).

symbolColour(red,'R').
symbolColour(green,'G').
symbolColour(blue,'B').

symbolSize(small,'S').
symbolSize(medium,'M').
symbolSize(large,'L').

symbolType(terrestrial,'T').
symbolType(gaseous,'G').
symbolType(ringed,'R').
