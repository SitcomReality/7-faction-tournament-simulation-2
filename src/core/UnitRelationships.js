export class UnitRelationships {
  constructor() {
    this.dominanceMatrix = this.createDefaultGraph();
  }

  createDefaultGraph() {
    const matrix = Array(7).fill(null).map(() => Array(7).fill(false));
    
    const dominance = [
      [1, 2, 4],
      [2, 3, 5],
      [3, 4, 6],
      [0, 4, 5],
      [1, 5, 6],
      [0, 2, 6],
      [0, 1, 3]
    ];

    for (let i = 0; i < 7; i++) {
      for (const j of dominance[i]) {
        matrix[i][j] = true;
      }
    }

    return matrix;
  }

  beats(a, b) {
    if (a === null || b === null || a === b) return false;
    return this.dominanceMatrix[a][b];
  }
}