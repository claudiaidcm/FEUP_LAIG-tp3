
/* ========================================================================== */
/* ================================ All Points ============================== */
/* Receives a List of Lists */
value(Board, Points):-
allPointsColumn(Board, PointsColumn),
allPointsRow(Board, 0, PointsRow),
allPointsDiagonal(Board, PointsDiagonal),
Points is PointsColumn + PointsRow + PointsDiagonal.

/* ========================================================================== */
/* =================== All Points In every Diagonal =========================== */
/* Receives a List of Lists */

allPointsDiagonal([], 0).

allPointsDiagonal([Head | Tail], Points) :-
length(Head, LenList),
allPointsDiagonalFirstRow([Head | Tail], LenList, 0, PointsFirstRow),
allPointsDiagonalOtherRows(Tail, 0, PointsOtherRows),
Points is PointsFirstRow + PointsOtherRows.

allPointsDiagonalFirstRow(_, 0, OldPoints, OldPoints).

allPointsDiagonalFirstRow(List, N, OldPoints, NewPoints) :- 
    diag(List, DiagList1, N),
    pointsInRow(DiagList1, NewPoints1),

    gaid(List, DiagList2, N),
    pointsInRow(DiagList2, NewPoints2),

    CurrentPoints is OldPoints + NewPoints1 + NewPoints2,
    N1 is N - 1,
    allPointsDiagonalFirstRow(List, N1, CurrentPoints, NewPoints).


allPointsDiagonalOtherRows([], OldPoints, OldPoints).

allPointsDiagonalOtherRows([Head | Tail], OldPoints, NewPoints) :-
length(Head, LenList),

diag([Head | Tail], DiagList1, 1),
pointsInRow(DiagList1, NewPoints1),

gaid([Head | Tail], DiagList2, LenList),
pointsInRow(DiagList2, NewPoints2),

Points is OldPoints + NewPoints1 + NewPoints2,
allPointsDiagonalOtherRows(Tail, Points, NewPoints).



diag(M,D, Desvio) :- findall(V, (nth1(I,M,X), I1 is I + Desvio - 1, nth1(I1,X,V)), D).
gaid(M,G, Desvio) :- length(M,L), findall(V, (nth1(I,M,X),J is L-I + Desvio - 2,nth1(J,X,V)), G).

/* ========================================================================== */
/* =================== All Points In every Column =========================== */
/* Receives a List of Lists */

allPointsColumn([], 0).

allPointsColumn([Head | Tail], Points) :-
length(Head, LenList),
allPointsColumnAUX([Head | Tail], LenList, 0, Points).

allPointsColumnAUX(_, 0, Points, Points).

allPointsColumnAUX(ListOfLists, LenList, Points, NewPoints) :-
pointsInColumn(ListOfLists, Points1, LenList),
NewLenList is LenList - 1,
NewPoints1 is Points + Points1,
allPointsColumnAUX(ListOfLists, NewLenList, NewPoints1, NewPoints).

/* ========================================================================= */
/* ====================== All Points In every Row ========================== */
/* Receives a List of Lists */

allPointsRow([], Points, Points).

allPointsRow([Head | Tail], Points, NewPoints) :-
pointsInRow(Head, Points1),
Points2 is Points + Points1,
allPointsRow(Tail, Points2, NewPoints).



/* =================== All Points In a Column =========================== */
pointsInColumn([], _, _).

pointsInColumn(ListOfLists, Points, N_element) :-
getColumnList(ListOfLists, [], ColumnList, N_element),
pointsInRow(ColumnList, Points).


/* Get a List with the Elements of a Column */
getColumnList([], List, List, _).

getColumnList([Head | Tail], List, NewList, N_element) :-
nth1(N_element, Head, Elem),
append(List, [Elem], TMP),
getColumnList(Tail, TMP, NewList, N_element).

/* =================== All Points In a Row =========================== */

pointsInRow(List, Points) :-
checkPointsSizeRow(List, 0, NewPoints_Size),
checkPointsColourRow(List, 0, NewPoints_Colour),
checkPointsTypeRow(List, 0, NewPoints_Type),
Points is NewPoints_Size + NewPoints_Colour + NewPoints_Type.

pointsInRow([_ | Tail], Points) :-
pointsInRow(Tail, Points).


/* =================== SIZE =================== */
checkPointsSizeRow([], Points, Points).

checkPointsSizeRow([planet(Size_1, _, _) | Tail], Points, NewPoints) :-
checkPointsSizeRowCycle(Tail, Size_1, Points, NewPoints, 1).

checkPointsSizeRow([_ | Tail], Points, NewPoints) :-
checkPointsSizeRow(Tail, Points, NewPoints).


checkPointsSizeRowCycle([], _, Points, Points, _).

checkPointsSizeRowCycle([planet(Size_1, _, _) | Tail], Size, Points, NewPoints, N) :-
    Size == Size_1,
    N >= 2,
    NewPoints1 is Points + 1,
    N1 is N + 1,
    checkPointsSizeRowCycle(Tail, Size, NewPoints1, NewPoints, N1).

checkPointsSizeRowCycle([planet(Size_1, _, _) | Tail], Size, Points, NewPoints, N) :-
    Size == Size_1,
    N1 is N + 1,
    checkPointsSizeRowCycle(Tail, Size, Points, NewPoints, N1).

checkPointsSizeRowCycle([planet(Size_1, _, _) | Tail], _, Points, NewPoints, _) :-
checkPointsSizeRowCycle(Tail, Size_1, Points, NewPoints, 1).

checkPointsSizeRowCycle([_ | Tail], _, Points, NewPoints, _) :-
checkPointsSizeRow(Tail, Points, NewPoints).

/* =================== Colour =================== */
checkPointsColourRow([], Points, Points).

checkPointsColourRow([planet(_, Colour, _) | Tail], Points, NewPoints) :-
checkPointsColourRowCycle(Tail, Colour, Points, NewPoints, 1).

checkPointsColourRow([_ | Tail], Points, NewPoints) :-
checkPointsColourRow(Tail, Points, NewPoints).

checkPointsColourRowCycle([], _, Points, Points, _).

checkPointsColourRowCycle([planet(_, Colour_1, _) | Tail], Colour, Points, NewPoints, N) :-
    Colour == Colour_1,
    N >= 2,
    NewPoints1 is Points + 1,
    N1 is N + 1,
    checkPointsColourRowCycle(Tail, Colour, NewPoints1, NewPoints, N1).

checkPointsColourRowCycle([planet(_, Colour_1, _) | Tail], Colour, Points, NewPoints, N) :-
    Colour == Colour_1,
    N1 is N + 1,
    checkPointsColourRowCycle(Tail, Colour, Points, NewPoints, N1).

checkPointsColourRowCycle([planet(_, Colour_1, _) | Tail], _, Points, NewPoints, _) :-
checkPointsColourRowCycle(Tail, Colour_1, Points, NewPoints, 1).

checkPointsColourRowCycle([_ | Tail], _, Points, NewPoints, _) :-
checkPointsColourRow(Tail, Points, NewPoints).

/* =================== Type =================== */
checkPointsTypeRow([], Points, Points).

checkPointsTypeRow([planet(_, _, Type) | Tail], Points, NewPoints) :-
checkPointsTypeRowCycle(Tail, Type, Points, NewPoints, 1).

checkPointsTypeRow([_ | Tail], Points, NewPoints) :-
checkPointsTypeRow(Tail, Points, NewPoints).

checkPointsTypeRowCycle([], _, Points, Points, _).

checkPointsTypeRowCycle([planet(_, _, Type_1) | Tail], Type, Points, NewPoints, N) :-
    Type == Type_1,
    N >= 2,
    NewPoints1 is Points + 1,
    N1 is N + 1,
    checkPointsTypeRowCycle(Tail, Type, NewPoints1, NewPoints, N1).

checkPointsTypeRowCycle([planet(_, _, Type_1) | Tail], Type, Points, NewPoints, N) :-
    Type == Type_1,
    N1 is N + 1,
    checkPointsTypeRowCycle(Tail, Type, Points, NewPoints, N1).

checkPointsTypeRowCycle([planet(_, _, Type_1) | Tail], _, Points, NewPoints, _) :-
checkPointsTypeRowCycle(Tail, Type_1, Points, NewPoints, 1).

checkPointsTypeRowCycle([_ | Tail], _, Points, NewPoints, _) :-
checkPointsTypeRow(Tail, Points, NewPoints).

