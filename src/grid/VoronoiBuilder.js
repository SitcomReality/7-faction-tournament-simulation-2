import { Delaunay } from 'd3-delaunay';
import { HeptCell } from './HeptCell.js';

export class VoronoiBuilder {
  static build(radius, cellSize, iterations = 3) {
    const extent = radius * cellSize;
    const spawnRadius = extent * 1.2;
    // Calculate expected number of cells to fill the extended circle
    const count = Math.floor((Math.PI * spawnRadius * spawnRadius) / (cellSize * cellSize * 2.6));
    
    let points = [];
    for (let i = 0; i < count; i++) {
      const r = spawnRadius * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      points.push([Math.cos(theta) * r, Math.sin(theta) * r]);
    }
    
    let delaunay, voronoi;
    const bounds = [-spawnRadius, -spawnRadius, spawnRadius, spawnRadius];
    
    // Lloyd's relaxation for organic, uniform cells
    for (let iter = 0; iter < iterations; iter++) {
      delaunay = Delaunay.from(points);
      voronoi = delaunay.voronoi(bounds);
      
      const newPoints = [];
      for (let i = 0; i < points.length; i++) {
        const poly = voronoi.cellPolygon(i);
        if (!poly || poly.length < 3) {
          newPoints.push(points[i]);
          continue;
        }
        
        let cx = 0, cy = 0, area = 0;
        for (let j = 0; j < poly.length - 1; j++) {
          const p1 = poly[j];
          const p2 = poly[j + 1];
          const a = p1[0] * p2[1] - p2[0] * p1[1];
          cx += (p1[0] + p2[0]) * a;
          cy += (p1[1] + p2[1]) * a;
          area += a;
        }
        area /= 2;
        
        if (area > 0.0001 || area < -0.0001) {
          cx /= (6 * area);
          cy /= (6 * area);
          newPoints.push([cx, cy]);
        } else {
          newPoints.push(points[i]);
        }
      }
      points = newPoints;
    }
    
    // Final triangulation
    delaunay = Delaunay.from(points);
    voronoi = delaunay.voronoi(bounds);
    
    const cells = new Map();
    for (let i = 0; i < points.length; i++) {
      const dist = Math.hypot(points[i][0], points[i][1]);
      if (dist > extent) continue;
      
      const poly = voronoi.cellPolygon(i);
      if (!poly || poly.length < 3) continue;
      
      // Convert d3-delaunay polygon points to objects, omit the closing point
      const vertices = poly.slice(0, -1).map(p => ({ x: p[0], y: p[1] }));
      const center = { x: points[i][0], y: points[i][1] };
      
      const cell = new HeptCell(i, vertices, center);
      cells.set(i, cell);
    }
    
    // Pre-calculate valid neighbor connections
    for (const [id, cell] of cells.entries()) {
      const neighborIds = Array.from(voronoi.neighbors(id));
      for (const nid of neighborIds) {
        if (cells.has(nid)) {
          cell.neighborIds.push(nid);
        }
      }
    }
    
    return cells;
  }
}