class PuzzleBoard {
  constructor(containerId, statusId, fen, correctMoves) {
    this.boardEl = document.getElementById(containerId);
    this.statusEl = document.getElementById(statusId);
    this.pieces = {
      'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
      'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
    };
    this.correctMoves = correctMoves; // ["Qh7", "Nf6"]
    this.draggedPiece = null;
    this.originSquare = null;

    this.layout = this.loadFEN(fen);
    this.render();
    this.addDragDrop();
  }

  loadFEN(fen) {
    const rows = fen.split(' ')[0].split('/');
    return rows.map(row => {
      const expanded = [];
      for (let char of row) {
        if (!isNaN(char)) expanded.push(...Array(parseInt(char)).fill('.'));
        else expanded.push(char);
      }
      return expanded;
    });
  }

  render() {
    this.boardEl.innerHTML = '';
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement('div');
        square.classList.add('square', (row + col) % 2 === 0 ? 'light' : 'dark');
        square.dataset.row = row;
        square.dataset.col = col;

        const piece = this.layout[row][col];
        if (piece !== '.') {
          const pieceEl = document.createElement('span');
          pieceEl.textContent = this.pieces[piece];
          pieceEl.draggable = true;
          pieceEl.dataset.piece = piece;
          square.appendChild(pieceEl);
        }
        this.boardEl.appendChild(square);
      }
    }
  }

  toSquareName(row, col) {
    const files = 'abcdefgh';
    return files[col] + (8 - row);
  }

  addDragDrop() {
    this.boardEl.addEventListener('dragstart', (e) => {
      if (e.target.tagName === 'SPAN') {
        this.draggedPiece = e.target;
        this.originSquare = e.target.parentElement;
        setTimeout(() => (e.target.style.visibility = 'hidden'), 0);
      }
    });

    this.boardEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('square')) e.target.classList.add('drag-over');
    });

    this.boardEl.addEventListener('dragleave', (e) => {
      if (e.target.classList.contains('square')) e.target.classList.remove('drag-over');
    });

    this.boardEl.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('square')) {
        e.target.classList.remove('drag-over');
        e.target.innerHTML = '';
        e.target.appendChild(this.draggedPiece);
        this.draggedPiece.style.visibility = 'visible';

        const movedPiece = this.draggedPiece.dataset.piece;
        const targetSquare = this.toSquareName(parseInt(e.target.dataset.row), parseInt(e.target.dataset.col));
        const moveString = movedPiece.toUpperCase() + targetSquare;

        if (this.correctMoves.includes(moveString)) {
          this.statusEl.textContent = "✔ Correct move!";
          this.statusEl.style.color = "green";
        } else {
          this.statusEl.textContent = "❌ Wrong move!";
          this.statusEl.style.color = "red";
        }
      }
    });

    this.boardEl.addEventListener('dragend', (e) => {
      this.draggedPiece.style.visibility = 'visible';
    });
  }
}

// Usage:
const fen = "6k1/5ppp/8/8/8/8/5PPP/6KQ w - - 0 1";
const correctMoves = ["Qh7", "Qg7"];
new ChessBoard('board', 'status', fen, correctMoves);
