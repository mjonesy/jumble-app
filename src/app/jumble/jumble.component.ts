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

  constructor() {
  }

  ngOnInit(): void {
    this.setScrambledWord();
  }

  setScrambledWord() {
    this.unscrambledWord = this.generateWord();

    this.scrambledWord = this.scrambleCheckForDupes(this.unscrambledWord);

    return this.scrambledWord;
  }

  generateWord() {
    return randomWords.default(1)[0];
  }

  scrambleCheckForDupes(unscrambled: string) {
    let scrambledWord = '';

    do {
      scrambledWord = this.scrambleWord(unscrambled);
    } while (scrambledWord == unscrambled);

    return scrambledWord;
  }

  scrambleWord(wordToScramble: string) {
    let scrambledWordLetters = wordToScramble.split('');

    scrambledWordLetters.sort(function () {
      return 0.5 - Math.random();
    });

    return scrambledWordLetters.join('');
  }

  checkInputWord(event: any) {
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
