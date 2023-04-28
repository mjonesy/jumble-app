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
  subWordsArray: string[][] = [];
  scrambledInputStatus = 'default';
  firstLetters = "";
  hasFoundFirstLetter = false;
  hasCompletedStepOne = false;
  difficulty = 5;

  constructor() {
  }

  ngOnInit(): void {
    this.setScrambledWord();
    this.setSubWords(this.unscrambledWord);
    this.setSubWordsArray();
    console.log('you cheater!! Word is', this.unscrambledWord);
  }

  checkScrambledInput(scrambledWord, event: any, i: number) {
    console.log('index: ', i)

    this.scrambledInputStatus = 'default';
    let guessed = event.target.value.toLocaleUpperCase();
    console.log('guessed: ', guessed)
    if (event.key !== 'Enter' && this.subWords.includes(guessed)) {
      let guessedWordArray = this.guessedWord.split('');
      guessedWordArray.push(guessed[0]);
      this.guessedWord = guessedWordArray.join('');

      let firstLetterArray = this.firstLetters.split('');
      firstLetterArray.push(guessed[0]);
      this.firstLetters = firstLetterArray.join('');
      if (this.firstLetters.length === this.scrambledWord.length) {
        this.hasCompletedStepOne = true;
      }

      // @ts-ignore
      document.getElementById('input-' + i).setAttribute('disabled', "true")
      this.hasFoundFirstLetter = true;
      return true;
    } else {
      this.hasFoundFirstLetter = false;
      return false;
    }
  }

  setScrambledWord() {
    this.unscrambledWord = this.generateWord();
    this.scrambledWord = this.scrambleCheckForDupes(this.unscrambledWord);

    return this.scrambledWord;
  }

  setSubWordsArray() {
    this.subWordsArray = []
    this.subWords.forEach(word =>
      this.subWordsArray.push(word.split(''))
    )
  }

  generateWord() {
    let word = ''
    while (true) {
      word = randomWords.default(1)[0].toLocaleUpperCase();
      if (word.length <= this.difficulty) {
        return word
      }
    }
  }

  setDifficulty(difficultyLevel: number) {
    this.difficulty = difficultyLevel
    this.resetGame();
    this.guessedWord = "";
    this.firstLetters = "";
    let newWord = this.setScrambledWord();
    do {
      this.resetSubWords();
      newWord = this.setScrambledWord();
    } while (newWord.length !== this.difficulty)
    this.setSubWords(this.unscrambledWord);
    this.setSubWordsArray();
    console.log('you cheater!! Word is', this.unscrambledWord);
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
    this.hasFoundFirstLetter = false;
    this.guessedWord = event.target.value.toLocaleUpperCase();
    console.log(this.guessedWord);
    const correctGuess = this.guessedWord == this.unscrambledWord;
    const lengthMatches = this.guessedWord.length == this.unscrambledWord.length;

    if (!lengthMatches) {
      this.showGuessAgain = false;
      this.resetGuessState();
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
    this.resetSubWords();
    let mainLetters = unscrambledMainWord.split('');

    for (let i = 0; i < mainLetters.length; i++) {
      this.populateSubWords(mainLetters[i]);
    }
    this.shuffleSubWords(this.subWords);
    console.log('this.subwords ', this.subWords)
    this.populateScrambledSubWords(this.subWords);
  }

  private shuffleSubWords(subWords: string[]) {
    let tempArray: string[] = [];
    subWords.forEach(word => {
      tempArray.push(word);
    })

    for (let i = tempArray.length -1; i > 0; i--) {
      let j = Math.floor(Math.random() * i)
      let k = tempArray[i]
      tempArray[i] = tempArray[j]
      tempArray[j] = k
    }

    this.subWords = tempArray;
  }

  private populateScrambledSubWords(subWords: string[]) {
    subWords.forEach(word => this.scrambledSubWords.push(this.scrambleWord(word)))
  }

  private populateSubWords(letter: string) {
    let newWord = '';
    do {
      newWord = this.generateWord();
    } while (!(newWord[0] === letter))

    this.subWords.push(newWord);

    this.createSubWordMap(newWord, letter);
  }

  private createSubWordMap(newWord: string, letter: string) {
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

  private resetGuessedWords() {
    this.guessedWords = [];
  }

  private resetGuessAgain() {
    this.showGuessAgain = false;
  }

  private resetGuessState() {
    this.guessState = "default";
  }

  private resetSubWords() {
    this.subWords = [];
    this.scrambledSubWords = [];
    this.subWordsMapArray = [];
  }

  resetGame() {
    this.unscrambledWord = "";
    this.scrambledWord = "";
    this.guessedWord = "";
    this.isWordCorrect = false;
    this.firstLetters = "";
    this.hasCompletedStepOne = false;
    this.hasFoundFirstLetter = false;

    this.resetGuessState();
    this.resetGuessAgain();
    this.resetGuessedWords();
    this.setScrambledWord();
    this.resetSubWords();
    this.setScrambledWord();
  }
}
