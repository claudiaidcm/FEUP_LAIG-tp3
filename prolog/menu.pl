printMainMenu :-
    write(' _________________________________ EXO _________________________________ '),nl,
    write('|                                                                       |'),nl,
    write('|                                                                       |'),nl,
    write('|                           CHOOSE GAME MODE:                           |'),nl,
    write('|                                                                       |'),nl,
    write('|                          1. Player vs Player                          |'),nl,
    write('|                                                                       |'),nl,
    write('|                          2. Player vs Computer                        |'),nl,
    write('|                                                                       |'),nl,
    write('|                          3. Computer vs Computer                      |'),nl,
    write('|                                                                       |'),nl,
    write('|                          0. Exit                                      |'),nl,
    write('|                                                                       |'),nl,
    write('|                                                                       |'),nl,
    write('|                                                     Ana Filipa Senra  |'),nl,
    write('|                                                      Claudia Martins  |'),nl,
    write('|_______________________________________________________________________|'),nl, nl.

handleOption(1) :-
    write('\nPlayer 1: '),
    read(Player1),
    write('\nPlayer 2: '),
    read(Player2),
    startGame(Player1, Player2).

handleOption(2) :-
    write('\nPlayer: '),
    read(Player),
    chooseMode(Mode),
    startGamePvsC(Player, Mode).

handleOption(3) :-
    write('\nPC1: '),
    chooseMode(ModePC1),
    write('\nPC2: '),
    chooseMode(ModePc2),
    startGameCvsC(ModePC1, ModePc2).

handleOption(0) :-
    write('\nSee you next time!\n\n').

handleOption(_) :-
    write('\nInvalid option! Try again.\n\n'),
    write('Option: '),
    read(Input),
    handleOption(Input).


chooseMode(Mode) :-
    write('\nThere are two game modes you can choose: \n(1) Easy.  \n(2) Difficult.\n'),
    write('Your choice: '),
    read(Mode),
    handleMode(Mode); chooseMode(Mode).


handleMode(Mode) :- Mode == 1; Mode == 2.

handleMode(_) :-
    write('\nInvalid mode! Try again.\n\n'),
    !,
    false.
