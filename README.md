# 🍽️ CampusCraver

> An in-house smart canteen system for schools and colleges — making campus food ordering fast, simple, and digital.

---

## 📌 About

CampusCraver is a web-based canteen management system designed for educational institutions. It allows students to browse the canteen menu, place orders, and manage their food experience — all from their browser, without standing in long queues.

---

## 🚀 Features

- 🧾 Browse canteen menu items
- 🛒 Add items to cart and place orders
- 🔐 User authentication (login/signup)
- 📦 Order management
- ⚡ Fast and responsive UI

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router DOM, Vite    |
| Backend    | Node.js, Express                    |
| Database   | MongoDB                             |
| Styling    | CSS                                 |
| Build Tool | Vite                                |

---

## 📁 Project Structure

```
CampusCraver/
├── backend/          # Node.js + Express REST API
├── src/              # React frontend source
├── public/           # Static assets
├── dist/             # Production build output
├── index.html        # App entry point
├── vite.config.js    # Vite configuration
└── package.json      # Frontend dependencies
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or above)
- MongoDB (local or Atlas)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/Pushpesh18/CampusCraver.git
cd CampusCraver
```

### 2. Setup the Frontend

```bash
npm install
npm run dev
```

### 3. Setup the Backend

```bash
cd backend
npm install
node index.js
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

---

## 📜 Available Scripts

| Script          | Description                        |
|-----------------|------------------------------------|
| `npm run dev`   | Start frontend development server  |
| `npm run build` | Build frontend for production      |
| `npm run preview` | Preview production build         |
| `npm run lint`  | Run ESLint on source files         |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **GPL-2.0 License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Pushpesh18** — [GitHub Profile](https://github.com/Pushpesh18)

---

> Made with ❤️ for campus life
