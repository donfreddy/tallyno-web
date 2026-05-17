# Tallyno Web 💸

Tallyno is a web platform designed to simplify shared expenses and group debt management (specifically tailored for Cameroon and Africa). No more Excel sheets and disputes: Tallyno calculates who owes what, generates clear summaries to share on WhatsApp, and integrates direct Mobile Money payments (MTN, Orange).

## 🌟 Features

- **Automatic Calculation:** Automatically determines the exact share of each member in a group.
- **WhatsApp-First:** Generates clear, easy-to-read summaries that can be copied/pasted directly into WhatsApp groups.
- **Dedicated Views:**
  - **Group Balance (`/g/[token]`)**: Global view of net positions and simplified debts to settle the group.
  - **Detailed Expense (`/s/[token]`)**: Detailed breakdown of a specific expense for all participants.
  - **Personal View (`/s/[token]/me`)**: User-centric summary showing exactly how much they owe and to whom.
- **Mobile Money Deep Links:** Direct links to settle debts via MTN Mobile Money or Orange Money.
- **Modern Design:** Smooth, responsive, and animated user interface (Vue 3 + Tailwind CSS 4).

## 🛠️ Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com/) / [Vue 3](https://vuejs.org/)
- **UI & Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [@nuxt/ui](https://ui.nuxt.com/)
- **Fonts:** DM Sans & DM Mono

## 📂 Project Structure

Main pages are located in the `app/pages/` directory:

- `index.vue`: Landing page explaining the concept and encouraging mobile app downloads.
- `g/[token].vue`: Group balance page displaying everyone's balance and simplified debts.
- `s/[token]/index.vue`: Detailed page for a specific expense.
- `s/[token]/me.vue`: Personal view indicating "Your share" to pay for an expense.

## 🚀 Installation & Setup

This project uses a `Makefile` to simplify common commands, but you can also use `npm` directly.

### Prerequisites

- [Node.js](https://nodejs.org/) (recommended version)
- npm

### 1. Clone and install dependencies

```bash
git clone https://github.com/lehmora/tallyno-web.git
cd tallyno-web
make install
# or npm install
```

### 2. Start the development server

```bash
make dev
# or npm run dev
```

The application will be accessible at `http://localhost:3003` (port configured in `package.json`).

### 3. Build for production

```bash
make build
# or npm run build
```

To locally preview the production build:

```bash
make preview
# or npm run preview
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
*Managed with Tallyno • Shared expenses without disputes*
