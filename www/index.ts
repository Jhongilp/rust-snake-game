import init, { World, Direction } from "snake_game";

init().then((wasm) => {
  const CELL_SIZE = 20;
  const WORLD_WIDTH = 16;
  const snakeSpawnIndex = Date.now() % (WORLD_WIDTH * WORLD_WIDTH);
  const world = World.new(WORLD_WIDTH, snakeSpawnIndex);
  const worldWidth = world.width();

  const canvas = <HTMLCanvasElement>(
    document.getElementById("snake-game-canvas")
  );
  canvas.height = worldWidth * CELL_SIZE;
  canvas.width = worldWidth * CELL_SIZE;
  const ctx = canvas.getContext("2d");

  const snakeCellPtr = world.snake_cells();
  const snakeLen = world.snake_length();

  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "ArrowUp": {
        world.change_snake_dir(Direction.Up);
        break;
      }
      case "ArrowRight": {
        world.change_snake_dir(Direction.Right);
        break;
      }
      case "ArrowDown": {
        world.change_snake_dir(Direction.Down);
        break;
      }
      case "ArrowLeft": {
        world.change_snake_dir(Direction.Left);
        break;
      }
      default:
        return;
    }
  });

  function drawWorld() {
    ctx.beginPath();

    for (let x = 0; x < worldWidth + 1; x++) {
      ctx.moveTo(CELL_SIZE * x, 0);
      ctx.lineTo(CELL_SIZE * x, worldWidth * CELL_SIZE);
    }

    for (let y = 0; y < worldWidth + 1; y++) {
      ctx.moveTo(0, CELL_SIZE * y);
      ctx.lineTo(worldWidth * CELL_SIZE, CELL_SIZE * y);
    }

    ctx.stroke();
  }

  function drawSnake() {
    const snakeCells = new Uint32Array(
      wasm.memory.buffer,
      world.snake_cells(),
      snakeLen
    );

    snakeCells.forEach((cellIdx) => {
      const col = cellIdx % worldWidth;
      const row = Math.floor(cellIdx / worldWidth);

      ctx.beginPath();
      ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });

    ctx.stroke();
  }

  function paint() {
    drawWorld();
    drawSnake();
  }

  function update() {
    const fps = 10;
    window.setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      world.step();
      paint();
      requestAnimationFrame(update);
    }, 1000 / fps);
  }

  paint();
  update();
});
