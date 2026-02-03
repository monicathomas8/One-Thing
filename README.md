# One Thing App 🌱

**One Thing** is a calm, mobile-first web app designed to help reduce overwhelm by guiding you to focus on just one meaningful task at a time.

Instead of long to-do lists and pressure to do everything, this app encourages you to:
- get thoughts out of your head
- tune into the *vibe* of each task
- choose one gentle focus for today
- breathe before you begin

> *Give me the vibe, I’ll do the sorting. You’re not doing this alone.*

---

## 🚀 Live App

👉 https://just-onething.netlify.app/

One Thing is built as a **Progressive Web App (PWA)**, meaning it can be installed on desktop and mobile and used like a native app.

---
## 📲 Install as an App

### Desktop (Chrome / Edge)
- Open the app in your browser
- Click the **Install** icon in the address bar
- Confirm to install

### iOS (iPhone / iPad)
- Open the app in **Safari**
- Tap the **Share** icon
- Select **Add to Home Screen**

### Android
- Open the app in **Chrome**
- Tap the **menu (⋮)**
- Select **Install app** or **Add to Home screen**

Once installed, the app opens full-screen and works offline after the first load.

---

## ✨ What the app does

### 🌤️ Daily affirmation
- Displays a supportive daily focus message.
- Changes automatically each day, but stays consistent throughout the day.

### 🧠 Brain dump
- Quickly add tasks without pressure.
- Encourages keeping tasks small and manageable.

### 🎛️ Vibe check (optional)
After adding a task, you can give it a quick “vibe”:
- **Relief level**: big / medium / small  
- **Time needed**: 5m / 15m / 30m / 60m+  
- **Time sensitivity**: soon / later / not really  

These values are used to help the app decide what your *One Thing* should be.

### 📋 Task list
- View all tasks in one place.
- Mark tasks as done.
- Delete tasks you no longer need.
- See progress indicators such as:
  - started status
  - minutes completed
  - notes preview

### 🎯 Pick My One Thing
- Scores tasks based on their vibe.
- Chooses gently using a mix of logic and randomness.
- Opens **Focus Mode** to help you start without friction.

### 🧘 Focus Mode
- Appears as a distraction-free overlay.
- Add notes or a tiny first step.
- Track progress with “I did 5 mins”.
- Mark tasks complete directly from the overlay.

### 🌬️ Breathing tool
- Dedicated breathing experience.
- Full-screen on mobile for maximum calm.
- Animated breathing circle with timed prompts.
- Can be accessed independently at any time.

### 💾 Local storage
- Tasks, notes, and progress are saved automatically.
- No accounts, no sign-ups.
- Data persists between sessions using `localStorage`.

---

## 📱 Mobile-first experience

- **Desktop**: dashboard-style layout where all sections are visible.
- **Mobile**: one panel at a time to reduce cognitive overload.

Mobile navigation allows switching between:
- Today
- Brain dump
- List
- One Thing
- Breathe

This design choice was made intentionally to make the app feel calm and focused on smaller screens.

---

## 🧠 How “One Thing” is chosen

Each task is scored based on its vibe:
- Bigger emotional relief scores higher
- Time-sensitive tasks score higher
- Shorter tasks score higher (easier to start)

The app then:
- takes the top 3 scored tasks
- chooses one at random

This avoids the app feeling rigid or judgmental while still offering helpful guidance.

---

## 🛠 Technologies Used

- HTML  
- CSS  
- JavaScript  
- Progressive Web App (PWA)
- Service Worker (offline support)
- Netlify (hosting & deployment).

---

## 🧪 Testing

### Manual testing
- Tasks can be added and removed correctly
- Blank tasks are prevented
- Vibe selections visibly update and save
- Focus Mode opens and closes correctly
- Notes save automatically as you type
- Progress tracking updates task previews
- Breathing animation starts and stops cleanly
- Tasks persist after page refresh

### Responsive testing
- Desktop layout behaves as expected
- Mobile layout switches to single-panel navigation
- Breathing tool fills the screen on mobile

---

## 🔮 Future improvements

- Edit task text after creation
- Search or filter tasks
- Optional gentle stats (no pressure)
- Sound options for breathing (toggleable)
- Light / dark theme toggle

---

## 📌 Purpose

This project started as a **one-day app** to practise:
- clean HTML structure
- responsive CSS
- thoughtful JavaScript state management
- mobile-first UX decisions
It has now become an ongoing project, to help improve my coding skills and update a live project with new features as the requesta come live. 

More importantly, it was designed to be **genuinely useful**, not just a technical exercise.

---

## ✨ Author

Built with intention by **Monica Thomas**  
Front-end developer with a focus on calm, human-centred digital experiences.
