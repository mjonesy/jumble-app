import {Component, OnInit} from '@angular/core';
import * as randomWords from 'random-words';

@Component({
  selector: 'app-jumble',
  templateUrl: './jumble.component.html',
  styleUrls: ['./jumble.component.scss']
})
export class JumbleComponent implements OnInit {
  unscrambledWord = "";
  scrambledWord = "";
  guessedWord = "";
  isWordCorrect = false;
  showGuessAgain = false;
  guessedWords: string[] = [];
  difficulty = 0;

  constructor() {
  }

  ngOnInit(): void {
    this.setScrambledWord();
  }

  setDifficulty(difficulty: number) {
    switch (difficulty) {
      case 3:
        this.difficulty = 3;
        this.setScrambledWord();
        break;
      case 5:
        this.difficulty = 5;
        this.setScrambledWord();
        break;
      case 8:
        this.difficulty = 8;
        this.setScrambledWord();
        break;
      case 10:
        this.difficulty = 10;
        this.setScrambledWord();
        break;
      default:
        break;
    }
  }

  setScrambledWord() {
    let wordToShuffle = "";

    // if (this.difficulty != 0) {
    //   wordToShuffle = randomWords.words({maxLength: this.difficulty})[0];
    // } else {
      wordToShuffle = randomWords.default(1)[0];
    // }

    this.unscrambledWord = wordToShuffle;
    console.log('wordToShuffle = ', wordToShuffle);

    this.scrambleWord(wordToShuffle);
    if (this.scrambledWord == wordToShuffle) {
      this.scrambleWord(wordToShuffle);
    }

    console.log('shuffledWord = ', this.scrambledWord);

    return this.scrambledWord;
  }

  scrambleWord(wordToShuffle: string) {
    console.log('scrambling ', wordToShuffle);

    let splitShuffledWord = wordToShuffle.split('');

    splitShuffledWord.sort(function () {
      return 0.5 - Math.random();
    });
    this.scrambledWord = splitShuffledWord.join('');
  }

  checkInputWord(event: any) {
    // console.log('wordsList = ', randomWords.default(1));

    this.guessedWord = event.target.value;
    console.log(this.guessedWord);
    const correctGuess = this.guessedWord == this.unscrambledWord;
    const lengthMatches = this.guessedWord.length == this.unscrambledWord.length;

    if (!lengthMatches) {
      this.showGuessAgain = false;
    }

    if (!correctGuess && lengthMatches) {
      this.guessedWords.push(this.guessedWord);
      this.showGuessAgain = true;
    }

    if (correctGuess) {
      console.log('correct');
      this.isWordCorrect = true;
    } else {
      this.isWordCorrect = false;
    }
  }

  resetGame() {
    this.unscrambledWord = "";
    this.scrambledWord = "";
    this.guessedWord = "";
    this.isWordCorrect = false;
    this.showGuessAgain = false;
    this.guessedWords = [];
    this.setScrambledWord();
  }

}
