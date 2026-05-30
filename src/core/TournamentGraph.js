/**
 * TournamentGraph - Manages the 2-paradoxical tournament structure
 * 
 * A 2-paradoxical tournament is a directed graph where for any pair of nodes (A, B),
 * there exists at least one node C that dominates both A and B.
 */
export class TournamentGraph {
  constructor() {
    this.dominanceMatrix = this.createDefaultGraph();
  }

  /**
   * Creates a valid 2-paradoxical tournament graph with 7 factions
   */
  createDefaultGraph() {
    // 7x7 matrix where [i][j] = true means faction i beats faction j
    const matrix = Array(7).fill(null).map(() => Array(7).fill(false));
    
    // Define dominance relationships
    const dominance = [
      [1, 2, 4],       // Faction 0 beats
      [2, 3, 5],       // Faction 1 beats
      [3, 4, 6],       // Faction 2 beats
      [0, 4, 5],       // Faction 3 beats
      [1, 5, 6],       // Faction 4 beats
      [0, 2, 6],       // Faction 5 beats
      [0, 1, 3]        // Faction 6 beats
    ];

    for (let i = 0; i < 7; i++) {
      for (const j of dominance[i]) {
        matrix[i][j] = true;
      }
    }

    return matrix;
  }

  /**
   * Check if faction A beats faction B
   */
  beats(a, b) {
    if (a === b) return false;
    return this.dominanceMatrix[a][b];
  }

  /**
   * Find a faction that dominates both A and B
   * Returns null if none exists (shouldn't happen in valid 2-paradoxical graph)
   */
  findDominator(a, b) {
    for (let c = 0; c < 7; c++) {
      if (c !== a && c !== b && this.beats(c, a) && this.beats(c, b)) {
        return c;
      }
    }
    return null;
  }

  /**
   * Resolve conflict between multiple factions
   * Returns the winning faction ID
   */
  resolveConflict(factions) {
    if (!factions || factions.length === 0) return null;
    if (factions.length === 1) return factions[0];

    // Use tournament sorting: find faction that beats the most others
    let bestFaction = factions[0];
    let bestScore = 0;

    for (const faction of factions) {
      let score = 0;
      for (const opponent of factions) {
        if (faction !== opponent && this.beats(faction, opponent)) {
          score++;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestFaction = faction;
      }
    }

    return bestFaction;
  }

  /**
   * Validate that the graph satisfies the 2-paradoxical property
   */
  validate() {
    for (let a = 0; a < 7; a++) {
      for (let b = a + 1; b < 7; b++) {
        const dominator = this.findDominator(a, b);
        if (dominator === null) {
          console.error(`Invalid 2-paradoxical graph: no dominator for pair (${a}, ${b})`);
          return false;
        }
      }
    }
    console.log('✓ Tournament graph validated as 2-paradoxical');
    return true;
  }
}