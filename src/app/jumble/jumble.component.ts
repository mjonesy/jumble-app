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
  subWords: string[] = [];
  scrambledSubWords: string[] = [];
  subWordsMapArray: any = [];
  guessState = 'default';

  constructor() {
  }

  ngOnInit(): void {
    this.setScrambledWord();
    console.log('subWords: ', this.subWords);
    console.log('scrambledSubWords: ', this.scrambledSubWords);
    console.log('subWordsArrayMap: ', this.subWordsMapArray);
  }

  setScrambledWord() {
    this.unscrambledWord = this.generateWord();
    this.scrambledWord = this.scrambleCheckForDupes(this.unscrambledWord);

    this.setSubWords(this.unscrambledWord);
    return this.scrambledWord;
  }

  generateWord() {
    return randomWords.default(1)[0];
  }

  setDifficulty(difficultyLevel: number) {
    let newWord = '';
    do {
      newWord = this.setScrambledWord()
    } while (newWord.length !== difficultyLevel)
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
      this.guessState = 'default';
    }

    if (!correctGuess && lengthMatches) {
      this.guessedWords.push(this.guessedWord);
      this.showGuessAgain = true;
      this.guessState = 'incorrect';
    }

    if (correctGuess) {
      console.log('correct');
      this.isWordCorrect = true;
      this.guessState = 'correct';
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

    // console.log('subWords: ', this.subWords)
  }

  private populateSubWords(letter: string) {
    let newWord = '';
    do {
      newWord = this.generateWord();
    } while (!newWord.includes(letter))
    // console.log('newWord: ', newWord)

    this.subWords.push(newWord);
    this.scrambledSubWords.push(this.scrambleWord(newWord));

    const wordMap = new Map();
    let newWordLetters = newWord.split('');

    for (let i = 0; newWordLetters.length > i; i++) {
      if (newWordLetters[i] === letter) {
        wordMap.set(newWordLetters[i], letter);
      } else {
        wordMap.set(newWordLetters[i], null)
      }
    }

    this.subWordsMapArray.push(wordMap)

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
