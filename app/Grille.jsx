import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GRID_SIZE = Math.min(width * 0.9, 360);
const CELL_SIZE = Math.floor(GRID_SIZE / 9);

const generateCompleteGrid = () => {
  const grid = Array(9).fill(null).map(() => Array(9).fill(0));

  const isSafe = (row, col, num) => {
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num || grid[x][col] === num) return false;
    }
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false;
      }
    }
    return true;
  };

  const fillGrid = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const nums = [...Array(9).keys()].map(n => n + 1).sort(() => Math.random() - 0.5);
          for (let num of nums) {
            if (isSafe(row, col, num)) {
              grid[row][col] = num;
              if (fillGrid()) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  fillGrid();
  return grid;
};

const removeCells = (grid, level) => {
  const clues = { Facile: 45, Moyen: 36, Difficile: 30, Expert: 24 };
  const totalCells = 81;
  const toRemove = totalCells - clues[level];
  const newGrid = grid.map(row => [...row]);

  let count = 0;
  while (count < toRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (newGrid[row][col] !== 0) {
      newGrid[row][col] = 0;
      count++;
    }
  }
  return newGrid;
};

export default function GrilleSudoku() {
  const { niveau } = useLocalSearchParams();
  const router = useRouter();

  const [grid, setGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [errorCells, setErrorCells] = useState([]);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const fullGrid = generateCompleteGrid();
    const playableGrid = removeCells(fullGrid, niveau || 'Facile');
    setGrid(playableGrid);
  }, [niveau]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const hasConflict = (row, col, value) => {
    for (let i = 0; i < 9; i++) {
      if (i !== col && grid[row][i] === value) return true;
      if (i !== row && grid[i][col] === value) return true;
    }
    return false;
  };

  const handleInput = (num) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    const newGrid = [...grid];
    newGrid[row][col] = num;
    setGrid(newGrid);

    const errors = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = newGrid[r][c];
        if (val !== 0 && hasConflict(r, c, val)) {
          errors.push(`${r},${c}`);
        }
      }
    }
    setErrorCells(errors);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push('/Nvl')}>
          <Image source={require('../assets/images/arriere.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.level}>{niveau}</Text>
        <Text style={styles.timer}>⏱ {formatTime()}</Text>
        <TouchableOpacity onPress={() => console.log('Paramètres')}>
          <Image source={require('../assets/images/parametres-cog.png')} style={styles.iconParam} />
        </TouchableOpacity>
      </View>

      <View style={styles.gridWrapper}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => {
              const borderStyle = {
                borderRightWidth: (colIndex + 1) % 3 === 0 ? 2 : 1,
                borderBottomWidth: (rowIndex + 1) % 3 === 0 ? 2 : 1,
              };
              const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
              const isError = errorCells.includes(`${rowIndex},${colIndex}`);
              return (
                <TouchableOpacity
                  key={colIndex}
                  onPress={() => setSelectedCell([rowIndex, colIndex])}
                  style={[styles.cell, borderStyle, isSelected && styles.selectedCell, isError && styles.errorCell]}
                >
                  <Text style={styles.cellText}>{cell !== 0 ? cell : ''}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.toolsRowAdjusted}>
        <TouchableOpacity style={styles.tool}>
          <Text style={styles.toolIcon}>↩</Text>
          <Text style={styles.toolLabel}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tool}>
          <Text style={styles.toolIcon}>❌</Text>
          <Text style={styles.toolLabel}>Effacer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tool}>
          <Text style={styles.toolIcon}>📝</Text>
          <Text style={styles.toolLabel}>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tool}>
          <Text style={styles.toolIcon}>💡</Text>
          <Text style={styles.toolLabel}>Indice</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.keyboardWrapper}>
        {[1,2,3,4,5,6,7,8,9].map(num => (
          <TouchableOpacity key={num} style={styles.key} onPress={() => handleInput(num)}>
            <Text style={styles.keyText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF7FF',
    alignItems: 'center',
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    top: 56,
    left: 32,
  },
  iconParam: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    top: 56,
    right: 42,
  },
  level: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0E41AE',
  },
  timer: {
    fontSize: 18,
    color: '#333',
    marginHorizontal: 10,
  },
  gridWrapper: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#0E41AE',
    width: GRID_SIZE,
    height: GRID_SIZE,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedCell: {
    backgroundColor: '#d0e6ff',
  },
  errorCell: {
    backgroundColor: '#ffcdd2',
  },
  cellText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0E41AE',
  },
  toolsRowAdjusted: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  tool: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolIcon: {
    fontSize: 28,
  },
  toolLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0E41AE',
    marginTop: 4,
  },
  keyboardWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
    width: '90%',
  },
  key: {
    width: 50,
    height: 50,
    margin: 6,
    borderRadius: 25,
    backgroundColor: '#0E41AE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
