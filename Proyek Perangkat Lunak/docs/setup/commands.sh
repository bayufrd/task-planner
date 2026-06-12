#!/bin/bash
# Smart Task Planner - Command Reference
# Run common npm commands easily

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║  Smart Task Planner - Command Helper  ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${YELLOW}Available Commands:${NC}\n"

echo -e "${GREEN}Development${NC}"
echo "  npm run dev              Start development server (http://localhost:3000)"
echo "  npm run build            Build for production"
echo "  npm start                Run production server"
echo ""

echo -e "${GREEN}Database${NC}"
echo "  npm run prisma:generate  Generate Prisma client"
echo "  npm run prisma:migrate   Create database schema & run migrations"
echo "  npm run prisma:studio    Open Prisma Studio (http://localhost:5555)"
echo ""

echo -e "${GREEN}Code Quality${NC}"
echo "  npm run lint             Run ESLint"
echo "  npm run lint:fix         Fix linting issues automatically"
echo ""

echo -e "${GREEN}Dependencies${NC}"
echo "  npm install              Install all dependencies"
echo "  npm install <package>    Add new package"
echo "  npm update               Update packages"
echo ""

echo -e "${YELLOW}Useful Tips:${NC}\n"
echo -e "  ${BLUE}•${NC} Open Command Palette in app: ${YELLOW}Ctrl+K${NC}"
echo -e "  ${BLUE}•${NC} Check code quality: ${YELLOW}npm run lint${NC}"
echo -e "  ${BLUE}•${NC} View database: ${YELLOW}npm run prisma:studio${NC}"
echo -e "  ${BLUE}•${NC} Use different port: ${YELLOW}npm run dev -- -p 3001${NC}"
echo ""

echo -e "${YELLOW}Project Structure:${NC}\n"
echo "  src/                   Source code"
echo "  ├─ app/               Pages & API routes"
echo "  ├─ components/        React components"
echo "  └─ lib/               Utilities & hooks"
echo "  prisma/               Database schema"
echo "  .env                  Environment variables"
echo ""

echo -e "${YELLOW}Documentation:${NC}\n"
echo "  README.md              Project overview"
echo "  DEVELOPMENT.md         Setup & development guide"
echo "  ARCHITECTURE.md        Design & architecture"
echo "  QUICKSTART.md          Quick reference"
echo "  COMPLETION_SUMMARY.md  This setup summary"
echo ""

echo -e "${GREEN}Ready to start developing?${NC}"
echo -e "  ${BLUE}→${NC} Open: ${YELLOW}http://localhost:3000${NC}"
echo -e "  ${BLUE}→${NC} Server should already be running!"
echo ""
