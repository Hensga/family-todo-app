# Familien-ToDo-App

Eine Familien-ToDo-App entwickelt mit Remix und Firebase.

## Installation

1. Repository klonen:

```bash
git clone https://github.com/ihr-username/familien-todo-app.git
cd familien-todo-app
```

2. Abhängigkeiten installieren:

```bash
npm install
```

3. Umgebungsvariablen konfigurieren:

   - Kopieren Sie `.env.example` zu `.env`
   - Tragen Sie Ihre Firebase-Konfigurationswerte ein
   - Generieren Sie einen sicheren SESSION_SECRET

4. Entwicklungsserver starten:

```bash
npm run dev
```

## Firebase-Einrichtung

1. Erstellen Sie ein neues Projekt in der [Firebase Console](https://console.firebase.google.com)
2. Aktivieren Sie Authentication mit Email/Passwort
3. Erstellen Sie eine Firestore-Datenbank
4. Kopieren Sie die Projektkonfiguration in Ihre `.env` Datei

## Entwicklung

```bash
npm run dev
```

## Produktion

Build erstellen:

```bash
npm run build
```

Produktionsserver starten:

```bash
npm start
```

## Lizenz

MIT
