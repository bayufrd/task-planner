# Smart Task Planner - Database Setup Script
# This script creates the taskplanner database and tables
# Usage: ./setup-database.ps1

param(
    [string]$MySQLUser = "root",
    [string]$MySQLPassword = "0202",
    [string]$MySQLHost = "192.168.1.2",
    [int]$MySQLPort = 3307,
    [string]$DatabaseName = "taskplanner"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Smart Task Planner Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Host: $MySQLHost"
Write-Host "  Port: $MySQLPort"
Write-Host "  User: $MySQLUser"
Write-Host "  Database: $DatabaseName"
Write-Host ""

# Check if MySQL is installed
$mysqlPath = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysqlPath) {
    Write-Host "❌ MySQL not found in PATH!" -ForegroundColor Red
    Write-Host "Please install MySQL or add it to PATH" -ForegroundColor Red
    exit 1
}

Write-Host "✓ MySQL found at: $($mysqlPath.Source)" -ForegroundColor Green
Write-Host ""

# Test connection
Write-Host "Testing MySQL connection..." -ForegroundColor Yellow
try {
    mysql -h $MySQLHost -P $MySQLPort -u $MySQLUser -p$MySQLPassword -e "SELECT 1;" 2>$null
    if ($?) {
        Write-Host "✓ MySQL connection successful!" -ForegroundColor Green
    } else {
        throw "Connection failed"
    }
} catch {
    Write-Host "❌ Cannot connect to MySQL!" -ForegroundColor Red
    Write-Host "Check your MySQL server and credentials" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if database exists
Write-Host "Checking if database exists..." -ForegroundColor Yellow
$dbExists = mysql -h $MySQLHost -P $MySQLPort -u $MySQLUser -p$MySQLPassword -e "SHOW DATABASES LIKE '$DatabaseName';" 2>$null | Select-String -Pattern $DatabaseName
if ($dbExists) {
    Write-Host "⚠ Database '$DatabaseName' already exists" -ForegroundColor Yellow
    $response = Read-Host "Do you want to drop it? (y/n)"
    if ($response -eq "y") {
        Write-Host "Dropping database..." -ForegroundColor Yellow
        mysql -h $MySQLHost -P $MySQLPort -u $MySQLUser -p$MySQLPassword -e "DROP DATABASE IF EXISTS $DatabaseName;" 2>$null
        Write-Host "✓ Database dropped" -ForegroundColor Green
    } else {
        Write-Host "Keeping existing database" -ForegroundColor Green
    }
} else {
    Write-Host "✓ Database doesn't exist (will be created)" -ForegroundColor Green
}

Write-Host ""

# Run the SQL script
$sqlFile = "docs/DATABASE_INIT.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ SQL file not found: $sqlFile" -ForegroundColor Red
    exit 1
}

Write-Host "Running SQL initialization script..." -ForegroundColor Yellow
Write-Host "Source: $sqlFile" -ForegroundColor Gray
Write-Host ""

try {
    mysql -h $MySQLHost -P $MySQLPort -u $MySQLUser -p$MySQLPassword < $sqlFile 2>$null
    if ($?) {
        Write-Host "✓ Database and tables created successfully!" -ForegroundColor Green
    } else {
        throw "SQL execution failed"
    }
} catch {
    Write-Host "❌ Error executing SQL script" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verify tables were created
Write-Host "Verifying tables..." -ForegroundColor Yellow
$tables = mysql -h $MySQLHost -P $MySQLPort -u $MySQLUser -p$MySQLPassword -D $DatabaseName -e "SHOW TABLES;" 2>$null
Write-Host $tables -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Database setup completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Verify .env has correct DATABASE_URL" -ForegroundColor Gray
Write-Host "  2. Run: npm run prisma:generate" -ForegroundColor Gray
Write-Host "  3. Run: npm run prisma:migrate" -ForegroundColor Gray
Write-Host "  4. Run: npm run prisma:studio" -ForegroundColor Gray
Write-Host ""
