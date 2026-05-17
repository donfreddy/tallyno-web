.PHONY: dev build generate preview install

# Default target
all: dev

# Install dependencies
install:
	npm install

# Run the development server
dev:
	npm run dev

# Build for production
build:
	npm run build

# Generate static site
generate:
	npm run generate

# Preview production build
preview:
	npm run preview
