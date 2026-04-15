# 💰 SpendSense (Personal Finance Tracker)

> Your personal finance manager, built for speed, privacy, and optimized for mobile.

**SpendSense** is a web application designed to help you track expenses, monitor income, manage multiple wallets, and visualize your cash flow simply and directly. It is a self-hosted project intended strictly for personal use.

## 🛠️ Tech Stack

* **Backend:** Laravel 13 (PHP 8.3)
* **Frontend:** React 18.2
* **Integration:** Inertia.js (SPA without the need for an external API)
* **Styling:** Tailwind CSS 3.2
* **Database:** PostgreSQL
* **Visualizations:** Recharts 3.8.1
* **QR Code Scanner:** html5-qrcode 2.3.8
* **Infrastructure:** Docker (Laravel Sail)
* **PWA:** Vite Plugin PWA 1.2.0

## ✨ Key Features

### 💳 Core Financial Management
* 🔒 **Closed System:** Secure authentication with Laravel Breeze & Sanctum. Only the owner can view their data (`user_id` isolation).
* 📝 **Transaction Management:** Create, edit, and delete transactions with support for income and expense types.
* 🏷️ **Smart Categorization:** Custom categories for transactions with flexible organization.
* 🏪 **Multiple Wallets:** Manage multiple wallets/accounts with individual balances.
* 🔄 **Wallet Transfers:** Transfer money between wallets.
* 🏷️ **Tags:** Additional tagging system for better transaction organization.
* 📋 **Recurring Transactions:** Set up automatic recurring transactions for subscriptions and regular expenses.

### 📊 Analytics & Insights
* 📊 **Interactive Dashboard:** Monthly summary displaying:
  - Current overall balance
  - Monthly income and expenses breakdown
  - 5 most recent transactions at a glance
  - Spending distribution by category (pie chart visualization)
  - Budget progress tracking
* 📈 **Spending Analytics:** Visualize spending patterns by category with interactive charts.

### 💰 Budget & Goals
* 💵 **Budget Management:** Set monthly budgets per category and track spending progress.
* 🎯 **Savings Goals:** Create and track savings goals with target amounts and current balance.
* 📊 **Budget Progress:** Real-time budget vs actual spending comparison with percentage indicators.

### 📱 Advanced Features
* 📱 **Mobile-First Design:** Responsive interface optimized for quick transaction entry on mobile devices.
* 📸 **Receipt Management:** Upload and store receipts for transactions.
* 📲 **QR Code Scanner:** Built-in QR code reader for quick transaction reference.
* 📥 **CSV Export:** Export transactions to CSV format for external analysis.
* 📲 **Progressive Web App (PWA):** Install as a mobile app for offline access and app-like experience.
* 🔐 **Email Verification:** Secure account setup with email verification.
* 👤 **Profile Management:** Edit profile, change password, and manage account settings.

## 🚀 Getting Started

### Prerequisites

- **Docker** and **Docker Compose** installed
- Git (for cloning the repository)

No need to install PHP, Node.js, or PostgreSQL locally — everything runs in Docker containers!

### Quick Setup (Automated)

```bash
git clone <repository-url>
cd SpendSense

# Run the setup script
chmod +x setup.sh
./setup.sh
```

The script will:
- Install PHP dependencies
- Create and configure the `.env` file
- Generate the application key
- Run database migrations
- Install Node.js dependencies
- Build frontend assets

### Manual Setup (Step-by-Step)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd SpendSense
   ```

2. **Create the environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Install PHP dependencies:**
   ```bash
   docker run --rm -u "$(id -u):$(id -g)" -v "$(pwd):/var/www/html" -w /var/www/html laravelsail/php83-composer:latest composer install --ignore-platform-reqs
   ```

4. **Start the Docker containers:**
   ```bash
   ./vendor/bin/sail up -d
   ```

5. **Generate the app key and run migrations:**
   ```bash
   ./vendor/bin/sail artisan key:generate
   ./vendor/bin/sail artisan migrate
   ```

6. **Install and build frontend assets:**
   ```bash
   ./vendor/bin/sail npm install
   ./vendor/bin/sail npm run build
   ```

7. **Access the application:**
   - Application: http://localhost
   - Create an account and start managing your finances!

### Development Mode

To run the application in development mode with hot-reload for both backend and frontend:

```bash
# All services will run concurrently:
# - Laravel server on :8000
# - Queue worker
# - Pail (logs viewer)
# - Vite dev server (with hot reload)
composer run dev
```

Or use Sail directly:
```bash
./vendor/bin/sail artisan serve
./vendor/bin/sail npm run dev
```

### Useful Commands

```bash
# View application logs
./vendor/bin/sail pail

# Run tests
./vendor/bin/sail test

# Run linting
./vendor/bin/sail pint

# Tinker shell (interactive PHP REPL)
./vendor/bin/sail tinker

# DB migrations
./vendor/bin/sail artisan migrate
./vendor/bin/sail artisan migrate:rollback
./vendor/bin/sail artisan migrate:refresh

# Run scheduler locally (required for recurring transactions automation)
./vendor/bin/sail artisan schedule:work

# Process recurring transactions manually
./vendor/bin/sail artisan app:process-recurring
```

### Recurring Transactions Automation

The project schedules `app:process-recurring` to run daily at `00:05` via Laravel Scheduler.

- **Local development:** run `./vendor/bin/sail artisan schedule:work` in a terminal.
- **Production:** configure cron to run Laravel scheduler every minute:

```bash
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

### Stopping the Project

```bash
./vendor/bin/sail stop
```

## 📚 Project Structure

- **`app/`** - Application code (Models, Controllers, Requests)
- **`resources/`** - Frontend assets and Blade views
- **`routes/`** - Application routes (web, API, auth)
- **`database/`** - Migrations and seeders
- **`config/`** - Configuration files
- **`public/`** - Publicly accessible files

## 🔒 Security & Privacy

- **Data Isolation:** User-based data isolation ensures users can only access their own financial data
- **Authentication:** Secure authentication using Laravel Breeze and Sanctum
- **Self-Hosted:** Complete control over your data — run locally on your own server
- **No Tracking:** No external tracking, analytics, or data collection
- **Email Verification:** Secure account verification process

## 🚀 Roadmap / Upcoming Features

- [ ] Advanced reporting and financial insights
- [ ] Multi-currency support
- [ ] Data import from bank statements
- [ ] Mobile native apps (iOS/Android)
- [ ] Collaborative budgeting (shared wallets)
- [ ] Receipt OCR (automated expense extraction from photos)
- [ ] AI-powered spending predictions
- [ ] Investment tracking
- [ ] Bill reminders and notifications

## 📝 Database Schema

Key entities in the application:

- **Users** - User accounts with authentication
- **Transactions** - Income and expense records with dates, amounts, and receipts
- **Categories** - Transaction categorization
- **Wallets** - Multiple account/wallet management
- **Tags** - Additional transaction labeling
- **Budgets** - Monthly budget tracking by category
- **SavingsGoals** - Savings goal tracking with progress
- **RecurringTransactions** - Automatic recurring transaction management

See `database/migrations/` for detailed schema definitions.

## 🤝 Contributing

This is a personal project, but contributions are welcome! Feel free to:
- Report bugs by opening an issue
- Suggest improvements
- Submit pull requests with enhancements

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 💬 Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Built with ❤️ for personal finance management**