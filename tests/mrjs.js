// https://softchris.github.io/pages/javascript-understand-testing.html#making-it-pretty

let hued = (c) => (str) => ([str,`color:${c};`]);
let greenText = hued('green');
let redText = hued('red');
let orangeText = hued('orange');

export class Matchers {
   constructor(actual) {
      this.actual = actual;
   }
   
   toBe(expected) {
      if (expected === this.actual) {
         console.log(...greenText(`    %cSucceeded`))
      } else {
         throw new Error(`Fail - Actual: ${this.actual}, Expected: ${expected}`)
      }
   }
   toEqual(expected) {
      if (expected == this.actual) {
         console.log(...greenText(`    %cSucceeded`))
      } else {
         throw new Error(`Fail - Actual: ${this.actual}, Expected: ${expected}`)
      }
   }
   toBeTruthy() {
      if (this.actual) {
         console.log(...greenText(`    %cSucceeded`))
      } else {
         throw new Error(`Fail - Expected value to be truthy but got ${this.actual}`)
      }
   }
   toContain(needle) {
      if (this.actual.contains(needle)) {
         console.log(...greenText(`    %cSucceeded`))
      } else {
         throw new Error(`Fail - Expected ${needle} to be present in ${this.actual}`)
      }
   }
   not = {
      toBe(expected) {
         if (expected !== this.actual) {
            console.log(...greenText(`    %cSucceeded`))
         } else {
            throw new Error(`Fail - Actual: ${this.actual}, Expected NOT: ${expected}`)
         }
      },
      toEqual(expected) {
         if (expected != this.actual) {
            console.log(...greenText(`    %cSucceeded`))
         } else {
            throw new Error(`Fail - Actual: ${this.actual}, Expected NOT: ${expected}`)
         }
      }
   }
}

export const expect = (actual) => {
   return new Matchers(actual);
}

export const describe = (suiteName, fn) => {
   try {
      console.log('\n');
      console.log(...greenText(`suite: %c${suiteName}`));
      fn();
   } catch (err) {
      console.log(`[${err.message.toUpperCase()}]`);
   }
}

export const it = (testName, fn) => {
   console.log(...orangeText(`  test: %c${testName}`));
   try {
      fn();
   } catch (err) {
      console.log(...redText(`    %c${err}`));
      throw new Error('test run failed');
   }
}
