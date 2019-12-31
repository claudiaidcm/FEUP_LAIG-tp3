
/* ================================================= Intelligent Bot ================================================= */

choose_move(coord(X, Y), BestCard, OldBoard, Cards) :-
findall(Element, (nth1(Index, Cards, Element), Index =< 6), NewCards),

addLine(0, OldBoard, Board_1), length(Board_1, ListLen2), L2 is ListLen2 + 1, addLine(L2, Board_1, Board_2),
addColumn(0, Board_2, Board_3), nth0(0, Board_3, List), length(List, ListLen), L is ListLen + 1, addColumn(L, Board_3, Board),

evaluate_and_choose(NewCards, Board, (nil, -1000, nil), coord(X, Y), BestCard).

evaluate_and_choose([Card | Cards], Board, Record, coord(BestX, BestY), BestCard) :-
choose_move_coord(Move, Points, Board, Card),
updateCard(Move, Points, Card, Record, Record1),
evaluate_and_choose(Cards, Board, Record1, coord(BestX, BestY), BestCard).

evaluate_and_choose([], _, (Move, _, Card), Move, Card).

updateCard(_, Points, _, (Move1, Value1, Card1), (Move1, Value1, Card1)) :-
Points =< Value1.

updateCard(Move, Points, Card, (_, Value1, _), (Move, Points, Card)) :-
Points > Value1.

choose_move_coord(coord(X, Y), Points, Board, Planet) :- 
findall(coord(X1, Y1), (nth0(Y1, Board, List), nth0(X1, List, _), valid_move(coord(X1, Y1), Board)), Moves),
evaluate_and_choose_coord(Moves, Planet, Board, (nil, -1000), coord(X, Y), Points).

evaluate_and_choose_coord([Move | Moves], Planet, Board, Record, coord(BestX, BestY), BestPoints) :-
  subsPosition(NewBoard, Board, Move, Planet),
  value(NewBoard, Points),
  update(Move, Points, Record, Record1),
  evaluate_and_choose_coord(Moves, Planet, Board, Record1, coord(BestX, BestY), BestPoints).

evaluate_and_choose_coord([], _, _, (Move, Points), Move, Points).

update(_, Points, (Move1, Value1), (Move1, Value1)) :-
Points < Value1.

update(Move, Points, (_, Value1), (Move, Points)) :-
Points > Value1.

update(Move, Points, _, (Move, Points)) :-
random(0, 3, N),
N == 1.

update(_, _, (Move1, Value1), (Move1, Value1)).

/* ================================================= END OF Intelligent Bot ================================================= */

/* Get a random position for the PC's play */
randomPos(coord(Column, Row), Planet, Board, Cards) :-

  length(Board, NumColumns),
  random(0, NumColumns, RandCol),
  nth0(RandCol, Board, ListCol),

  length(ListCol, NumRows),
  random(0, NumRows, RandRow),
  random(0, 3, AddCol),
  random(0, 3, AddRow),
  Column is RandCol + AddCol,
  Row is RandRow + AddRow,
  
  length(Cards, NumPlanets),
  Total is NumPlanets + 1,
  random(1, Total, RandPlanet),
  getPlanet(Cards, RandPlanet, Planet).

/* PC's play */

pcTurn(Board, NewBoard, Cards, NewCards, 2) :-
  choose_move(coord(Column, Row), Planet, Board, Cards),
  !,
  ((addPiece(coord(Column, Row), Planet, Board, NewBoard), !, delete(Cards, Planet, NewCards));
  pcTurn(Board, NewBoard, Cards, NewCards, 2)).


pcTurn(Board, NewBoard, Cards, NewCards, 1) :-
  randomPos(coord(Column, Row), Planet, Board, Cards),
  !,
  ((addPiece(coord(Column, Row), Planet, Board, NewBoard), !, delete(Cards, Planet, NewCards));
  pcTurn(Board, NewBoard, Cards, NewCards, 1)).


playGamePC(Board, NewBoard, Cards, NewCards, Mode) :-
  printCards(Cards),
  write('\n'),
  (pcTurn(Board, NewBoard, Cards, NewCards, Mode), !, printBoard(NewBoard), write('\n\n\n')), read_line(_).


/* =========================================================================== */
/*                              Player vs Computer                             */
/* =========================================================================== */

gameLoopPvsC(Player, BoardPlayer, BoardPC, Cards, Mode) :-
    playGame(BoardPlayer, NewBoardPlayer , Player, Cards, NewCards),
    read_line(_),
    write('\n\n\n PC played: \n'),
    playGamePC(BoardPC, NewBoardPC, NewCards, NewCards2, Mode),
    !,
    (game_over(Player, NewBoardPlayer, 'PC', NewBoardPC, NewCards2);
    gameLoopPvsC(Player, NewBoardPlayer, NewBoardPC, NewCards2, Mode)).

startGamePvsC(Player, Mode) :-
  initialBoard(BoardPlayer),
  initialBoard(BoardPC),
  allCards(AllCards),
  random_permutation(AllCards, AllCardsShuffled),
  gameLoopPvsC(Player, BoardPlayer, BoardPC, AllCardsShuffled, Mode);
  write('Thanks for Playing!\n').


/* =========================================================================== */
/*                            Computer vs Computer                             */
/* =========================================================================== */

gameLoopCvsC(BoardPC1, ModePC1, BoardPC2, ModePC2, Cards) :-
  write('PC1: \n'),
  playGamePC(BoardPC1, NewBoardPC1, Cards, NewCards, ModePC1),
  write('PC2: \n'),
  playGamePC(BoardPC2, NewBoardPC2, NewCards, NewCards2, ModePC2),
  !,
  (game_over('PC1', NewBoardPC1, 'PC2', NewBoardPC2, NewCards2); 
  gameLoopCvsC(NewBoardPC1, ModePC1, NewBoardPC2, ModePC2, NewCards2)).

startGameCvsC(ModePC1, ModePC2):-
  initialBoard(BoardPC1),
  initialBoard(BoardPC2),
  allCards(AllCards),
  random_permutation(AllCards, AllCardsShuffled),
  read_line(_),
  gameLoopCvsC(BoardPC1, ModePC1, BoardPC2, ModePC2, AllCardsShuffled);
  write('Thanks for Playing!\n').