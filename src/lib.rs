use wasm_bindgen::prelude::*;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
#[derive(PartialEq)]
pub enum Direction {
    Up,
    Down,
    Right,
    Left,
}

pub struct SnakeCell(usize);

struct Snake {
    body: Vec<SnakeCell>,
    direction: Direction,
}

impl Snake {
    fn new(spawn_index: usize, size: usize) -> Snake {
        let mut body = vec![];

        for i in 0..size {
            body.push(SnakeCell(spawn_index - i));
        }

        Snake {
            body,
            direction: Direction::Up,
        }
    }
}

#[wasm_bindgen]
pub struct World {
    width: usize,
    size: usize,
    snake: Snake,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize, snake_idx: usize) -> World {
        World {
            width,
            size: width * width,
            snake: Snake::new(snake_idx, 3),
        }
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn snake_head_idx(&self) -> usize {
        self.snake.body[0].0
    }

    pub fn change_snake_dir(&mut self, direction: Direction) {
        self.snake.direction = direction;
    }

    pub fn snake_length(&self) -> usize {
        self.snake.body.len()
    }

    // cannot return a reference to JS due to borrowing rules
    // pub fn snake_cells(&self) -> Vec<SnakeCell> {
    //     self.snake.body
    // }

    pub fn snake_cells(&self) -> *const SnakeCell {
        self.snake.body.as_ptr()
    }

    pub fn step(&mut self) {
        let next_cell = self.get_next_snake_cell();
        self.snake.body[0] = next_cell;
    }

    fn get_next_snake_cell(&self) -> SnakeCell {
        let snake_idx = self.snake_head_idx();
        let row = snake_idx / self.width;

        return match self.snake.direction {
            Direction::Right => SnakeCell((row * self.width) + (snake_idx + 1) % self.width),
            Direction::Left => SnakeCell((row * self.width) + (snake_idx - 1) % self.width),
            Direction::Up => SnakeCell((snake_idx - self.width) % self.size),
            Direction::Down => SnakeCell((snake_idx + self.width) % self.size),
        };
    }
}
