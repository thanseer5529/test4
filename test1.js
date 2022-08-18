arr = [
  [0, 1, 2],
  [4, 5, 6],
  [7, 8, 9],
];

aa = 0;
bb = 0;
n = arr.length;
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    if (i == j) {
      aa += arr[i][j];
    }
  }
}

for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    if (i + j == n - 1) {
      bb += arr[i][j];
    }
  }
}
console.log(`sum of diagonal ${aa - bb}`);
