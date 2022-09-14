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
  subWord = new Map<string, any>();
  subWords = Array.from(this.subWord);

  constructor() {
  }

  ngOnInit(): void {
    this.setScrambledWord();
  }

  setScrambledWord() {
    this.unscrambledWord = this.generateWord();
    this.scrambledWord = this.scrambleCheckForDupes(this.unscrambledWord);

    this.setSubWords(this.unscrambledWord);
    console.log(this.unscrambledWord);
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

  setSubWords(unscrambledMainWord: string) {
    // let unscrambledMainWord = 'dog';

    let mainLetters = unscrambledMainWord.split('');
    // let mainLetters = 'dog';

    for (let i = 0; i < mainLetters.length; i++) {
      this.populateSubWords(mainLetters[i]);
    }

    console.log('subWords: ', this.subWords)
  }

  private populateSubWords(letter: string) {
    let newWord = '';
    do {
      newWord = this.generateWord();
    } while (!newWord.includes(letter))
    console.log('newWord: ', newWord, ' letter = ', letter);

    const wordMap = new Map();
    let newWordLetters = newWord.split('');

    for (let i = 0; newWordLetters.length > i; i++) {
      console.log('LETTER: ', newWordLetters[i])
      if (newWordLetters[i] === letter) {
        console.log('letter matches: ', letter)
        wordMap.set(newWordLetters[i], letter);
      } else {
        console.log('letter doesnt match: ', letter)
        wordMap.set(newWordLetters[i], null)
      }
    }

    // wordMap.set(newWord, letter);
    console.log('map: ', wordMap);
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
