// Unikal qiymatlar sonini aniqlovchi funksiya
function countUnique(arr) {
  var unique = {};
  var count = 0;
  for (var i = 0; i < arr.length; i++) {
    if (!unique[arr[i]]) {
      unique[arr[i]] = true;
      count++;
    }
  }
  return count;
}
// Misol: 
 console.log(countUnique([1,2,2,3,4,4,5,6,6,6,7])); 

// Har bir so'zning bosh harfini katta qiluvchi funksiya
function capitalizeWords(str) {
  var res = '';
  var inWord = false;
  for (var i = 0; i < str.length; i++) {
    var ch = str[i];
    if (ch === ' ') {
      res += ch;
      inWord = false;
    } else {
      if (!inWord) {
        res += ch.toUpperCase();
        inWord = true;
      } else {
        res += ch;
      }
    }
  }
  return res;
}

console.log(capitalizeWords('salom dunyo javascript')); // Salom Dunyo Javascript

// Palindromlikka tekshiruvchi funksiya
function isPalindrome(str) {
  
  var clean = '';
  for (var i = 0; i < str.length; i++) {
    var ch = str[i].toLowerCase();
    if (ch >= 'a' && ch <= 'z' || ch >= '0' && ch <= '9') {
      clean += ch;
    }
  }
  for (var l = 0, r = clean.length - 1; l < r; l++, r--) {
    if (clean[l] !== clean[r]) return false;
  }
  return true;
}

console.log(isPalindrome('kiyik')); // true
console.log(isPalindrome('Salom')); // false
console.log(isPalindrome('aziza')); // true
