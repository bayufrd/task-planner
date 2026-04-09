# Pemrograman Fullstack - Individual Assignments

**Repository untuk Individual Assignments - Pemrograman Fullstack Course**

[![UNDIRA](https://img.shields.io/badge/UNDIRA-Pemrograman%20Fullstack-blue)](https://undira.ac.id)
[![Course](https://img.shields.io/badge/Course-Fullstack%20Programming-green)](https://undira.ac.id)
[![Individual](https://img.shields.io/badge/Type-Individual%20Assignments-orange)](#)

---

## 📝 Overview

Repository ini berisi **individual assignments dan coursework** untuk mata kuliah **Pemrograman Fullstack** di Universitas Dian Nuswantoro (UNDIRA).

Setiap assignment dirancang untuk melatih dan mengembangkan skills dalam fullstack web development menggunakan modern technologies dan best practices.

> **Note**: Ini adalah repository untuk **individual coursework**. Untuk **Tugas Besar (Group Project)**, lihat: [Smart Task Planner - GitLab](https://gitlab.com/pemrograman-fullstack-kelompok-4-undira/task-planner.git)

---

## 📁 Folder Structure

```
📦 Pemrograman Fullstack/
 ├── 📁 Assignment 1/
 ├── 📁 Assignment 2/
 ├── 📁 Assignment 3/
 └── ... (Individual Projects)
```

---

## 🛠️ Technology Stack

- **Frontend**: React, Next.js, TypeScript, TailwindCSS
- **Backend**: Node.js, Express, Next.js API Routes
- **Database**: MySQL, PostgreSQL, MongoDB
- **Tools**: Git, npm, Docker (optional)

---

## 📚 Course Information

- **Course**: Pemrograman Fullstack
- **University**: UNDIRA (Universitas Dian Nuswantoro)
- **Semester**: Semester 5+
- **Instructor**: Faculty of Information Technology

---

## 🚀 Getting Started

Setiap assignment memiliki struktur dan setup instructions sendiri. Lihat folder assignment yang relevan untuk detail lebih lanjut.

Untuk setup environment secara umum:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📋 Assignment Checklist

- [ ] Assignment 1
- [ ] Assignment 2
- [ ] Assignment 3
- [ ] Midterm Project
- [ ] Final Project

---

## 🤝 Contributing

Ini adalah repository individual. Untuk kolaborasi atau diskusi, hubungi instructor atau gunakan course platform.

---

## 📞 Contact

- **Email**: bayu.farid36@gmail.com
- **Course Platform**: [UNDIRA LMS](https://lms.undira.ac.id)

---

## 📄 License

Coursework assignments – for academic purposes only.

---

## ⚙️ Maven Setup (Windows, PowerShell)

**1. Set `MAVEN_HOME` (permanent, User level):**
```powershell
[System.Environment]::SetEnvironmentVariable("MAVEN_HOME", "D:\maven\apache-maven-3.9.6", [System.EnvironmentVariableTarget]::User)
```

**2. Add Maven `bin` to `PATH` (permanent, User level):**
```powershell
$p = [System.Environment]::GetEnvironmentVariable("PATH", [System.EnvironmentVariableTarget]::User)
[System.Environment]::SetEnvironmentVariable("PATH", "D:\maven\apache-maven-3.9.6\bin;$p", [System.EnvironmentVariableTarget]::User)
```

**3. Refresh environment variables in current session:**
```powershell
$env:MAVEN_HOME = "D:\maven\apache-maven-3.9.6"
$env:PATH = "D:\maven\apache-maven-3.9.6\bin;$env:PATH"
$env:JAVA_HOME = "C:\Program Files\Java\jdk-25"
```

**4. Verify installation:**
```powershell
mvn --version
```

---

*Last Updated: April 2026 | UNDIRA Pemrograman Fullstack Course*
