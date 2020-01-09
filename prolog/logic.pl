addPiece(coord(X, Y), planet(Size, Colour, Type), OldBoard, NewBoard) :-
        addColumn(X, OldBoard, Board_1),
        addLine(Y, Board_1, Board_2),
        updateCoord(X, X1),
        updateCoord(Y, Y1), 
        valid_move(coord(X1, Y1), Board_2),
        subsPosition(NewBoard, Board_2, coord(X1, Y1), planet(Size, Colour, Type)).

/* Correct Coordenates after adjusting Board*/
updateCoord(0, 0).
updateCoord(X, NewX) :- NewX is X-1.

/* Check Move */
valid_move(coord(X, Y), Board) :-
findElement(coord(X, Y), Board, Element),
Element == 'empty',
!,
((X1 is X-1, findElement(coord(X1, Y), Board, Element1), Element1 \== 'empty');
(Y1 is Y-1, findElement(coord(X, Y1), Board, Element2), Element2 \== 'empty');
(X1 is X-1, Y1 is Y-1, findElement(coord(X1, Y1), Board, Element3), Element3 \== 'empty');
(X2 is X+1, findElement(coord(X2, Y), Board, Element4), Element4 \== 'empty');
(Y2 is Y+1, findElement(coord(X, Y2), Board, Element5), Element5 \== 'empty');
(X2 is X+1, Y2 is Y+1, findElement(coord(X2, Y2), Board, Element6), Element6 \== 'empty');
(X1 is X-1, Y2 is Y+1, findElement(coord(X1, Y2), Board, Element7), Element7 \== 'empty');
(X2 is X+1, Y1 is Y-1, findElement(coord(X2, Y1), Board, Element8), Element8 \== 'empty')).


findElement(coord(X, Y), Board, Element) :-
length(Board, LenList1), Y < LenList1, Y >= 0,
nth0(Y, Board, NewList),
length(NewList, LenList2), X < LenList2, X >= 0,
nth0(X, NewList, Element).

/* Adding Column */

addColumn(0, OldBoard, NewBoard) :-
    addEmptySpotFirst(OldBoard, NewBoard).

addColumn(X, [Head | Tail], NewBoard) :-
    length(Head, LenList),
    X > LenList,
    addEmptySpotLast([Head | Tail], NewBoard).

addColumn(_, OldBoard, OldBoard).

addEmptySpotLast([], []).

addEmptySpotLast([Head | Tail], [NewBoard | NewTail]) :-
    append(Head, [empty], NewBoard),
    addEmptySpotLast(Tail, NewTail).

addEmptySpotFirst([], []).

addEmptySpotFirst([Head | Tail], [NewBoard | NewTail]) :-
    append([empty], Head, NewBoard),
    addEmptySpotFirst(Tail, NewTail).


/* END Adding Column */

/* Adding Line */

addLine(0, [OldBoard | Tail], NewBoard) :-
    length(OldBoard, LenList),
    constructLine(LenList, NewList),
    append([NewList], [OldBoard | Tail], NewBoard).

addLine(X, [OldBoard | Tail], NewBoard) :-
    length([OldBoard | Tail], N_Lines),
    X > N_Lines,
    length(OldBoard, LenList),
    constructLine(LenList, NewList),
    append( [OldBoard | Tail], [NewList], NewBoard).

addLine(_, OldBoard, OldBoard).

constructLine(0, []).

constructLine(N, [NewLine | Tail]) :-
    N > 0,
    append([], empty, NewLine),
    N1 is N-1,
    constructLine(N1, Tail).

/* END Adding Line */

/* Finds List Where the element needs to be subs and replaces it */
subsPosition([NewBoard | Tail], [OldBoard | Tail], coord(X, 0), Element) :-
    replace(OldBoard, X, Element, NewBoard).

subsPosition([T | NewBoard], [T|L], coord(X, Y), Element) :-
    subsPosition(NewBoard, L, coord(X, Y1), Element),
    Y is Y1 + 1.

/* Subs Element at a certain Position of a List */

replace([_| Tail ], 0, Element, [Element | Tail]).

replace([H| Tail ], X, Element, [H | RecursiveTail]):-
    X > -1,
    NI is X-1,
    replace(Tail , NI, Element, RecursiveTail),
    !.

replace(L, _, _, L).

/*================================================================================================================*/
